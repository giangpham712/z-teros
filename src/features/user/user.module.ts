import { Module } from '@nestjs/common';

import { UserDataService } from './services/user.data-service';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { ZterosModule } from '@bn-integration/zteros/zteros.module';
import { AwsModule } from '@bn-integration/aws/aws.module';
import { DatabaseModule } from '@bn-database/database.module';

@Module({
  imports: [DatabaseModule, AuthModule, ZterosModule, AwsModule],
  providers: [UserDataService, UserService],
  controllers: [UserController],
  exports: [UserDataService]
})
export class UserModule {
}
