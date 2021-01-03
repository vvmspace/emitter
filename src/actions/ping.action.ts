import { IPingAction } from '../interfaces/IPingAction';
import { nano } from '../utils/microtime';

export const pingAction: IPingAction = {
  action: 'ping',
  run: (ping, state): any => {
    const { from } = ping;
    console.log(ping, state);
    const connects = state?.connects || [];
    if (!connects.find((con) => con.from == from)) {
      connects.push({ from, lastConnect: nano() });
      state.connects = connects;
    } else {
      console.log('PING WENT WRONG');
    }
    return state;
  },
};
