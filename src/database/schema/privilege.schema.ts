import { Schema } from 'mongoose';
import { UserSchema } from '@bn-schema/user.schema';

export const PrivilegeSchema = new Schema({
  name: {
    type: String,
    unique: false,
  },
  uid: {
    type: String,
    unique: true,
    require: true,
  },
});
PrivilegeSchema.set('toJSON', {
  transform: (doc, result) => {
    return {
      id: result._id,
      name: result.name,
    };
  },
});
