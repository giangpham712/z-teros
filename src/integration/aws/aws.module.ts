import { Module } from '@nestjs/common';

import { AdminUserCognitoService } from './cognito/admin-user.cognito-service';
import { AuthCognitoService } from './cognito/auth.cognito-service';

const services = [AdminUserCognitoService, AuthCognitoService];

@Module({
  providers: [...services],
  exports: [...services],
})
export class AwsModule {

}
