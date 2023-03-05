import { ApiModelProperty } from '@nestjs/swagger';

export class FolderDto {
  @ApiModelProperty({
    required: false,
    type: String,
  })
  readonly id: string;
  @ApiModelProperty({
    required: false,
    type: String,
  })
  readonly path: string;
}
