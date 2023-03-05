import { Schema } from 'mongoose';

import { RecordType } from '@bn-enum/record-type.enum';
import { AncestorsHelper } from '@bn-database/helper/ancestor.helper';

export const RecordSchema = new Schema({

  recordType: { type: Number, enum: Object.values(RecordType), default: RecordType.Folder },
  name: String,
  privilegeId: String,
  uid: {
    type: String,
    unique: true,
    sparse: true
  },
  mimeType: String,
  parentId: {
    type: Schema.Types.ObjectId,
  },
  ancestors: [{
    _id: Schema.Types.ObjectId,
    name: String,
  }],
});

RecordSchema.pre('save', async function() {
  const contentCategory = this;
  const model = this.constructor;
  if (!contentCategory.isModified('parentId')) {
    return;
  }
  const parent = await model.findById(contentCategory.parentId, 'name ancestors').exec();
  const descendantNodes = await AncestorsHelper.getSubGraphByParentId(model, contentCategory._id);
  await AncestorsHelper.updateNodeAndDescendants(model, descendantNodes, contentCategory, parent);
});

RecordSchema.set('toJSON', {
  transform: (doc, result) => {
    const json = {
      id: result._id,
      name: result.name,
      recordType: result.recordType,
      parent: null,
    };
    if (result.parentId) {
      json.parent = { id: result.parentId };
    }
    return json;
  },
});
