import { BaseApiResponse } from '../../base.api-response';

export interface DeletePrivilegeUserApiResponse extends BaseApiResponse {
  userId: string;
  privilegeId: string;
}
