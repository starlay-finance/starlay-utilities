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
  CallOverrides,
} from 'ethers';
import { BytesLike } from '@ethersproject/bytes';
import { Listener, Provider } from '@ethersproject/providers';
import { FunctionFragment, EventFragment, Result } from '@ethersproject/abi';
import type { TypedEventFilter, TypedEvent, TypedListener } from './common';

interface StakeUiHelperInterface extends ethers.utils.Interface {
  functions: {
    'LAY()': FunctionFragment;
    'MOCK_USD_ADDRESS()': FunctionFragment;
    'PRICE_ORACLE()': FunctionFragment;
    'STAKED_LAY()': FunctionFragment;
    'getGeneralStakeUIData()': FunctionFragment;
    'getStkGeneralLayData()': FunctionFragment;
    'getStkLayData(address)': FunctionFragment;
    'getStkUserLayData(address)': FunctionFragment;
    'getUserStakeUIData(address)': FunctionFragment;
    'getUserUIData(address)': FunctionFragment;
  };

  encodeFunctionData(functionFragment: 'LAY', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'MOCK_USD_ADDRESS',
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: 'PRICE_ORACLE',
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: 'STAKED_LAY',
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: 'getGeneralStakeUIData',
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: 'getStkGeneralLayData',
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: 'getStkLayData',
    values: [string],
  ): string;
  encodeFunctionData(
    functionFragment: 'getStkUserLayData',
    values: [string],
  ): string;
  encodeFunctionData(
    functionFragment: 'getUserStakeUIData',
    values: [string],
  ): string;
  encodeFunctionData(
    functionFragment: 'getUserUIData',
    values: [string],
  ): string;

  decodeFunctionResult(functionFragment: 'LAY', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'MOCK_USD_ADDRESS',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'PRICE_ORACLE',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: 'STAKED_LAY', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'getGeneralStakeUIData',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'getStkGeneralLayData',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'getStkLayData',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'getStkUserLayData',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'getUserStakeUIData',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'getUserUIData',
    data: BytesLike,
  ): Result;

  events: {};
}

export class StakeUiHelper extends BaseContract {
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

  interface: StakeUiHelperInterface;

  functions: {
    LAY(overrides?: CallOverrides): Promise<[string]>;

    MOCK_USD_ADDRESS(overrides?: CallOverrides): Promise<[string]>;

    PRICE_ORACLE(overrides?: CallOverrides): Promise<[string]>;

    STAKED_LAY(overrides?: CallOverrides): Promise<[string]>;

    getGeneralStakeUIData(overrides?: CallOverrides): Promise<
      [
        [
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
        ] & {
          stakeTokenTotalSupply: BigNumber;
          stakeCooldownSeconds: BigNumber;
          stakeUnstakeWindow: BigNumber;
          stakeTokenPriceEth: BigNumber;
          rewardTokenPriceEth: BigNumber;
          stakeApy: BigNumber;
          distributionPerSecond: BigNumber;
          distributionEnd: BigNumber;
        },
        BigNumber,
      ]
    >;

    getStkGeneralLayData(overrides?: CallOverrides): Promise<
      [
        [
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
        ] & {
          stakeTokenTotalSupply: BigNumber;
          stakeCooldownSeconds: BigNumber;
          stakeUnstakeWindow: BigNumber;
          stakeTokenPriceEth: BigNumber;
          rewardTokenPriceEth: BigNumber;
          stakeApy: BigNumber;
          distributionPerSecond: BigNumber;
          distributionEnd: BigNumber;
        },
      ]
    >;

    getStkLayData(
      user: string,
      overrides?: CallOverrides,
    ): Promise<
      [
        [
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
        ] & {
          stakeTokenTotalSupply: BigNumber;
          stakeCooldownSeconds: BigNumber;
          stakeUnstakeWindow: BigNumber;
          stakeTokenPriceEth: BigNumber;
          rewardTokenPriceEth: BigNumber;
          stakeApy: BigNumber;
          distributionPerSecond: BigNumber;
          distributionEnd: BigNumber;
          stakeTokenUserBalance: BigNumber;
          underlyingTokenUserBalance: BigNumber;
          userCooldown: BigNumber;
          userIncentivesToClaim: BigNumber;
          userPermitNonce: BigNumber;
        },
      ]
    >;

    getStkUserLayData(
      user: string,
      overrides?: CallOverrides,
    ): Promise<
      [
        [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
          stakeTokenUserBalance: BigNumber;
          underlyingTokenUserBalance: BigNumber;
          userCooldown: BigNumber;
          userIncentivesToClaim: BigNumber;
          userPermitNonce: BigNumber;
        },
      ]
    >;

    getUserStakeUIData(
      user: string,
      overrides?: CallOverrides,
    ): Promise<
      [
        [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
          stakeTokenUserBalance: BigNumber;
          underlyingTokenUserBalance: BigNumber;
          userCooldown: BigNumber;
          userIncentivesToClaim: BigNumber;
          userPermitNonce: BigNumber;
        },
        BigNumber,
      ]
    >;

    getUserUIData(
      user: string,
      overrides?: CallOverrides,
    ): Promise<
      [
        [
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
        ] & {
          stakeTokenTotalSupply: BigNumber;
          stakeCooldownSeconds: BigNumber;
          stakeUnstakeWindow: BigNumber;
          stakeTokenPriceEth: BigNumber;
          rewardTokenPriceEth: BigNumber;
          stakeApy: BigNumber;
          distributionPerSecond: BigNumber;
          distributionEnd: BigNumber;
          stakeTokenUserBalance: BigNumber;
          underlyingTokenUserBalance: BigNumber;
          userCooldown: BigNumber;
          userIncentivesToClaim: BigNumber;
          userPermitNonce: BigNumber;
        },
        BigNumber,
      ]
    >;
  };

  LAY(overrides?: CallOverrides): Promise<string>;

  MOCK_USD_ADDRESS(overrides?: CallOverrides): Promise<string>;

  PRICE_ORACLE(overrides?: CallOverrides): Promise<string>;

  STAKED_LAY(overrides?: CallOverrides): Promise<string>;

  getGeneralStakeUIData(overrides?: CallOverrides): Promise<
    [
      [
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
      ] & {
        stakeTokenTotalSupply: BigNumber;
        stakeCooldownSeconds: BigNumber;
        stakeUnstakeWindow: BigNumber;
        stakeTokenPriceEth: BigNumber;
        rewardTokenPriceEth: BigNumber;
        stakeApy: BigNumber;
        distributionPerSecond: BigNumber;
        distributionEnd: BigNumber;
      },
      BigNumber,
    ]
  >;

  getStkGeneralLayData(overrides?: CallOverrides): Promise<
    [
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
    ] & {
      stakeTokenTotalSupply: BigNumber;
      stakeCooldownSeconds: BigNumber;
      stakeUnstakeWindow: BigNumber;
      stakeTokenPriceEth: BigNumber;
      rewardTokenPriceEth: BigNumber;
      stakeApy: BigNumber;
      distributionPerSecond: BigNumber;
      distributionEnd: BigNumber;
    }
  >;

  getStkLayData(
    user: string,
    overrides?: CallOverrides,
  ): Promise<
    [
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
    ] & {
      stakeTokenTotalSupply: BigNumber;
      stakeCooldownSeconds: BigNumber;
      stakeUnstakeWindow: BigNumber;
      stakeTokenPriceEth: BigNumber;
      rewardTokenPriceEth: BigNumber;
      stakeApy: BigNumber;
      distributionPerSecond: BigNumber;
      distributionEnd: BigNumber;
      stakeTokenUserBalance: BigNumber;
      underlyingTokenUserBalance: BigNumber;
      userCooldown: BigNumber;
      userIncentivesToClaim: BigNumber;
      userPermitNonce: BigNumber;
    }
  >;

  getStkUserLayData(
    user: string,
    overrides?: CallOverrides,
  ): Promise<
    [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
      stakeTokenUserBalance: BigNumber;
      underlyingTokenUserBalance: BigNumber;
      userCooldown: BigNumber;
      userIncentivesToClaim: BigNumber;
      userPermitNonce: BigNumber;
    }
  >;

  getUserStakeUIData(
    user: string,
    overrides?: CallOverrides,
  ): Promise<
    [
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
        stakeTokenUserBalance: BigNumber;
        underlyingTokenUserBalance: BigNumber;
        userCooldown: BigNumber;
        userIncentivesToClaim: BigNumber;
        userPermitNonce: BigNumber;
      },
      BigNumber,
    ]
  >;

  getUserUIData(
    user: string,
    overrides?: CallOverrides,
  ): Promise<
    [
      [
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
      ] & {
        stakeTokenTotalSupply: BigNumber;
        stakeCooldownSeconds: BigNumber;
        stakeUnstakeWindow: BigNumber;
        stakeTokenPriceEth: BigNumber;
        rewardTokenPriceEth: BigNumber;
        stakeApy: BigNumber;
        distributionPerSecond: BigNumber;
        distributionEnd: BigNumber;
        stakeTokenUserBalance: BigNumber;
        underlyingTokenUserBalance: BigNumber;
        userCooldown: BigNumber;
        userIncentivesToClaim: BigNumber;
        userPermitNonce: BigNumber;
      },
      BigNumber,
    ]
  >;

  callStatic: {
    LAY(overrides?: CallOverrides): Promise<string>;

    MOCK_USD_ADDRESS(overrides?: CallOverrides): Promise<string>;

    PRICE_ORACLE(overrides?: CallOverrides): Promise<string>;

    STAKED_LAY(overrides?: CallOverrides): Promise<string>;

    getGeneralStakeUIData(overrides?: CallOverrides): Promise<
      [
        [
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
        ] & {
          stakeTokenTotalSupply: BigNumber;
          stakeCooldownSeconds: BigNumber;
          stakeUnstakeWindow: BigNumber;
          stakeTokenPriceEth: BigNumber;
          rewardTokenPriceEth: BigNumber;
          stakeApy: BigNumber;
          distributionPerSecond: BigNumber;
          distributionEnd: BigNumber;
        },
        BigNumber,
      ]
    >;

    getStkGeneralLayData(overrides?: CallOverrides): Promise<
      [
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
      ] & {
        stakeTokenTotalSupply: BigNumber;
        stakeCooldownSeconds: BigNumber;
        stakeUnstakeWindow: BigNumber;
        stakeTokenPriceEth: BigNumber;
        rewardTokenPriceEth: BigNumber;
        stakeApy: BigNumber;
        distributionPerSecond: BigNumber;
        distributionEnd: BigNumber;
      }
    >;

    getStkLayData(
      user: string,
      overrides?: CallOverrides,
    ): Promise<
      [
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
      ] & {
        stakeTokenTotalSupply: BigNumber;
        stakeCooldownSeconds: BigNumber;
        stakeUnstakeWindow: BigNumber;
        stakeTokenPriceEth: BigNumber;
        rewardTokenPriceEth: BigNumber;
        stakeApy: BigNumber;
        distributionPerSecond: BigNumber;
        distributionEnd: BigNumber;
        stakeTokenUserBalance: BigNumber;
        underlyingTokenUserBalance: BigNumber;
        userCooldown: BigNumber;
        userIncentivesToClaim: BigNumber;
        userPermitNonce: BigNumber;
      }
    >;

    getStkUserLayData(
      user: string,
      overrides?: CallOverrides,
    ): Promise<
      [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
        stakeTokenUserBalance: BigNumber;
        underlyingTokenUserBalance: BigNumber;
        userCooldown: BigNumber;
        userIncentivesToClaim: BigNumber;
        userPermitNonce: BigNumber;
      }
    >;

    getUserStakeUIData(
      user: string,
      overrides?: CallOverrides,
    ): Promise<
      [
        [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber] & {
          stakeTokenUserBalance: BigNumber;
          underlyingTokenUserBalance: BigNumber;
          userCooldown: BigNumber;
          userIncentivesToClaim: BigNumber;
          userPermitNonce: BigNumber;
        },
        BigNumber,
      ]
    >;

    getUserUIData(
      user: string,
      overrides?: CallOverrides,
    ): Promise<
      [
        [
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
          BigNumber,
        ] & {
          stakeTokenTotalSupply: BigNumber;
          stakeCooldownSeconds: BigNumber;
          stakeUnstakeWindow: BigNumber;
          stakeTokenPriceEth: BigNumber;
          rewardTokenPriceEth: BigNumber;
          stakeApy: BigNumber;
          distributionPerSecond: BigNumber;
          distributionEnd: BigNumber;
          stakeTokenUserBalance: BigNumber;
          underlyingTokenUserBalance: BigNumber;
          userCooldown: BigNumber;
          userIncentivesToClaim: BigNumber;
          userPermitNonce: BigNumber;
        },
        BigNumber,
      ]
    >;
  };

  filters: {};

  estimateGas: {
    LAY(overrides?: CallOverrides): Promise<BigNumber>;

    MOCK_USD_ADDRESS(overrides?: CallOverrides): Promise<BigNumber>;

    PRICE_ORACLE(overrides?: CallOverrides): Promise<BigNumber>;

    STAKED_LAY(overrides?: CallOverrides): Promise<BigNumber>;

    getGeneralStakeUIData(overrides?: CallOverrides): Promise<BigNumber>;

    getStkGeneralLayData(overrides?: CallOverrides): Promise<BigNumber>;

    getStkLayData(user: string, overrides?: CallOverrides): Promise<BigNumber>;

    getStkUserLayData(
      user: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getUserStakeUIData(
      user: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    getUserUIData(user: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    LAY(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    MOCK_USD_ADDRESS(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    PRICE_ORACLE(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    STAKED_LAY(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getGeneralStakeUIData(
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getStkGeneralLayData(
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getStkLayData(
      user: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getStkUserLayData(
      user: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getUserStakeUIData(
      user: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    getUserUIData(
      user: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
  };
}
