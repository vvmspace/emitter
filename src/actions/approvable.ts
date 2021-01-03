export const approvable = [
  {
    action: 'message',
    min: 1,
  },
  {
    action: 'send',
    min: 3,
  },
];

export function isApprovable(action: string): boolean {
  const found = approvable.find((act) => act.action == action);
  return (action && found && found.min && true) || false;
}

export function minApproves(action: string): number {
  const found = approvable.find((act) => act.action == action);
  return (action && found && found.min) || 0;
}
