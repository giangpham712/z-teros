import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';

import { IsEmailAlreadyExist } from '@bn-validator/is-email-already-exist.validator';

export class CreateUserDto {
  @ApiModelProperty()
  @IsEmail()
  @IsEmailAlreadyExist({
    message: 'Email $value already exists. Choose another name.',
  })
  readonly email: string;

  @ApiModelProperty()
  @MinLength(8, {
    message: 'Min length is 8 characters',
  })
  readonly password: string;

  @ApiModelProperty()
  @MinLength(1, {
    message: 'Minimum length is 1 characters',
  })
  @MaxLength(50, {
    message: 'Maximum length is 50 characters',
  })
  @Matches(/^[a-z ]+$/i, {
    message: 'name contains only text',
  })
  readonly firstName: string;

  @ApiModelProperty()
  @MinLength(1, {
    message: 'Minimum length is 1 characters',
  })
  @MaxLength(50, {
    message: 'Maximum length is 20 characters',
  })
  @Matches(/^[a-z ]+$/i, {
    message: 'name contains only text',
  })
  readonly lastName: string;
}
