import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { BnCollections, getCollectionToken } from '@bn-database/database.constant';

@Injectable()
export class AuthDataService {
  constructor(@Inject(getCollectionToken(BnCollections.User)) private readonly userModel: Model) {
  }

  async createUser(userData) {
    const newUser = new this.userModel({
      email: userData.email,
      ownerUid: userData.zTerosOwnerUid,
      userUid: userData.zTerosUserUid,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
    });
    await newUser.save();
    return newUser.toJSON();
  }

  async getUserDetail(email) {
    return await this.userModel.findOne({ email }).exec();
  }
}
