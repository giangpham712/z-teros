import { ApiModelProperty } from '@nestjs/swagger';
import { Matches, MaxLength, MinLength } from 'class-validator';

export class CreatePrivilegeDto {
  @ApiModelProperty()
  @MinLength(1, {
    message: 'Name must have at least one character',
  })
  readonly name: string;
}
