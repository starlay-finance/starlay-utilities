import { BigNumber, BigNumberish } from 'ethers';
import { tEthereumAddress } from '../commons/types';

export type VoteData = {
  totalWeight: BigNumber;
  data: Partial<
    Record<string, { weight: BigNumber; lastWeekRevenue: BigNumber }>
  >;
};

export type UserVoteData = {
  expiry: number;
  data: Partial<
    Record<string, { claimable: BigNumber; weight: BigNumber; vote: BigNumber }>
  >;
};

export type VoteDataArgs = {
  timestamp: number;
  termUnit?: number;
};

export type UserVoteDataArgs = VoteDataArgs & {
  user: tEthereumAddress;
  lockerId: string;
};

export type VoteArgs = {
  user: tEthereumAddress;
  weights: Record<string, BigNumberish>;
};

export type VoteUntilArgs = VoteArgs & {
  endTimestamp: number;
};
