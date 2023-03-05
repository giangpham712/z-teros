import { HttpService, Injectable } from '@nestjs/common';
import { BaseApiResponse } from '@bn-integration/zteros/base.api-response';
import { GetDataRecordApiResponse } from './responses/get-data-record.api-response';

@Injectable()
export class DataRecordZterosService {
  constructor(private readonly httpService: HttpService) {
  }

  async getPublicFaceForRecord(recordUID): Promise<GetDataRecordApiResponse> {
    const requestUrl = `/records/${recordUID}`;
    return this.httpService.get(requestUrl).toPromise().then(res => {
      const data = res.data;
      return {
        uid: data.RecordUID,
        face: data.face,
        data: data.DataPu
      };
    });
  }

  async createRecord(): Promise<BaseApiResponse> {
    const requestUrl = `/records`;
    return this.httpService.post(requestUrl).toPromise().then(res => {
      const data = res.data;
      return {
        uid: data.RecordUID,
      };
    });
  }

  async createPrivateFaceForRecord(recordUID: string, userUID: string, privilegeUID: string): Promise<BaseApiResponse> {
    const requestUrl = `/records/${recordUID}/private?UserUID=${userUID}&PrivUID=${privilegeUID}`;
    return this.httpService.post(requestUrl).toPromise().then(res => {
      const data = res.data;
      return {
        uid: data.RecordUID,
      };
    });
  }

  async getPrivateFaceForRecord(recordUID: string, userUID: string, privilegeUID: string): Promise<GetDataRecordApiResponse> {
    const requestUrl = `/records/${recordUID}/private?UserUID=${userUID}&PrivUID=${privilegeUID}`;
    return this.httpService.get(requestUrl).toPromise().then(res => {
      const data = res.data;
      return {
        uid: data.RecordUID,
        face: data.face,
        data: data.DataPv
      };
    });
  }

  async updatePublicFaceForRecord(recordUID: string, content: any): Promise<BaseApiResponse> {
    const requestUrl = `/records/${recordUID}`;
    return this.httpService.put(requestUrl, content).toPromise().then(res => {
      const data = res.data;
      return {
        uid: data.RecordUID,
      };
    });
  }

  async updatePrivateFaceForRecord(recordUID: string, userUID: string, privilegeUID: string, content: any): Promise<BaseApiResponse> {
    const requestUrl = `/records/${recordUID}/private?UserUID=${userUID}&PrivUID=${privilegeUID}`;
    return this.httpService.put(requestUrl, content).toPromise().then(res => {
      const data = res.data;
      return {
        uid: data.RecordUID,
      };
    });
  }

  async deleteRecord(recordUID: string): Promise<BaseApiResponse> {
    const requestUrl = `/records/${recordUID}`;
    return this.httpService.delete(requestUrl).toPromise().then(res => {
      const data = res.data;
      return {
        uid: data.RecordUID,
      };
    });
  }

  async deletePrivateFaceForRecord(recordUID: string, userUID: string, privilegeUID: string): Promise<BaseApiResponse> {
    const requestUrl = `/records/${recordUID}/private?UserUID=${userUID}&PrivUID=${privilegeUID}`;
    return this.httpService.delete(requestUrl).toPromise().then(res => {
      const data = res.data;
      return {
        uid: data.RecordUID,
      };
    });
  }
}
