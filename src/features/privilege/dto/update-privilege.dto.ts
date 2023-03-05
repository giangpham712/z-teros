import { ApiModelProperty } from '@nestjs/swagger';
import { Matches, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { UserDto } from './user.dto';
import { Type } from 'class-transformer';

export class UpdatePrivilegeDto {
  @ApiModelProperty()
  @MinLength(1, {
    message: 'Name must have at least one character',
  })
  readonly name: string;

  @ApiModelProperty({type: [UserDto]})
  @ValidateNested()
  @Type(() => UserDto)
  users: UserDto[];

  @ApiModelProperty({type: [UserDto]})
  @ValidateNested()
  @Type(() => UserDto)
  owners: UserDto[];
}
