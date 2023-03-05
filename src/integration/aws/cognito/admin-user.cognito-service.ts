import { Injectable } from '@nestjs/common';

import { cognitoPoolId } from '@bn-config';
import { cognitoServiceProvider } from './cognito-service-provider';

@Injectable()
export class AdminUserCognitoService {

  async deleteUser(username): Promise<any> {
    const params = {
      UserPoolId: cognitoPoolId,
      Username: username,
    };
    const serviceProvider = cognitoServiceProvider;
    return new Promise((resolve, reject) => {
      serviceProvider.adminDeleteUser(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
