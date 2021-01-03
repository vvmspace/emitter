import { IRecord } from '../interfaces/IRecord';
import {
  IReportAction,
  IReportActionPayload,
} from '../interfaces/IReportAction';

export interface IReport extends IRecord {
  time: number;
}

export const reportAction: IReportAction = {
  action: 'report',
  run: ({ time, event, id, payload }: IReportActionPayload) => {
    console.log('____________');
    console.log(`${event}`);
    console.log(`${time} / ${id}`);
    console.log('____________');
    console.log(payload);
    console.log('____________');
  },
};
