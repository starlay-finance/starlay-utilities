import { BigNumber } from 'ethers';
import { tEthereumAddress } from '../commons/types';

export type LockData = {
  totalVotingPower: BigNumber;
  totalLocked: BigNumber;
};

export type UserLockData = {
  lockerId: BigNumber;
  locked: BigNumber;
  lockedEnd: BigNumber;
  votingPower: BigNumber;
};

export type CreateLockArgs = {
  user: tEthereumAddress;
  amount: string;
  duration: string;
};

export type IncreaseAmountArgs = {
  user: tEthereumAddress;
  amount: string;
};

export type IncreaseUnlockTimeArgs = {
  user: tEthereumAddress;
  duration: string;
};
