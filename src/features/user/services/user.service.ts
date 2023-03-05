import { Injectable, NotFoundException } from '@nestjs/common';

import { UserDataService } from './user.data-service';
import { UserZterosService } from '@bn-integration/zteros/user/user-zteros.service';
import { AdminUserCognitoService } from '@bn-integration/aws/cognito/admin-user.cognito-service';
import { UserRO } from '../response-object/user.ro';

@Injectable()
export class UserService {
  constructor(private readonly userDataService: UserDataService,
              private readonly userZterosService: UserZterosService,
              private readonly cognitoService: AdminUserCognitoService) {
  }

  async getAllUser(): Promise<UserRO[]> {
    const users = await this.userDataService.getUsers() || [];
    return users.map(user => {
      const userObject = user.toJSON();
      const userRo: UserRO = { ...userObject };
      return userRo;
    });
  }

  async updateUser(userId, updateInfo) {
    const updated = await this.userDataService.updateUserInfo(userId, updateInfo);
  }

  async deleteUser(admin, userId) {
    const userData = await this.userDataService.getUser(userId);

    if (!userData) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    // Delete Owner user role from zTeros
    await this.userZterosService.deleteUser(admin.adminUid, 'owner', userData.ownerUid)

    // Delete User user role from zTeros
    await this.userZterosService.deleteUser(admin.adminUid, 'user', userData.userUid)

    // Delete user from Cognito
    await this.cognitoService.deleteUser(userData.email);

    // Delete user from Mongo
    await this.userDataService.deleteUser(userId);
  }
}
