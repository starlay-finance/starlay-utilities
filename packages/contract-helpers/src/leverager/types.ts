import { BigNumberish } from 'ethers';

export type LoopParamsType = {
  user: string;
  reserve: string;
  debtToken: string;
  amount: string;
  interestRateMode: BigNumberish;
  onBehalfOf?: string;
  borrowRatio: BigNumberish;
  loopCount: BigNumberish;
};
