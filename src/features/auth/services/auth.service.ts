import { Injectable } from '@nestjs/common';

import { CreateUserDto, RequestTokenDto } from '../dto';
import { AuthDataService } from './auth.data-service';
import { UserZterosService } from '@bn-integration/zteros/user/user-zteros.service';
import { ValidateRO } from '../response-object/validate.ro';
import { RequestUserAttachmentInterface } from '../response-object/request-user-attachment.interface';
import { AuthCognitoService } from '@bn-integration/aws/cognito/auth.cognito-service';
import { ApiResponse } from '../../../shared/types/api-response';
import { CreateUserRO } from '../response-object/create-user.ro';
import { UserRole } from '@bn-enum/user-role.enum';

@Injectable()
export class AuthService {
  constructor(private readonly userDataService: AuthDataService,
              private readonly userZTerosService: UserZterosService,
              private readonly cognitoService: AuthCognitoService) {
  }

  async createUser(admin, userDto: CreateUserDto): Promise<CreateUserRO> {
    
    // Create Owner user role
    const zTerosOwnerUid = await this.userZTerosService.createUser(admin.adminUid, 'owner')
      .then(response => {
        return response.uid;
      });

    // Create User user role
    const zTerosUserUid = await this.userZTerosService.createUser(admin.adminUid, 'user')
      .then(response => {
        return response.uid;
      });

    // Create user on Cognito
    await this.cognitoService.signUp(userDto);

    // Persist user data into Mongo
    const newUserData: { zTerosOwnerUid, zTerosUserUid, email, firstName, lastName } = { zTerosOwnerUid, zTerosUserUid, ...userDto };
    const user = await this.userDataService.createUser(newUserData);
    return {
      id: user.id,
      email: user.email,
      role: UserRole.User
    };
  }

  async validateUser(requestTokenDto: RequestTokenDto): Promise<ValidateRO> {
    const cognitoValidateInfo = await this.cognitoService.signIn(requestTokenDto);
    const userDetail = await this.userDataService.getUserDetail(requestTokenDto.email);
    return {
      token: cognitoValidateInfo.token,
      refreshToken: cognitoValidateInfo.refreshToken,
      user: {
        email: userDetail.email,
        role: userDetail.role,
      }
    };
  }

  async getValidatedUserDetail(email): Promise<RequestUserAttachmentInterface> {
    return this.userDataService.getUserDetail(email);
  }
}
