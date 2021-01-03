import { IAction } from '../interfaces/IAction';
import { FROM } from '../app.constants';

export const messageAction: IAction = {
  action: 'message',
  run: (payload, state) => {
    console.log(FROM, 'messageAction', payload);
    if (!state.pending.find((p) => p.id == payload.id)) {
      console.log('We need tp update state!');
      state.pending.push(payload);
    }
    return state;
  },
};
