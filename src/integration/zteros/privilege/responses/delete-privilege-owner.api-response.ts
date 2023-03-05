import { BaseApiResponse } from '../../base.api-response';

export interface DeletePrivilegeOwnerApiResponse extends BaseApiResponse {
  userId: string;
  privilegeId: string;
}
