import { getId } from './utils/getId';
import { isStorable } from './actions/actions';
import { DEFAULT_STATE, StateWrapper } from './utils/state';
import { nano } from './utils/microtime';
import { FROM } from './app.constants';

const stateWrapper = new StateWrapper(FROM, () => {
  return;
});
export const runner = async (
  run: any,
  payload: any,
  state: any,
  from: string,
): Promise<any> => {
  state = state || DEFAULT_STATE;
  state.lastAction =
    (payload.time > state.lastAction && payload.time) || nano();
  if (!isStorable(payload.action)) {
    payload.id = `T${nano()}`;
    return run(payload, state);
  }
  if (
    !payload.lastId ||
    payload.lastId == 'genesis' ||
    payload.lastId == state.lastId
  ) {
    payload.id = getId();
    payload.lastId = state.lastId;
    state.lastId = payload.id;
    state = run(payload, state);
    stateWrapper.setPrefix(from);
    console.log('stateWrapper._prefix: ', stateWrapper._prefix);
    await stateWrapper.set(state);
  }
  return state;
};
