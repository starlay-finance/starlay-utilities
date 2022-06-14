import { BigNumber } from 'ethers';
import { tEthereumAddress } from '../commons/types';

export type VoteData = {
  totalWeight: BigNumber;
  poolWeights: Partial<Record<string, BigNumber>>;
};

export type UserVoteData = Partial<
  Record<string, { weight: BigNumber; vote: BigNumber }>
>;

export type VoteArgs = {
  user: tEthereumAddress;
  weights: Record<string, BigNumber>;
};
