import { Connection } from 'mongoose';
import { BnCollections, DatabaseConstants, getCollectionName, getCollectionToken } from './database.constant';
import { UserSchema } from './schema/user.schema';
import { PrivilegeSchema } from './schema/privilege.schema';
import { RecordSchema } from '@bn-schema/data-record.schema';

export const modelProviders = [
  {
    provide: getCollectionToken(BnCollections.User),
    useFactory: (connection: Connection) => connection.model(getCollectionName(BnCollections.User), UserSchema),
    inject: [DatabaseConstants.dbToken],
  },
  {
    provide: getCollectionToken(BnCollections.Privilege),
    useFactory: (connection: Connection) => connection.model(getCollectionName(BnCollections.Privilege), PrivilegeSchema),
    inject: [DatabaseConstants.dbToken],
  },
  {
    provide: getCollectionToken(BnCollections.DataRecord),
    useFactory: (connection: Connection) => connection.model(getCollectionName(BnCollections.DataRecord), RecordSchema),
    inject: [DatabaseConstants.dbToken],
  },
];
