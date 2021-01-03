import { IRecord } from './IRecord';

export interface IPingPayload {
  state?: any;
}

export interface IPing extends IRecord {
  payload: IPingPayload;
}
