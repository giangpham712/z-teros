import { ApiModelProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiModelProperty({
    required: true,
    type: String,
  })
  readonly id: string;
}
