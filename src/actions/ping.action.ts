import { IPingAction } from '../interfaces/IPingAction';
import { nano } from '../utils/microtime';

export const pingAction: IPingAction = {
  action: 'ping',
  run: (ping, state): any => {
    const { from } = ping;
    console.log({ ping, state });
    console.log('after ping')
    let connects = state?.connects || [];
    connects = connects.filter((connect) => typeof connect !== 'undefined');
    if (!connects.find((con) => con?.from == from)) {
      console.log('PING: first ping! from ' + from);
      connects.push({ from, lastConnect: nano() });
      console.log('after connects push')
    } else {
      connects = connects.map((connect) => {
        if (connect.from == from) {
          connect.lastConnect = nano();
        }
        console.log('PING19', connect);
        return connect;
      });
      console.log(`PING: lastConnect update`);
    }
    state.connects = connects;
    return state;
  },
};
