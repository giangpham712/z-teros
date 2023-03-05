export class DatabaseConstants {
  static readonly dbToken = 'DBToken';
}

export function getCollectionToken(collection: BnCollections) {
  switch (collection) {
    case BnCollections.User:
      return 'UserToken';
    case BnCollections.Privilege:
      return 'PrivilegeToken';
    case BnCollections.DataRecord:
      return 'DataRecordToken';
  }
}

export function getCollectionName(collection: BnCollections) {
  switch (collection) {
    case BnCollections.User:
      return 'user';
    case BnCollections.Privilege:
      return 'privilege';
    case BnCollections.DataRecord:
      return 'data-record';
  }
}

export enum BnCollections {
  User,
  Privilege = 1,
  DataRecord = 2,
}
