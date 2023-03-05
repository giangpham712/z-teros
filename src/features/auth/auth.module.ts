import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { SharedModule } from '../../shared/shared.module';
import { DatabaseModule } from '@bn-database/database.module';
import { ZterosModule } from '@bn-integration/zteros/zteros.module';
import { AuthDataService } from './services/auth.data-service';
import { AwsModule } from '@bn-integration/aws/aws.module';

@Module({
  imports: [
    DatabaseModule,
    SharedModule,
    ZterosModule,
    AwsModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
  ],
  providers: [AuthService, JwtStrategy, AuthDataService],
  controllers: [AuthController],
  exports: [PassportModule],
})
export class AuthModule {
}
