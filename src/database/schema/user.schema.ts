import { Schema } from 'mongoose';
import { UserRole } from '@bn-enum/user-role.enum';

export const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  adminUid: {
    type: String,
    unique: true,
    sparse: true
  },
  ownerUid: {
    type: String,
    unique: true,
    sparse: true
  },
  userUid: {
    type: String,
    unique: true,
    sparse: true
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  role: { type: Number, enum: Object.values(UserRole), default: UserRole.User },
});
UserSchema.set('toJSON', {
  transform: (doc, result) => {
    return {
      id: result._id,
      email: result.email,
      firstName: result.firstName,
      lastName: result.lastName,
      role: result.role
    };
  },
});
