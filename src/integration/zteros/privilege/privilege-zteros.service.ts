import { HttpService, Injectable } from '@nestjs/common';

import { DeletePrivilegeApiResponse } from './responses/delete-privilege.api-response';
import { AddPrivilegeUserApiResponse } from '@bn-integration/zteros/privilege/responses/add-privilege-user.api-response';
import { ListPrivilegeOwnersApiResponse } from '@bn-integration/zteros/privilege/responses/list-privilege-owners.api-response';
import { ListPrivilegeUsersApiResponse } from '@bn-integration/zteros/privilege/responses/list-privilege-users.api-response';
import { AddPrivilegeOwnerApiResponse } from '@bn-integration/zteros/privilege/responses/add-privilege-owner.api-response';
import { DeletePrivilegeUserApiResponse } from '@bn-integration/zteros/privilege/responses/delete-privilege-user.api-reponse';
import { DeletePrivilegeOwnerApiResponse } from '@bn-integration/zteros/privilege/responses/delete-privilege-owner.api-response';
import { BaseApiResponse } from '@bn-integration/zteros/base.api-response';
import { DeleteUserPrivilegeApiResponse } from '@bn-integration/zteros/privilege/responses/delete-user-privilege.api-response';
import { DeleteOwnerPrivilegeApiResponse } from '@bn-integration/zteros/privilege/responses/delete-owner-privilege.api-response';

@Injectable()
export class PrivilegeZterosService {
  constructor(private readonly httpService: HttpService) {
  }

  async createPrivilege(requestingOwnerUID: string): Promise<BaseApiResponse> {
    const requestUrl = `/privileges?RequestingOwnerUID=${requestingOwnerUID}`;
    return this.httpService.post(requestUrl).toPromise().then(res => {
      const data = res.data;
      return {
        uid: data.PrivilegeUID,
      };
    });
  }

  async deletePrivilege(requestingOwnerUID: string, privilegeUID: string): Promise<DeletePrivilegeApiResponse> {
    const requestUrl = `/privileges/${privilegeUID}?RequestingOwnerUID=${requestingOwnerUID}`;
    return this.httpService.delete(requestUrl).toPromise().then(res => {
      return res.data;
    });
  }

  async listUsers(privilegeUID: string): Promise<ListPrivilegeUsersApiResponse> {
    const requestUrl = `/privileges/${privilegeUID}/users`;
    return this.httpService.get(requestUrl).toPromise().then(res => {
      const data = res.data;
      return {
        users: data.Users,
      };
    });
  }

  async listOwners(privilegeUID: string): Promise<ListPrivilegeOwnersApiResponse> {
    const requestUrl = `/privileges/${privilegeUID}/owners`;
    return this.httpService.get(requestUrl).toPromise().then(res => {
      const data = res.data;
      return {
        owners: data.Owners,
      };
    });
  }

  async addPrivilegeUser(privilegeUID, userUID, requestingOwnerUID): Promise<AddPrivilegeUserApiResponse> {
    const requestUrl = `/privileges/${privilegeUID}/users/${userUID}?RequestingOwnerUID=${requestingOwnerUID}`;
    return this.httpService.put(requestUrl).toPromise().then(res => {
      return res.data;
    });
  }

  async addPrivilegeOwner(privilegeUID, ownerUID, requestingOwnerUID): Promise<AddPrivilegeOwnerApiResponse> {
    const requestUrl = `/privileges/${privilegeUID}/owners/${ownerUID}?RequestingOwnerUID=${requestingOwnerUID}`;
    return this.httpService.put(requestUrl).toPromise().then(res => {
      return res.data;
    });
  }

  async deletePrivilegeUser(privilegeUID, userUID, requestingOwnerUID): Promise<DeletePrivilegeUserApiResponse> {
    const requestUrl = `/privileges/${privilegeUID}/users/${userUID}?RequestingOwnerUID=${requestingOwnerUID}`;
    return this.httpService.delete(requestUrl).toPromise().then(res => {
      return res.data;
    });
  }

  async deletePrivilegeOwner(privilegeUID, ownerUID, requestingOwnerUID): Promise<DeletePrivilegeOwnerApiResponse> {
    const requestUrl = `/privileges/${privilegeUID}/owners/${ownerUID}?RequestingOwnerUID=${requestingOwnerUID}`;
    return this.httpService.delete(requestUrl).toPromise().then(res => {
      return res.data;
    });
  }

  async deleteUserPrivilege(userUID, privilegeUID, requestingOwnerUID): Promise<DeleteUserPrivilegeApiResponse> {
    const requestUrl = `/users/${userUID}/privileges/${privilegeUID}?RequestingOwnerUID=${requestingOwnerUID}`;
    return this.httpService.delete(requestUrl).toPromise().then(res => {
      return res.data;
    });
  }

  async deleteOwnerPrivilege(ownerUID, privilegeUID, requestingOwnerUID): Promise<DeleteOwnerPrivilegeApiResponse> {
    const requestUrl = `/owners/${ownerUID}/privileges/${privilegeUID}?RequestingOwnerUID=${requestingOwnerUID}`;
    return this.httpService.delete(requestUrl).toPromise().then(res => {
      return res.data;
    });
  }
}
