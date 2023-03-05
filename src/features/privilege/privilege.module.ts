import { Module } from '@nestjs/common';
import { PrivilegeController } from './privilege.controller';
import { PrivilegeService } from './privilege.service';
import { PrivilegeDataService } from './privilege.data-service';
import { ZterosModule } from '@bn-integration/zteros/zteros.module';
import { DatabaseModule } from '@bn-database/database.module';
import { UserModule } from 'features/user/user.module';

@Module({
  imports: [
    DatabaseModule,
    ZterosModule,
    UserModule,
  ],
  controllers: [PrivilegeController],
  providers: [PrivilegeService, PrivilegeDataService],
  exports: [PrivilegeService, PrivilegeDataService]
})
export class PrivilegeModule {}
