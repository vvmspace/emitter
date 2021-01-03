export interface IAction {
  action: string;
  run: (payload: any, state: any) => any;
}
