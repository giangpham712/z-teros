import { BaseApiResponse } from '../../base.api-response';

export interface AddPrivilegeOwnerApiResponse extends BaseApiResponse {
  ownerId: string;
  privilegeId: string;
}
