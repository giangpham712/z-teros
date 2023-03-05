import { BaseApiResponse } from '../../base.api-response';

export interface DeleteOwnerPrivilegeApiResponse extends BaseApiResponse {
  userId: string;
  privilegeId: string;
}
