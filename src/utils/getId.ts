import { nano } from './microtime';

export const getId = (): string => {
  return `${nano()}`;
};
