import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { PrivilegeModule } from './privilege/privilege.module';
import { DataRecordModule } from './data-record/data-record.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [AuthModule, PrivilegeModule, DataRecordModule, UserModule, AdminModule],
  exports: [AuthModule],
})
export class FeaturesModule {
}
