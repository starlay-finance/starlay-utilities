import { BigNumber as BigNumberJs } from 'bignumber.js';
import { calcDelegateAmount } from './utils';

describe('utils', () => {
  it('calcDelegateAmount', () => {
    expect(calcDelegateAmount(new BigNumberJs('100'))).toBe('110');
  });
});
