import { UserRO } from './user.ro';

export interface PrivilegeRO {
  id: string;
  name: string;
  owners: UserRO[]
  users: UserRO[];
}
