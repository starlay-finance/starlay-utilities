import { BigNumber as BigNumberJs } from 'bignumber.js';
import { calcTotalBorrowingAmount } from './utils';

describe('utils', () => {
  it('calcTotalBorrowingAmount', () => {
    expect(
      calcTotalBorrowingAmount(
        new BigNumberJs('1000000000000000000'),
        new BigNumberJs('0.8'),
        new BigNumberJs('27'),
      ),
    ).toBe('3990328593443082967');
  });
});
