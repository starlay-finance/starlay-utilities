import { BigNumber } from 'ethers';
import { tEthereumAddress } from '../commons/types';

export type Releasable = {
  ido: BigNumber;
  tokenSale: BigNumber;
  rewards: BigNumber;
};

export type ReleasableArgs = {
  user: tEthereumAddress;
  reserves: tEthereumAddress[];
};

export type ReleaseArgs = {
  user: tEthereumAddress;
  reserves: tEthereumAddress[];
};
