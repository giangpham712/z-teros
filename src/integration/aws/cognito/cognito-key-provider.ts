import * as Axios from 'axios';
import * as jwkToPem from 'jwk-to-pem';

import { cognitoPoolId, cognitoRegion } from '@bn-config';

interface TokenHeader {
  kid: string;
  alg: string;
}

interface PublicKey {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}

interface PublicKeyMeta {
  instance: PublicKey;
  pem: string;
}

interface PublicKeys {
  keys: PublicKey[];
}

interface MapOfKidToPublicKey {
  [key: string]: PublicKeyMeta;
}

if (!cognitoPoolId) {
  throw new Error('env var required for cognito pool');
}
const cognitoIssuer = `https://cognito-idp.${cognitoRegion}.amazonaws.com/${cognitoPoolId}`;
let cacheKeys: MapOfKidToPublicKey | undefined;
const getPublicKeys = async (): Promise<MapOfKidToPublicKey> => {
  if (!cacheKeys) {
    const url = `${cognitoIssuer}/.well-known/jwks.json`;
    const publicKeys = await Axios.default.get<PublicKeys>(url);
    cacheKeys = publicKeys.data.keys.reduce((agg, current) => {
      // @ts-ignore
      const pem = jwkToPem(current);
      agg[current.kid] = { instance: current, pem };
      return agg;
    }, {} as MapOfKidToPublicKey);
    return cacheKeys;
  } else {
    return cacheKeys;
  }
};

const cognitoKeyProvider = async (req, rawJwtToken, cb) => {
  const tokenSections = (rawJwtToken || '').split('.');
  const keys = await getPublicKeys();
  if (tokenSections.length < 2) {
    throw new Error('requested token is invalid');
  }
  const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
  try {
    const header = JSON.parse(headerJSON) as TokenHeader;
    if (!keys) {
      cb(new Error('Cannot get cognito key'), null);
    }

    const key = keys[header.kid];
    cb(null, key.pem);
  } catch (e) {
    throw new Error('requested token is invalid');
  }
};

export { cognitoKeyProvider };
