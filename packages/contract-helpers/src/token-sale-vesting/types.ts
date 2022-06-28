import { BigNumber } from 'ethers';

export type UserData = {
  releasable: BigNumber;
  lockableAmount: BigNumber;
  vestingEnd: BigNumber;
};
