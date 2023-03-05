import * as mongoose from 'mongoose';

export class DataServiceBase {
  validateObjectId(objectId: string): boolean {
    try {
      const id = mongoose.Types.ObjectId(objectId);
      const idStr = id.toString();
      return objectId === idStr;
    } catch (e) {
      return false;
    }
  }
}