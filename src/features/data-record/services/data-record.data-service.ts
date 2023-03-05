import { Inject, Injectable, Logger } from '@nestjs/common';
import { BnCollections, getCollectionToken } from '@bn-database/database.constant';
import { Model } from 'mongoose';
import { failure, Result, success } from './error-handling.type';
import { RecordType } from '@bn-enum/record-type.enum';
import { DataRecordErrorCode, DataRecordErrorInfo } from './data-record.error-info';
import * as mongoose from 'mongoose';
import { DataServiceBase } from 'shared/services/data-service-base.service';

@Injectable()
export class DataRecordDataService extends DataServiceBase {
  private logger = new Logger('DataRecordDataService');

  constructor(
    @Inject(getCollectionToken(BnCollections.DataRecord))
    private readonly dataRecordModel: Model) {
    super();  
  }

  async createFolder(name: string, parent: Model): Promise<string> {
    const folder = new this.dataRecordModel({
      recordType: RecordType.Folder,
      name,
    });

    if (parent != null) {
      folder.parentId = parent._id;
    }

    await folder.save();

    return folder._id;
  }

  async getFolderById(folderId: string): Promise<Model> {
    return await this.dataRecordModel.findById(folderId).exec();
  }

  async getRootFolder(folderName: string): Promise<Result<Model, DataRecordErrorInfo>> {
    return this.getFolderByNameAndParentId(folderName, null);
  }

  async getFolderByNameAndParentId(folderName: string, parentId: string): Promise<Result<Model, DataRecordErrorInfo>> {
    const folder: Model = await this.dataRecordModel.findOne({
      name: folderName,
      parentId,
    }).exec();

    if (folder == null) {
      const error: DataRecordErrorInfo = {
        errorCode: DataRecordErrorCode.FOLDER_NOT_FOUND,
        message: `Folder "${folderName} - parendId "${parentId}" does not exist`,
      };
      return failure(error);
    }

    return success(folder);
  }

  async checkFolderExist(parent: Model, name: string): Promise<boolean> {
    let parentId = null;
    if (parent != null) {
      parentId = parent._id;
    }

    let isExisted = false;
    const promise = this.dataRecordModel.find({
      name,
      parentId,
    }).select('_id').exec();

    await promise.then(ids => {
      isExisted = !!ids.length;
    });

    return isExisted;
  }

  async checkSubFolderExist(folder: Model): Promise<boolean> {
    if (folder == null) {
      return false;
    }

    let isExisted = false;
    const promise = this.dataRecordModel.find({
      parentId: folder._id,
    }).select('_id').exec();

    await promise.then(ids => {
      isExisted = !!ids.length;
    });
    return isExisted;
  }

  async getChildrenCountForFolder(folderId: string): Promise<number> {
    return await this.dataRecordModel.find({ parentId: folderId }).count().exec();
  }

  async getChildrenForFolder(folderId: string): Promise<Model[]> {
    return await this.dataRecordModel.find({ parentId: folderId }).exec();
  }

  async deleteFolder(folder: Model): Promise<Result<boolean, Error>> {
    if (folder == null) {
      return failure(new Error('Folder to delete is null'));
    }

    const folderId = folder._id;
    await this.dataRecordModel.findByIdAndRemove(folderId).exec();
    return success(true);
  }

  async getFileById(fileId: string) {
    return await this.dataRecordModel.findById(fileId).exec();
  }

  async getFileByNameAndParent(fileName: string, parentId: string) {
    return await this.dataRecordModel.findOne({
      name: fileName,
      parentId,
    }).exec();
  }

  async createFile(id, fileData): Promise<string> {
    const file = new this.dataRecordModel({
      _id: id,
      recordType: RecordType.File,
      ...fileData,
    });

    await file.save();

    return file._id;
  }

  async updateFile(fileId: string, updateData) {
    await this.dataRecordModel.findByIdAndUpdate(fileId, {
      ...updateData,
    }).exec();
  }

  async deleteFileById(fileId: string) {
    await this.dataRecordModel.findByIdAndRemove(fileId).exec();
  }
}
