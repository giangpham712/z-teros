import { ApiModelProperty } from '@nestjs/swagger';
import { IsObjectId } from '@bn-validator/is-object-id.validator';

export class UpdateFilePrivilegeDto {
  @ApiModelProperty({ description: 'ID of the privilege to set to the file' })
  @IsObjectId({ message: 'Privilege ID $value is invalid' })
  id: string
}
