import { AWSError } from 'aws-sdk';

export class CognitoError extends Error {
  constructor(error: Error) {
    const errorMsg = `${error.message}`;
    super(errorMsg);
    Object.setPrototypeOf(this, CognitoError.prototype);
  }
}