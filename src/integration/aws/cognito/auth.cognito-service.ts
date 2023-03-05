import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import { Injectable } from '@nestjs/common';

import { cognitoClientId, cognitoPoolId } from '@bn-config';
import { CognitoError } from '@bn-integration/aws/cognito/cognito-error';

@Injectable()
export class AuthCognitoService {
  private readonly poolData = {
    UserPoolId: cognitoPoolId,
    ClientId: cognitoClientId,
  };
  private readonly userPool = new AmazonCognitoIdentity.CognitoUserPool(this.poolData);

  async signIn(signInDto): Promise<{ token, refreshToken }> {

    const username = signInDto.email;
    const password = signInDto.password;
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: username,
      Password: password,
    });
    const userData = {
      Username: username,
      Pool: this.userPool,
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve({
            token: result.getAccessToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          });
        },
        onFailure: (err: any) => {
          reject(new CognitoError(err));
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          cognitoUser.completeNewPasswordChallenge(password, requiredAttributes, {
            onSuccess: (result) => {
              resolve({
                token: result.getAccessToken().getJwtToken(),
                refreshToken: result.getRefreshToken().getToken(),
              });
            },
            onFailure: (err: any) => {
              reject(new CognitoError(err));
            },
          });
        },
      });
    });
  }

  async signUp(signUpDto) {
    const email = signUpDto.email;
    const password = signUpDto.password;
    const attributeList = [];

    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'email', Value: email }));
    return new Promise((resolve, reject) => {
      this.userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          reject(new CognitoError(err));
        } else {
          const cognitoUser = result.user;
          resolve(cognitoUser);
        }
      });
    });
  }
}
