import { InterestRate } from '../commons/types';

export type LoopParamsType = {
  user: string;
  reserve: string;
  debtToken: string;
  amount: string;
  interestRateMode: InterestRate;
  onBehalfOf?: string;
  borrowRatio: string | number;
  loopCount: string | number;
};
