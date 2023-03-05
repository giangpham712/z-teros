import * as config from 'config';

export const mongoDbUri = process.env.DB_CONN || config.get('Database.dbConfig.uri');
export const appPort = process.env.PORT || config.get('Application.port');
export const apiVersion = process.env.API_VERSION || config.get('Application.version');
export const isDevMode = process.env.NODE_ENV === 'dev';
export const cognitoPoolId = process.env.COGNITO_POOL_ID || config.get('Amazon.cognitoPoolId');
export const cognitoClientId = process.env.COGNITO_CLIENT_ID || config.get('Amazon.cognitoClientId');
export const cognitoRegion = process.env.COGNITO_REGION || config.get('Amazon.region');
export const zTerosUrl = process.env.ZTEROS_URL || config.get('zTeros.baseUrl');
export const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID || config.get('Amazon.accessKeyId');
export const awsSecretAccessKey = process.env.AWS_ACCESS_KEY_ID || config.get('Amazon.secretAccessKey');
