import { UserRole } from '@bn-enum/user-role.enum';

export interface ValidationUserRO {
  email: string;
  role: UserRole;
}

export interface ValidateRO {
  token: string;
  refreshToken: string;
  user: ValidationUserRO;
}
