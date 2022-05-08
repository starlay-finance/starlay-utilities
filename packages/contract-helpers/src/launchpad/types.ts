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

export type CancelParamsType = {
  user: tEthereumAddress;
};
