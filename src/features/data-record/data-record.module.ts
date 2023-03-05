import { Module, forwardRef } from '@nestjs/common';
import { FolderController } from './folder.controller';
import { DataRecordService } from './services/data-record.service';
import { DatabaseModule } from '@bn-database/database.module';
import { DataRecordDataService } from './services/data-record.data-service';
import { AuthModule } from '../auth/auth.module';
import { FileController } from './file.controller';
import { ZterosModule } from '@bn-integration/zteros/zteros.module';
import { UserModule } from 'features/user/user.module';
import { PrivilegeModule } from 'features/privilege/privilege.module';
import { SharedModule } from 'shared/shared.module';

@Module({
  imports: [DatabaseModule, SharedModule, AuthModule, ZterosModule, UserModule, PrivilegeModule],
  providers: [DataRecordService, DataRecordDataService],
  controllers: [FolderController, FileController],
})
export class DataRecordModule {
}
