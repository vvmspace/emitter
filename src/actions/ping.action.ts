import { IPingAction } from '../interfaces/IPingAction';
import { nano } from '../utils/microtime';

export const pingAction: IPingAction = {
  action: 'ping',
  run: (ping, state): any => {
    const { from } = ping;
    console.log('pingAction:', { ping, state });
    let connects = state?.connects || [];
    connects = connects.filter((connect) => typeof connect !== 'undefined');
    if (!connects.find((con) => con?.from == from)) {
      console.log('PING: first ping from ' + from);
      connects.push({ from, lastConnect: nano() });
    } else {
      connects = connects.map((connect) => {
        if (connect.from == from) {
          connect.lastConnect = nano();
        }
        console.log('PING: ', { connect });
        return connect;
      });
      console.log(`PING: lastConnect update`);
    }
    state.connects = connects;
    return state;
  },
};
