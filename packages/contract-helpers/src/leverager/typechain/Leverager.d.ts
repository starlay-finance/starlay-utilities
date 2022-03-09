/* Autogenerated file. Do not edit manually. */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from 'ethers';
import { BytesLike } from '@ethersproject/bytes';
import { Listener, Provider } from '@ethersproject/providers';
import { FunctionFragment, EventFragment, Result } from '@ethersproject/abi';
import type { TypedEventFilter, TypedEvent, TypedListener } from './common';

interface LeveragerInterface extends ethers.utils.Interface {
  functions: {
    'getConfiguration(address)': FunctionFragment;
    'lendingPool()': FunctionFragment;
    'loop(address,uint256,uint256,address,uint256,uint256)': FunctionFragment;
    'ltv(address)': FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: 'getConfiguration',
    values: [string],
  ): string;
  encodeFunctionData(
    functionFragment: 'lendingPool',
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: 'loop',
    values: [
      string,
      BigNumberish,
      BigNumberish,
      string,
      BigNumberish,
      BigNumberish,
    ],
  ): string;
  encodeFunctionData(functionFragment: 'ltv', values: [string]): string;

  decodeFunctionResult(
    functionFragment: 'getConfiguration',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'lendingPool',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: 'loop', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'ltv', data: BytesLike): Result;

  events: {};
}

export class Leverager extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>,
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>,
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined,
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: LeveragerInterface;

  functions: {
    getConfiguration(
      asset: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber] & { data: BigNumber }>;

    lendingPool(overrides?: CallOverrides): Promise<[string]>;

    loop(
      asset: string,
      amount: BigNumberish,
      interestRateMode: BigNumberish,
      onBehalfOf: string,
      borrowRatio: BigNumberish,
      loopCount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    ltv(asset: string, overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  getConfiguration(
    asset: string,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  lendingPool(overrides?: CallOverrides): Promise<string>;

  loop(
    asset: string,
    amount: BigNumberish,
    interestRateMode: BigNumberish,
    onBehalfOf: string,
    borrowRatio: BigNumberish,
    loopCount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  ltv(asset: string, overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    getConfiguration(
      asset: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    lendingPool(overrides?: CallOverrides): Promise<string>;

    loop(
      asset: string,
      amount: BigNumberish,
      interestRateMode: BigNumberish,
      onBehalfOf: string,
      borrowRatio: BigNumberish,
      loopCount: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>;

    ltv(asset: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    getConfiguration(
      asset: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    lendingPool(overrides?: CallOverrides): Promise<BigNumber>;

    loop(
      asset: string,
      amount: BigNumberish,
      interestRateMode: BigNumberish,
      onBehalfOf: string,
      borrowRatio: BigNumberish,
      loopCount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    ltv(asset: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    getConfiguration(
      asset: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    lendingPool(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    loop(
      asset: string,
      amount: BigNumberish,
      interestRateMode: BigNumberish,
      onBehalfOf: string,
      borrowRatio: BigNumberish,
      loopCount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    ltv(
      asset: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
  };
}
