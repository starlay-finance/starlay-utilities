/* Autogenerated file. Do not edit manually. */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from 'ethers';
import {
  Contract,
  ContractTransaction,
  CallOverrides,
} from '@ethersproject/contracts';
import { BytesLike } from '@ethersproject/bytes';
import { Listener, Provider } from '@ethersproject/providers';
import { FunctionFragment, EventFragment, Result } from '@ethersproject/abi';

interface IPriceAggregatorAdapterInterface extends ethers.utils.Interface {
  functions: {
    'currentPrice(address)': FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: 'currentPrice',
    values: [string],
  ): string;

  decodeFunctionResult(
    functionFragment: 'currentPrice',
    data: BytesLike,
  ): Result;

  events: {};
}

export class IPriceAggregatorAdapter extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: IPriceAggregatorAdapterInterface;

  functions: {
    currentPrice(
      asset: string,
      overrides?: CallOverrides,
    ): Promise<{
      0: BigNumber;
    }>;

    'currentPrice(address)'(
      asset: string,
      overrides?: CallOverrides,
    ): Promise<{
      0: BigNumber;
    }>;
  };

  currentPrice(asset: string, overrides?: CallOverrides): Promise<BigNumber>;

  'currentPrice(address)'(
    asset: string,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  callStatic: {
    currentPrice(asset: string, overrides?: CallOverrides): Promise<BigNumber>;

    'currentPrice(address)'(
      asset: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    currentPrice(asset: string, overrides?: CallOverrides): Promise<BigNumber>;

    'currentPrice(address)'(
      asset: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    currentPrice(
      asset: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    'currentPrice(address)'(
      asset: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
  };
}
