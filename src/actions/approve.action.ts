import { IAction } from '../interfaces/IAction';
import { IApprove } from '../interfaces/IApprove';
import { isApprovable, minApproves } from './approvable';
import { log } from '../utils/log';

export const approveAction: IAction = {
  action: 'approve',
  run: (
    { from, payloadFrom, payload: { transaction } }: IApprove,
    state,
  ): void => {
    log(from, 'APPROVE', transaction);
    if (
      !state.approves?.find((a) => {
        const transactionExist = a.payload?.transaction == transaction;
        const myTransaction = a.from == from;
        return transactionExist && myTransaction;
      })
    ) {
      log('New approves', { from, payload: { transaction } });
      state.approves?.push({
        from,
        payloadFrom,
        env: process.env.WALLET_NAME,
        payload: { transaction },
        transaction,
      });
      const count = state.approves?.find(
        (a) => a.payload?.transaction == transaction,
      ).length;
      const record = state?.pending?.find((p) => p.id == transaction);
      log({ record });
      if (
        record &&
        transaction &&
        isApprovable(record.action) &&
        count >= minApproves(record.action)
      ) {
        log('PUSHING', record);
        state.records?.push(record);
        state.pending = state.pending?.filter((p) => !(p.id == transaction));
      }
      return state;
    } else {
      log('APPROVE EMERGENCY EXIT', {
        from,
        payloadFrom,
        payload: { transaction },
      });
    }
  },
};
