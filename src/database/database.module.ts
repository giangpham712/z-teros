import { Module } from '@nestjs/common';

import { databaseProviders } from './database.provider';
import { modelProviders } from './model.providers';
import { UserDataImport } from '@bn-database/data-import/user/user.data-import';

const dataImportServices = [UserDataImport];

@Module({
  providers: [...dataImportServices, ...databaseProviders, ...modelProviders],
  exports: [...databaseProviders, ...modelProviders],
})
export class DatabaseModule {
}
