import { HttpService, Injectable } from '@nestjs/common';
import { UserRole } from '@bn-enum/user-role.enum';
import { BaseApiResponse } from '@bn-integration/zteros/base.api-response';

@Injectable()
export class UserZterosService {
  constructor(private readonly httpService: HttpService) {
  }

  async createUser(adminUID: string, userType: string): Promise<BaseApiResponse> {
    const requestPath = `/${userType}s?adminUID=${adminUID}`;
    return this.httpService.post(requestPath).toPromise().then(response => {
      const data = response.data;
      return {
        uid: userType === 'owner' ? data.OwnerUID : data.UserUID,
      };
    });
  }

  async deleteUser(adminUID: string, userType: string, userUID: string): Promise<BaseApiResponse> {
    const requestUrl = `/${userType}s/${userUID}?adminUID=${adminUID}`;
    return this.httpService.delete(requestUrl).toPromise().then(response => {
      const data = response.data;
      return {
        uid: userType === 'owner' ? data.OwnerUID : data.UserUID,
      };
    });
  }
}
