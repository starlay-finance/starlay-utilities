import { BigNumber } from 'ethers';
import { tEthereumAddress } from '../commons/types';

export type BidParamsType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  amount: string;
  priceCap: string;
  cancelable: boolean;
};

export type UpdateParamsType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  amount: string;
  priceCap: string;
};

export type UpdateAmountParamsType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  amount: string;
};

export type UpdatePriceCapParamsType = {
  user: tEthereumAddress;
  reserve: tEthereumAddress;
  priceCap: string;
};

export type CancelParamsType = {
  user: tEthereumAddress;
};

export type RefundParamsType = {
  user: tEthereumAddress;
};

export type Bid = {
  paid: BigNumber;
  multiplied: BigNumber;
  priceCap: BigNumber;
  cancelable: boolean;
};
