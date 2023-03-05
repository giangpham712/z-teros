import { BaseApiResponse } from '../../base.api-response';

export interface DeleteUserPrivilegeApiResponse extends BaseApiResponse {
  userId: string;
  privilegeId: string;
}
