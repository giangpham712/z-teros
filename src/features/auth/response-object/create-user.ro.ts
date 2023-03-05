import { UserRole } from "@bn-enum/user-role.enum";

export interface CreateUserRO {
  id: string;
  email: string;
  role: UserRole;
}
