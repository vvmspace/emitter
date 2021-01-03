import { IRecord } from './IRecord';
import { IState } from '../utils/state';

export interface IReportActionPayload extends IRecord {
  time: number;
  event: string;
  action: string;
}

export interface IReportAction {
  action: string;
  run: (report: IReportActionPayload, state?: IState) => void;
}
