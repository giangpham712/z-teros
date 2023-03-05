export enum DataRecordErrorCode {
  FOLDER_NOT_FOUND = 1,
  FOLDER_ALREADY_EXISTED,
}

export interface DataRecordErrorInfo {
  message: string;
  errorCode: DataRecordErrorCode;
}
