import { IRecord } from './IRecord';

export interface IApprovePayload {
  transaction: string;
}

export interface IApprove extends IRecord {
  payload: IApprovePayload;
  payloadFrom?: string;
}
