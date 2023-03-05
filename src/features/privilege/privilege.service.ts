import * as _ from 'lodash';

import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrivilegeRO } from './response-object/privilege.ro';
import { CreatePrivilegeDto } from './dto/create-privilege.dto';
import { UserDataService } from '../user/services/user.data-service';
import { PrivilegeDataService } from './privilege.data-service';
import { PrivilegeZterosService } from '@bn-integration/zteros/privilege/privilege-zteros.service';
import { UserRO } from './response-object/user.ro';
import { PrivilegeUsersRO } from './response-object/privilege-users.ro';
import { UpdatePrivilegeDto } from './dto/update-privilege.dto';

@Injectable()
export class PrivilegeService {
  constructor(private readonly privilegeDataService: PrivilegeDataService,
              private readonly userDataService: UserDataService,
              private readonly privilegeZterosService: PrivilegeZterosService) {
  }

  async create(requestingOwner: any, createPrivilegeDto: CreatePrivilegeDto): Promise<PrivilegeRO> {
    const privilegeUID = (await this.privilegeZterosService.createPrivilege(requestingOwner.ownerUid)).uid;
    const privilegeData = await this.privilegeDataService.createPrivilege({
      uid: privilegeUID,
      name: createPrivilegeDto.name,
    });

    // Add current user as an associated user of the privilege
    await this.privilegeZterosService.addPrivilegeUser(privilegeUID, requestingOwner.userUid, requestingOwner.ownerUid);
    
    return privilegeData.toJSON();
  }

  async update(requestingOwner: any, privilegeId, updatePrivilegeDto: UpdatePrivilegeDto) {
    const privilegeData = await this.privilegeDataService.getPrivilege(privilegeId);
    const privilegeUID = privilegeData.uid;
    const zTerosPrivilegeUserUIDs = (await this.privilegeZterosService.listUsers(privilegeData.uid)).users;
    const zTerosPrivilegeOwnerUIDs = (await this.privilegeZterosService.listOwners(privilegeData.uid)).owners;

    // Check whether current user is an owner of this privilege
    if (!_.includes(zTerosPrivilegeOwnerUIDs, requestingOwner.ownerUid)) {
      throw new ForbiddenException('You are not an owner of this privilege');
    }
    const updateDtoUsers = await this.userDataService.getUsersByIds(updatePrivilegeDto.users.map(user => user.id));
    const updateDtoOwners = await this.userDataService.getUsersByIds(updatePrivilegeDto.owners.map(user => user.id));

    const updateDtoUserUserUIDs = updateDtoUsers.map(user => user.userUid);
    const updateDtoUserOwnerUIDs = updateDtoOwners.map(user => user.ownerUid);

    // Check whether requested update to privilege includes at least one owner
    if (updateDtoOwners.length == 0) {
      throw new BadRequestException('Privilege must have at least one owner');
    }

    const zTerosUserUIDsToAdd = _.difference(updateDtoUserUserUIDs, zTerosPrivilegeUserUIDs);
    const zTerosOwnerUIDsToAdd = _.difference(updateDtoUserOwnerUIDs, zTerosPrivilegeOwnerUIDs);

    const zTerosUserUIDsToRemove = _.difference(zTerosPrivilegeUserUIDs, updateDtoUserUserUIDs);
    const zTerosOwnerUIDsToRemove = _.difference(zTerosPrivilegeOwnerUIDs, updateDtoUserOwnerUIDs);

    for (const zTerosUserUIDToAdd of zTerosUserUIDsToAdd) {
      await this.privilegeZterosService.addPrivilegeUser(privilegeUID, zTerosUserUIDToAdd, requestingOwner.ownerUid);
    }

    for (const zTerosOwnerUIDToAdd of zTerosOwnerUIDsToAdd) {
      await this.privilegeZterosService.addPrivilegeOwner(privilegeUID, zTerosOwnerUIDToAdd, requestingOwner.ownerUid);
    }

    for (const zTerosUserUIDToRemove of zTerosUserUIDsToRemove) {
      await this.privilegeZterosService.deleteUserPrivilege(zTerosUserUIDToRemove, privilegeUID, requestingOwner.ownerUid);
    }

    for (const zTerosOwnerUIDToRemove of zTerosOwnerUIDsToRemove) {
      await this.privilegeZterosService.deleteOwnerPrivilege(zTerosOwnerUIDToRemove, privilegeUID, requestingOwner.ownerUid);
    }

    // Update name of privilege
    await this.privilegeDataService.updatePrivilege(privilegeId, {
      name: updatePrivilegeDto.name,
    });

    return {
      id: privilegeId,
      name: updatePrivilegeDto.name,
      owners: updateDtoOwners.map(userData => {
        const userObject = userData.toJSON();
        const user: UserRO = { ...userObject };
        return user;
      }),
      users: updateDtoUsers.map(userData => {
        const userObject = userData.toJSON();
        const user: UserRO = { ...userObject };
        return user;
      })
    };
  }

  async delete(requestingOwner: any, privilegeId) {
    const privilegeData = await this.privilegeDataService.getPrivilege(privilegeId);

    const zTerosPrivilegeOwnerUIDs = (await this.privilegeZterosService.listOwners(privilegeData.uid)).owners;

    // Check whether current user is an owner of this privilege
    if (!_.includes(zTerosPrivilegeOwnerUIDs, requestingOwner.ownerUid)) {
      throw new ForbiddenException('You are not an owner of this privilege');
    }
    await this.privilegeZterosService.deletePrivilege(requestingOwner.ownerUid, privilegeData.uid)
      .then(res => {
        return this.privilegeDataService.deletePrivilege(privilegeId);
      });
  }

  async listAll(): Promise<PrivilegeRO[]> {
    const allPrivileges = await this.privilegeDataService.getPrivileges() || [];
    return allPrivileges.map(privilegeData => {
      const privilegeObject = privilegeData.toJSON();
      const privilege: PrivilegeRO = { ...privilegeObject };
      return privilege;
    });
  }

  async get(privilegeId): Promise<PrivilegeRO> {
    const privilegeData = await this.privilegeDataService.getPrivilege(privilegeId);
    const zTerosPrivilegeUserUids = (await this.privilegeZterosService.listUsers(privilegeData.uid)).users;
    const zTerosPrivilegeOwnerUids = (await this.privilegeZterosService.listOwners(privilegeData.uid)).owners;

    const users = await this.userDataService.getUsersByUserUids(zTerosPrivilegeUserUids);
    const owners = await this.userDataService.getUsersByOwnerUids(zTerosPrivilegeOwnerUids);

    return {
      id: privilegeData.id,
      name: privilegeData.name,
      owners: owners.map(userData => {
        const userObject = userData.toJSON();
        const user: UserRO = { ...userObject };
        return user;
      }),
      users: users.map(userData => {
        const userObject = userData.toJSON();
        const user: UserRO = { ...userObject };
        return user;
      })
    } 
  }

  async listUsers(privilegeId): Promise<PrivilegeUsersRO> {
    const { users, owners } = await this.get(privilegeId);
    return {
      users,
      owners
    }
  }
}
