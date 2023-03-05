import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { FolderDto } from './folder.dto';
import { Type } from 'class-transformer';

export class CreateFolderDto {
  @ApiModelProperty({
    description: 'Folder reference',
    required: false,
    type: FolderDto ,
  })
  @Type(() => FolderDto)
  readonly parent: FolderDto;

  @ApiModelProperty()
  @IsNotEmpty({
    message: 'Folder name must not be empty',
  })
  readonly name: string;
}
