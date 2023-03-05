import * as fs from 'fs';
import { Body, Controller, Delete, Param, Post, UploadedFile, UseGuards, UseInterceptors, Res, Get, Put, ClassSerializerInterceptor } from '@nestjs/common';
import { ApiBearerAuth, ApiImplicitParam, ApiOperation, ApiUseTags, ApiImplicitFile, ApiConsumes, ApiImplicitBody } from '@nestjs/swagger';
import { Response } from 'express';
import { DataRecordService } from './services/data-record.service';
import { AuthGuard } from '@nestjs/passport';

import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileRO } from './response-object/upload-file.ro';
import { UploadFileDto } from './dto/upload-file.dto';
import { PermissionGuard } from '@bn-guard/permission.guard';
import { Permissions } from '@bn-decorator/permission.decorator';
import { UserRole } from '@bn-enum/user-role.enum';
import { User } from '@bn-decorator/user.decorator';
import { Readable } from 'stream';
import { UpdateFilePrivilegeDto } from './dto/update-file-privilege.dto';
import { ApiImplicitFormData } from '@bn-decorator/api-implicit-form-data.decorator';
import { FileRO } from './response-object/file.ro';

const uploadHtml = fs.readFileSync('swagger/file/upload.html', 'utf8');
const uploadPublicHtml = fs.readFileSync('swagger/file/upload-public.html', 'utf8');
const uploadPrivateHtml = fs.readFileSync('swagger/file/upload-private.html', 'utf8');
const getHtml = fs.readFileSync('swagger/file/get.html', 'utf8');
const downloadHtml = fs.readFileSync('swagger/file/download.html', 'utf8');
const deleteHtml = fs.readFileSync('swagger/file/delete.html', 'utf8');
const getPrivilegeHtml = fs.readFileSync('swagger/file/get-privilege.html', 'utf8');
const updatePrivilegeHtml = fs.readFileSync('swagger/file/update-privilege.html', 'utf8');

@Controller('files')
@ApiUseTags('File Management')
export class FileController {
  constructor(
    private readonly dataRecordService: DataRecordService,
  ) {}

  @ApiOperation({ 
    title: 'Upload New File',
    description: uploadHtml,
  })
  @ApiImplicitFile({ name: 'file', required: true })
  @ApiImplicitFormData({ name: 'name', required: false, type: String })
  @ApiImplicitFormData({ name: 'privilege[id]', required: false, type: String })
  @ApiImplicitFormData({ name: 'parent[path]', required: false, type: String })
  @ApiImplicitFormData({ name: 'parent[id]', required: false, type: String })
  @ApiConsumes('multipart/form-data')
  @Post('')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@User() user, @UploadedFile() file, @Body() uploadFileDto: UploadFileDto): Promise<UploadFileRO> {
    return await this.dataRecordService.uploadFile(user, file, uploadFileDto);
  }

  @ApiOperation({ 
    title: 'View File Information',
    description: getHtml
  })
  @ApiImplicitParam({ name: 'id', type: String })
  @Get(':id')
  @UseGuards(AuthGuard(), PermissionGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  async get(@User() user, @Param('id') fileId) : Promise<FileRO> {
    return await this.dataRecordService.getFile(user, fileId);
  }

  @ApiOperation({ title: 'Download A file' })
  @ApiImplicitParam({ name: 'id' })
  @Get(':id/content')
  @UseGuards(AuthGuard(), PermissionGuard)
  @ApiBearerAuth()
  async download(@User() user, @Param('id') fileId, @Res() res: Response) {
    const file = await this.dataRecordService.getFile(user, fileId, true);
    const buffer = file.content;
    const stream = new Readable();

    stream.push(buffer);
    stream.push(null);

    res.set({
      'Content-Type': file.mimeType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${file.name}`,
      'Content-Length': buffer.length,
    });
    stream.pipe(res);
  }

  @ApiOperation({ 
    title: 'Delete A File',
    description: deleteHtml
  })
  @ApiImplicitParam({ name: 'id' })
  @Delete(':id')
  @UseGuards(AuthGuard(), PermissionGuard)
  @ApiBearerAuth()
  async delete(@User() user, @Param('id') deleteFileId) {
    return await this.dataRecordService.deleteFile(user, deleteFileId);
  }

  @ApiOperation({ 
    title: 'View Access Privileges For A File',
    description: getPrivilegeHtml
  })
  @ApiImplicitParam({ name: 'id' })
  @Get(':id/privilege')
  @UseGuards(AuthGuard(), PermissionGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  async getPrivilege(@User() user, @Param('id') fileId) {
    const file = await this.dataRecordService.getFile(user, fileId);
    return file.privilege;
  }

  @ApiOperation({ 
    title: 'Update Access Privilege For A File',
    description: updatePrivilegeHtml
  })
  @ApiImplicitParam({ name: 'id', description: 'File ID' })
  @Put(':id/privilege')
  @UseGuards(AuthGuard(), PermissionGuard)
  @ApiBearerAuth()
  async updatePrivilege(@User() user, @Param('id') fileId, @Body() updateFilePrivilegeDto: UpdateFilePrivilegeDto) {
    return await this.dataRecordService.updateFilePrivilege(user, fileId, updateFilePrivilegeDto == null ? null : updateFilePrivilegeDto.id);
  }
}
