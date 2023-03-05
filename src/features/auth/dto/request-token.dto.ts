import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class RequestTokenDto {
  @ApiModelProperty()
  @IsEmail()
  readonly email: string;

  @ApiModelProperty()
  @MinLength(8, {
    message: 'Password must have at least 8 characters',
  })
  readonly password: string;
}
