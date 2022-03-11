import { BigNumber as BigNumberJs } from 'bignumber.js';

export const calcTotalBorrowingAmount = (
  depositAmount: BigNumberJs,
  borrowRatio: BigNumberJs,
  loopCount: BigNumberJs,
) => {
  let totalBorrowingAmount = new BigNumberJs('0');
  let borrowingAmount = depositAmount;
  for (let i = 1; loopCount.gte(i); i++) {
    borrowingAmount = borrowingAmount.multipliedBy(borrowRatio);
    totalBorrowingAmount = totalBorrowingAmount.plus(borrowingAmount);
  }

  return totalBorrowingAmount.toFixed(0, BigNumberJs.ROUND_CEIL);
};
