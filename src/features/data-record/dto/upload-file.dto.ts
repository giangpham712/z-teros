import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { FolderDto } from './folder.dto';
import { Type } from 'class-transformer';
import { PrivilegeDto } from './privilege.dto';

export class UploadFileDto {

  @ValidateNested()
  @Type(() => FolderDto)
  readonly parent: FolderDto;

  @ApiModelProperty()
  readonly name: string;

  @ValidateNested()
  @Type(() => PrivilegeDto)
  readonly privilege: PrivilegeDto;
}
