import { IRecord } from './IRecord';

export interface IPingActionPayload extends IRecord {
  time: number;
}

export interface IPingAction {
  action: string;
  run: (ping: IPingActionPayload, state?: any) => void;
}
