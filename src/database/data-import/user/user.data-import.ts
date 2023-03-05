import { Inject, Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';

import { BnCollections, getCollectionToken } from '@bn-database/database.constant';
import { userSeedData } from '@bn-database/data-import/user/user.seed-data';

@Injectable()
export class UserDataImport {
  constructor(@Inject(getCollectionToken(BnCollections.User)) private readonly userModel: Model) {
    this.startSeed();
  }

  private async startSeed() {
    const count = await this.userModel.countDocuments().exec();
    if (count > 0) {
      return;
    }
    const users = userSeedData.map(user => {
      return new this.userModel({
        _id: mongoose.Types.ObjectId(user.id),
        email: user.email,
        adminUid: user.adminUid,
        ownerUid: user.ownerUid,
        userUid: user.userUid,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
    });
    this.userModel.insertMany(users);
  }
}
