import { UserRO } from './user.ro';

export interface PrivilegeUsersRO {
  owners: UserRO[]
  users: UserRO[];
}
