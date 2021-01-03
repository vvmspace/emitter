import { IAction } from '../interfaces/IAction';

export const stateAction: IAction = {
  action: 'state',
  run: (payload, state) => {
    console.log('state', payload);
    if (state.lastAction > 0 && payload?.state?.lastAction > state.lastAction) {
      return payload.state;
    }
    return state;
  },
};
