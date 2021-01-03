import { messageAction } from './message.action';
import { approveAction } from './approve.action';
import { pingAction } from './ping.action';
import { reportAction } from './report.action';
import { stateAction } from './state.action';

export const actions = [
  messageAction,
  approveAction,
  pingAction,
  reportAction,
  stateAction,
];

export const isStorable = (action: string): boolean =>
  (['send', 'message'].find((a) => a == action) && true) || false;
