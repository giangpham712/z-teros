import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { BnCollections, getCollectionToken } from '@bn-database/database.constant';

@Injectable()
export class PrivilegeDataService {
  constructor(@Inject(getCollectionToken(BnCollections.Privilege)) private readonly privilegeModel: Model) {
  }

  async getPrivilege(privilegeId) {
    return this.privilegeModel.findById(privilegeId, 'name uid').exec();
  }

  async getPrivileges() {
    return this.privilegeModel.find().exec();
  }

  async createPrivilege(privilegeData) {
    const newPrivilege = new this.privilegeModel({
      name: privilegeData.name,
      uid: privilegeData.uid,
    });
    await newPrivilege.save();
    return newPrivilege;
  }

  async updatePrivilege(privilegeId, privilegeData) {
    const privilegeUpdate = {
      name: privilegeData.name,
    };
    await this.privilegeModel.findByIdAndUpdate(privilegeId, privilegeUpdate).exec();
  }

  async deletePrivilege(privilegeId) {
    await this.privilegeModel.findByIdAndRemove(privilegeId).exec();
  }
}
