import * as redis from 'redis';
// import { IApprove } from '../interfaces/IApprove';
// import { IRecord } from '../interfaces/IRecord';

export interface IState {
  connects: any[];
  approves: any[];
  pending: any[];
  records: any[];
  lastId: string;
  lastAction: number;
}

export const DEFAULT_STATE: IState = {
  connects: [],
  approves: [],
  pending: [],
  records: [],
  lastId: '',
  lastAction: 0,
};

export interface IStateWrapper {
  state: IState;
  get: () => Promise<IState>;
  set: (state: IState) => Promise<IState>;
  setPrefix: (prefix: string) => void;
}

export class StateWrapper implements IStateWrapper {
  public state: IState;
  private redisCli: any;
  public _prefix: string;
  private readonly cb?: (state: IState) => void;

  constructor(
    prefix = '',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cb = (state?: IState): void => {
      return;
    },
  ) {
    this.state = DEFAULT_STATE;
    this.cb = cb;
    this.redisCli = new redis.createClient(6379, 'localhost');
    this.get().then((state: IState) => cb(state));
    this._prefix = prefix;
  }

  public get(): Promise<IState>;
  async get() {
    return new Promise((resolve, reject) => {
      this.redisCli.get(this._prefix + 'state', async (err, reply) => {
        if (err) {
          return reject(err);
        }
        console.log({ reply });
        const _state = (reply && JSON.parse(reply)) || DEFAULT_STATE;
        if (this.state?.lastAction < _state.lastAction) {
          await this.set(_state).catch(() => null);
        }
        this.state && this.cb(this.state);
        console.log('this.state: ', this.state);
        return resolve(this.state);
      });
    });
  }

  public set(state: IState): Promise<IState>;
  async set(state) {
    console.log('state set');
    if (
      state.lastAction &&
      this.state &&
      this.state.lastAction &&
      state.lastAction > this.state.lastAction
    ) {
      console.log('state: ', state);
      console.log('this.state: ', this.state);
      return this.state;
    }
    console.log('StateWrapper SET', state);
    return new Promise((resolve, reject) => {
      // console.log(this.redisCli.connected);
      this.redisCli.set(
        this._prefix + 'state',
        JSON.stringify(this.state),
        (err, reply) => {
          if (err) {
            return reject(err);
          }
          return resolve(reply);
        },
      );
    }).then(() => {
      this.state = state;
      this.state && this.cb(this.state);
      return state;
    });
  }

  setPrefix(from: string) {
    this._prefix = from;
  }
}
