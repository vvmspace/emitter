export interface IRecord {
  id?: string;
  from?: string;
  action: string;
  payload?: any;
  lastId?: string;
  time: number;
}
