import { ApiModelProperty } from '@nestjs/swagger';

export class PrivilegeDto {
  @ApiModelProperty({
    required: true,
    type: String,
  })
  readonly id: string;
}
