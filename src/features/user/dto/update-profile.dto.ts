import { ApiModelProperty } from '@nestjs/swagger';
import { Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
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
