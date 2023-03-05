import { ApiResponse } from '../../../../shared/types/api-response';

export interface CreatePrivilegeApiResponse extends ApiResponse {
  privilegeUID: string;
}
