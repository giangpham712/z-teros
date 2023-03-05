import { HttpModule, HttpService, Logger, Module } from '@nestjs/common';
import { UserZterosService } from './user/user-zteros.service';
import { zTerosUrl } from '@bn-config';
import { ZterosError } from '@bn-integration/zteros/zteros-error';
import { PrivilegeZterosService } from './privilege/privilege-zteros.service';
import { DataRecordZterosService } from './data-record/data-record-zteros.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: zTerosUrl,
      headers: { 'Content-Type': 'application/json'},
    }),
  ],
  providers: [UserZterosService, PrivilegeZterosService, DataRecordZterosService],
  exports: [UserZterosService, PrivilegeZterosService, DataRecordZterosService],
})
export class ZterosModule {
  private logger = new Logger('ZterosModule');

  constructor(private readonly httpService: HttpService) {
    httpService.axiosRef.interceptors.response.use(response => {
      const dataResponse = response.data;
      if (dataResponse['Error Message'] ||
          dataResponse.Completed === 'false' ||
          (typeof(dataResponse) === 'string' && dataResponse.indexOf('Error Message') > -1)) {
        throw new ZterosError(dataResponse);
      }
      return response;
    });
  }
}
