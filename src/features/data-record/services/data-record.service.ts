import { BadRequestException, Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateFolderDto } from '../dto/create-folder.dto';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import { DataRecordDataService } from './data-record.data-service';
import { CreateFolderRO } from '../response-object/create-folder.ro';
import { DataRecordErrorCode } from './data-record.error-info';
import { UploadFileRO } from '../response-object/upload-file.ro';
import { DataRecordZterosService } from '@bn-integration/zteros/data-record/data-record-zteros.service';
import { UploadFileDto } from '../dto/upload-file.dto';
import { FileDto } from '../dto/file.dto';
import { FolderDto } from '../dto/folder.dto';

import { PrivilegeService } from 'features/privilege/privilege.service';
import { PrivilegeDataService } from 'features/privilege/privilege.data-service';

@Injectable()
export class DataRecordService {
  private logger = new Logger('DataRecordService');

  constructor(
    private readonly privilegeService: PrivilegeService,
    private readonly privilegeDataService: PrivilegeDataService,
    private readonly dataRecordDataService: DataRecordDataService,
    private readonly dataRecordZterosService: DataRecordZterosService) {
  }

  async listFolderChildren(folder: FolderDto) {
    let folderData: Model = null;
    if (folder) {
      if (folder.id) {
        folderData = await this.dataRecordDataService.getFolderById(folder.id);
      } else if (folder.path) {
        folderData = await this.getLowestLevelFolder(folder.path);
      } else {
        throw new BadRequestException('Folder id or path is not supplied');
      }

      if (folderData == null) {
        throw new NotFoundException();
      }
    }

    const children = await this.dataRecordDataService.getChildrenForFolder(folderData ? folderData._id : null);
    return children.map(child => {
      return child.toJSON();
    });
  }

  async createFolder(createFolderDto: CreateFolderDto): Promise<CreateFolderRO> {
    const { parent, name } = createFolderDto;

    let parentFolder: Model;
    if (parent == null) {
      parentFolder = null;
    } else if (parent.id) {
      parentFolder = await this.dataRecordDataService.getFolderById(parent.id);
    } else if (parent.path) {
      parentFolder = await this.getLowestLevelFolder(parent.path);
    }
    if (await this.dataRecordDataService.checkFolderExist(parentFolder, name)) {
      throw new BadRequestException(`Folder "${name}" already exists in this path`);
    }

    const folderId: string = await this.dataRecordDataService.createFolder(name, parentFolder);
    return {
      id: folderId,
      name,
      parent: parentFolder,
    };
  }

  async deleteFolderById(folderId: string): Promise<void> {
    const folderToDelete: Model = await this.dataRecordDataService.getFolderById(folderId);
    if (folderToDelete == null) {
      throw new BadRequestException(`Cannot find folder ${folderId}`);
    }
    await this.deleteFolder(folderToDelete);
  }

  private async deleteFolder(folderToDelete: Model) {
    const isSubFolderExisted = await this.dataRecordDataService.checkSubFolderExist(folderToDelete);
    if (isSubFolderExisted) {
      throw new BadRequestException(`Cannot delete folder since it has sub-folder(s)`);
    }
    await this.dataRecordDataService.deleteFolder(folderToDelete);
  }

  private getFolderHierarchy(parentPath: string): string[] {
    let folders: string[] = [];
    if (parentPath && parentPath !== '/') {
      const regexp = /^\/|(\/[\w-.]+)+$/gm;
      const isValidPath = regexp.test(parentPath);
      if (!isValidPath) {
        throw new BadRequestException(`The parent folder path "${parentPath}" is invalid`);
      }
      folders = parentPath.split('/');
      folders.shift();
    }
    return folders;
  }

  private async getLowestLevelFolder(folderPath: string): Promise<Model> {
    const folders: string[] = this.getFolderHierarchy (folderPath);
    if (folders.length === 0) {
      return null;
    }

    const rootFolderName = folders[0];
    let rootFolder: Model = null;
    let result = await this.dataRecordDataService.getRootFolder(rootFolderName);
    result
      .mapSuccess(model => rootFolder = model)
      .mapFailure(error => {
        if (error.errorCode === DataRecordErrorCode.FOLDER_NOT_FOUND) {
          throw new BadRequestException(`Cannot find root folder ${rootFolderName}`);
        }
      });

    let parentFolder: Model = rootFolder;
    for (let i = 1; i < folders.length; i++) {
      const folderName = folders[i];
      result = await this.dataRecordDataService.getFolderByNameAndParentId(folderName, parentFolder._id);
      result
        .mapSuccess(folder => parentFolder = folder)
        .mapFailure(error =>  {
          if (error.errorCode === DataRecordErrorCode.FOLDER_NOT_FOUND) {
            throw new BadRequestException(`Cannot find folder ${folderName}`);
          }
        });
    }
    return parentFolder;
  }

  async uploadFile(user: any, file: FileDto, uploadFileDto: UploadFileDto): Promise<UploadFileRO> {

    // Check parent folder
    let { parent, name } = uploadFileDto;

    let parentFolder: Model;
    if (parent == null) {
      parentFolder = null;
    } else if (parent.id) {
      parentFolder = await this.dataRecordDataService.getFolderById(parent.id);
    } else if (parent.path) {
      parentFolder = await this.getLowestLevelFolder(parent.path);
    }

    if (parentFolder == null) {
      throw new BadRequestException('The path or ID of parent folder is invalid');
    }

    let recordUID: string;
    name = name || file.originalname;
    const fileData = await this.dataRecordDataService.getFileByNameAndParent(name, parentFolder._id);
    if (fileData != null) {
      throw new BadRequestException('A file with the same name already exists');
    } else {
      // Create new record on zTeros
      recordUID = (await this.dataRecordZterosService.createRecord()).uid;
    }

    const content = file.buffer.toString('base64');
    const fileId = new mongoose.Types.ObjectId().toHexString();

    let privilege = null;
    if (uploadFileDto.privilege && uploadFileDto.privilege.id) {
      // Get privilege
      const privilegeData = await this.privilegeDataService.getPrivilege(uploadFileDto.privilege.id);
      if (privilegeData == null) {
        throw new BadRequestException('The privilege ID is invalid');
      }

      privilege = await this.privilegeService.get(uploadFileDto.privilege.id);

      // Check whether current user is an associated user of the privilege
      if (_.find(privilege.users, { id: user._id }) == null) {
        throw new ForbiddenException('You are not an associated user of this privilege');
      }

      // Create private face for the record using new privilege
      await this.dataRecordZterosService.createPrivateFaceForRecord(recordUID, user.userUid, privilegeData.uid);

      // Update content of the private face for the record
      await this.dataRecordZterosService.updatePrivateFaceForRecord(recordUID, user.userUid, privilegeData.uid, content);
    } else {

      // Update content of the public record
      await this.dataRecordZterosService.updatePublicFaceForRecord(recordUID, content);
    }

    // Persist file record in MongoDB
    await this.dataRecordDataService.createFile(fileId, {
      name,
      mimeType: file.mimetype,
      parentId: parentFolder._id,
      uid: recordUID,
      privilegeId: privilege == null ? null : privilege.id,
    });

    return {
      id: fileId,
      name,
      parent: parentFolder,
      privilege,
    };
  }

  async deleteFile(user: any, deleteFileId: string) {
    // Get file from Mongo by ID
    const fileData = await this.dataRecordDataService.getFileById(deleteFileId);
    if (fileData == null) {
      throw new NotFoundException();
    }

    if (fileData.privilegeId) { // File has privilege
      const privilege = await this.privilegeService.get(fileData.privilegeId);
      const privilegeData = await this.privilegeDataService.getPrivilege(fileData.privilegeId);

      // Check whether current user has this privilege
      if (_.find(privilege.users, { id: user._id }) == null) {
        throw new ForbiddenException(`You don't have privilege to delete this file`);
      }
      await this.dataRecordZterosService.deletePrivateFaceForRecord(fileData.uid, user.userUid, privilegeData.uid);
    }
    // Delete data record on Zteros
    await this.dataRecordZterosService.deleteRecord(fileData.uid);

    // Delete file record from Mongo
    await this.dataRecordDataService.deleteFileById(fileData._id);
  }

  async getFile(user: any, fileId: string, includeContent: boolean = false) {
    // Get file from Mongo by ID
    const fileData = await this.dataRecordDataService.getFileById(fileId);
    if (fileData == null) {
      throw new NotFoundException();
    }

    const privilegeData = fileData.privilegeId == null ? null : (await this.privilegeDataService.getPrivilege(fileData.privilegeId));
    const privilege = fileData.privilegeId == null ? null : (await this.privilegeService.get(fileData.privilegeId));

    let content: Buffer = null;

    if (includeContent) {
      let dataRecord;
      if (privilegeData) {
        // Get data record private face from Zteros
        dataRecord = fileData.uid == null ? null : (await this.dataRecordZterosService.getPrivateFaceForRecord(fileData.uid, user.userUid, privilegeData.uid));
      } else {
        // Get data record public face from Zteros
        dataRecord = fileData.uid == null ? null : (await this.dataRecordZterosService.getPublicFaceForRecord(fileData.uid));
      }

      content = dataRecord == null ? null : new Buffer(dataRecord.data, 'base64')
    }

    return {
      id: fileId,
      name: fileData.name,
      mimeType: fileData.mimeType,
      parent: {
        id: fileData.parentId,
        path: null,
      },
      privilege,
      content,
    };
  }

  async updateFilePrivilege(user: any, fileId: string, privilegeId: string) {
    const fileData = await this.dataRecordDataService.getFileById(fileId);
    if (fileData == null) {
      throw new NotFoundException();
    }

    const currentPrivilegeData = fileData.privilegeId == null ? null : (await this.privilegeDataService.getPrivilege(fileData.privilegeId));
    const currentPrivilege = fileData.privilegeId == null ? null : (await this.privilegeService.get(fileData.privilegeId));

    // Check whether current user is a user of the current privilege
    if (currentPrivilege.users.filter(privilegeUser => privilegeUser.id.toString() === user.id).length === 0) {
      throw new ForbiddenException(`You don't have privilege to update this file`);
    }

    if (fileData.privilegeId == privilegeId) {
      // Do nothing
      return currentPrivilege;
    }
    
    const newPrivilegeData = privilegeId ? (await this.privilegeDataService.getPrivilege(privilegeId)) : null;
    const newPrivilege = privilegeId ? (await this.privilegeService.get(privilegeId)) : null;

    // Check whether current user is a user of the new privilege
    if (newPrivilege.users.filter(privilegeUser => privilegeUser.id.toString() === user.id).length === 0) {
      throw new ForbiddenException(`You are not a user of the new privilege`);
    }

    let content: string;
    let recordUID: string = fileData.uid;

    if (currentPrivilegeData == null) {  // File has no privilege
      // Get content of public face
      const dataRecord = await this.dataRecordZterosService.getPublicFaceForRecord(fileData.uid);
      content = dataRecord == null ? null : dataRecord.data;

      // Empty content of public face
      await this.dataRecordZterosService.updatePublicFaceForRecord(fileData.uid, '');

    } else {  // File has privilege
      // Get content of private face
      const dataRecord = await this.dataRecordZterosService.getPrivateFaceForRecord(recordUID, user.userUid, currentPrivilegeData.uid);
      content = dataRecord == null ? null : dataRecord.data;

      try {
        // Delete private face of record
        await this.dataRecordZterosService.deletePrivateFaceForRecord(recordUID, user.userUid, currentPrivilegeData.uid);

        // Delete record
        await this.dataRecordZterosService.deleteRecord(recordUID);

      } catch (e) {
        // Ignore for now because zTeros API can be erroneous
      }

      // Create a new record
      recordUID = (await this.dataRecordZterosService.createRecord()).uid;
    }

    if (newPrivilegeData) {
      // Create private face for the record using new privilege
      await this.dataRecordZterosService.createPrivateFaceForRecord(recordUID, user.userUid, newPrivilegeData.uid);

      // Update content of the private face for the record
      await this.dataRecordZterosService.updatePrivateFaceForRecord(recordUID, user.userUid, newPrivilegeData.uid, content);
    } else { // No privilege or public

      // Update content of public face
      await this.dataRecordZterosService.updatePublicFaceForRecord(recordUID, content);
    }

    await this.dataRecordDataService.updateFile(fileId, {
      privilegeId,
      uid: recordUID,
    });

    return newPrivilege;
  }

}
