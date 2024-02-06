import { BigNumber as BigNumberJs } from 'bignumber.js';

export const calcDelegateAmount = (amount: BigNumberJs) => {
  return amount
    .multipliedBy(new BigNumberJs('11'))
    .dividedBy(new BigNumberJs('10'))
    .toFixed(0, BigNumberJs.ROUND_CEIL);
};
