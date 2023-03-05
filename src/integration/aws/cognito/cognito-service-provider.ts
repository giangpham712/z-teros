import * as AWS from 'aws-sdk';

import { awsAccessKeyId, awsSecretAccessKey, cognitoRegion } from '@bn-config';

export const cognitoServiceProvider = new AWS.CognitoIdentityServiceProvider({
  accessKeyId: awsAccessKeyId,
  secretAccessKey: awsSecretAccessKey,
  region: cognitoRegion,
});
