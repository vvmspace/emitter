export const genFrom = (): string =>
  `${process.env.WALLET_NAME || 'unit'}${Math.floor(Math.random() * 1000)}`;

export const FROM = genFrom();
