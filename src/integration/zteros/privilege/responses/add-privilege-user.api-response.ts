import { BaseApiResponse } from '../../base.api-response';

export interface AddPrivilegeUserApiResponse extends BaseApiResponse {
  userId: string;
  privilegeId: string;
}
