import { UserRole } from '@bn-enum/user-role.enum';

export interface RequestUserAttachmentInterface {
  id: string;
  zTerosUid: string;
  email: string;
  role: UserRole;
}
