import { BigNumber } from 'ethers';
import { tEthereumAddress } from '../commons/types';

export type VoteData = {
  totalWeight: BigNumber;
  data: Partial<
    Record<string, { weight: BigNumber; lastWeekRevenue: BigNumber }>
  >;
};

export type UserVoteData = Partial<
  Record<string, { claimable: BigNumber; weight: BigNumber; vote: BigNumber }>
>;

export type VoteArgs = {
  user: tEthereumAddress;
  weights: Record<string, BigNumber>;
};
