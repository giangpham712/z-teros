import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { BnCollections, getCollectionToken } from '@bn-database/database.constant';

@Injectable()
export class UserDataService {
  constructor(@Inject(getCollectionToken(BnCollections.User)) private readonly userModel: Model) {
  }

  async getUser(userId) {
    return await this.userModel.findById(userId).exec();
  }

  async getUsers() {
    return await this.userModel.find().exec();
  }

  async getUsersByIds(ids: string[]) {
    return this.userModel.find({ _id: { $in: ids }}).exec();
  }

  async getUsersByOwnerUids(uids: string[]) {
    return this.userModel.find({ ownerUid: { $in: uids }}).exec();
  }

  async getUsersByUserUids(uids: string[]) {
    return this.userModel.find({ userUid: { $in: uids }}).exec();
  }

  async updateUserInfo(userId, userInfo) {
    const updateInfo = {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
    };
    await this.userModel.findByIdAndUpdate(userId, updateInfo).exec();
  }

  async deleteUser(userId) {
    await this.userModel.findByIdAndRemove(userId).exec();
  }
}
