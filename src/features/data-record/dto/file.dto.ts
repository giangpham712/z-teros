import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FileDto {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}
