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
  Overrides,
  CallOverrides,
} from '@ethersproject/contracts';
import { BytesLike } from '@ethersproject/bytes';
import { Listener, Provider } from '@ethersproject/providers';
import { FunctionFragment, EventFragment, Result } from '@ethersproject/abi';

interface ILendingPoolInterface extends ethers.utils.Interface {
  functions: {
    'FLASHLOAN_PREMIUM_TOTAL()': FunctionFragment;
    'borrow(address,uint256,uint256,uint16,address)': FunctionFragment;
    'deposit(address,uint256,address,uint16)': FunctionFragment;
    'flashLoan(address,address[],uint256[],uint256[],address,bytes,uint16)': FunctionFragment;
    'liquidationCall(address,address,address,uint256,bool)': FunctionFragment;
    'repay(address,uint256,uint256,address)': FunctionFragment;
    'setUserUseReserveAsCollateral(address,bool)': FunctionFragment;
    'swapBorrowRateMode(address,uint256)': FunctionFragment;
    'withdraw(address,uint256,address)': FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: 'FLASHLOAN_PREMIUM_TOTAL',
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: 'borrow',
    values: [string, BigNumberish, BigNumberish, BigNumberish, string],
  ): string;
  encodeFunctionData(
    functionFragment: 'deposit',
    values: [string, BigNumberish, string, BigNumberish],
  ): string;
  encodeFunctionData(
    functionFragment: 'flashLoan',
    values: [
      string,
      string[],
      BigNumberish[],
      BigNumberish[],
      string,
      BytesLike,
      BigNumberish,
    ],
  ): string;
  encodeFunctionData(
    functionFragment: 'liquidationCall',
    values: [string, string, string, BigNumberish, boolean],
  ): string;
  encodeFunctionData(
    functionFragment: 'repay',
    values: [string, BigNumberish, BigNumberish, string],
  ): string;
  encodeFunctionData(
    functionFragment: 'setUserUseReserveAsCollateral',
    values: [string, boolean],
  ): string;
  encodeFunctionData(
    functionFragment: 'swapBorrowRateMode',
    values: [string, BigNumberish],
  ): string;
  encodeFunctionData(
    functionFragment: 'withdraw',
    values: [string, BigNumberish, string],
  ): string;

  decodeFunctionResult(
    functionFragment: 'FLASHLOAN_PREMIUM_TOTAL',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: 'borrow', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'deposit', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'flashLoan', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'liquidationCall',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: 'repay', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'setUserUseReserveAsCollateral',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'swapBorrowRateMode',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: 'withdraw', data: BytesLike): Result;

  events: {};
}

export class ILendingPool extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: ILendingPoolInterface;

  functions: {
    FLASHLOAN_PREMIUM_TOTAL(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    'FLASHLOAN_PREMIUM_TOTAL()'(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    borrow(
      asset: string,
      amount: BigNumberish,
      interestRateMode: BigNumberish,
      referralCode: BigNumberish,
      onBehalfOf: string,
      overrides?: Overrides,
    ): Promise<ContractTransaction>;

    'borrow(address,uint256,uint256,uint16,address)'(
      asset: string,
      amount: BigNumberish,
      interestRateMode: BigNumberish,
      referralCode: BigNumberish,
      onBehalfOf: string,
      overrides?: Overrides,
    ): Promise<ContractTransaction>;

    deposit(
      asset: string,
      amount: BigNumberish,
      onBehalfOf: string,
      referralCode: BigNumberish,
      overrides?: Overrides,
    ): Promise<ContractTransaction>;

    'deposit(address,uint256,address,uint16)'(
      asset: string,
      amount: BigNumberish,
      onBehalfOf: string,
      referralCode: BigNumberish,
      overrides?: Overrides,
    ): Promise<ContractTransaction>;

    flashLoan(
      receiverAddress: string,
      assets: string[],
      amounts: BigNumberish[],
      modes: BigNumberish[],
      onBehalfOf: string,
      params: BytesLike,
      referralCode: BigNumberish,
      overrides?: Overrides,
    ): Promise<ContractTransaction>;

    'flashLoan(address,address[],uint256[],uint256[],address,bytes,uint16)'(
      receiverAddress: string,
      assets: string[],
      amounts: BigNumberish[],
      modes: BigNumberish[],
      onBehalfOf: string,
      params: BytesLike,
      referralCode: BigNumberish,
      overrides?: Overrides,
    ): Promise<ContractTransaction>;

    liquidationCall(
      collateralAsset: string,
      debtAsset: string,
      user: string,
      debtToCover: BigNumberish,
      receiveLToken: boolean,
      overrides?: Overrides,
    ): Promise<ContractTransaction>;

    'liquidationCall(address,address,address,uint256,bool)'(
      collateralAsset: string,
      debtAsset: string,
      user: string,
      debtToCover: BigNumberish,
      receiveLToken: boolean,
      overrides?: Overrides,
    ): Promise<ContractTransaction>;

    repay(
      asset: string,
      amount: BigNumberish,
      rateMode: BigNumberish,
      onBehalfOf: string,
      overrides?: Overrides,
    ): Promise<ContractTransaction>;

    'repay(address,uint256,uint256,address)'(
      asset: string,
      amount: BigNumberish,
      rateMode: BigNumberish,
      onBehalfOf: string,
      overrides?: Overrides,
    ): Promise<ContractTransaction>;

    setUserUseReserveAsCollateral(
      asset: string,
      useAsCollateral: boolean,
      overrides?: Overrides,
    ): Promise<ContractTransaction>;

    'setUserUseReserveAsCollateral(address,bool)'(
      asset: string,
      useAsCollateral: boolean,
      overrides?: Overrides,
    ): Promise<ContractTransaction>;

    swapBorrowRateMode(
      asset: string,
      rateMode: BigNumberish,
      overrides?: Overrides,
    ): Promise<ContractTransaction>;

    'swapBorrowRateMode(address,uint256)'(
      asset: string,
      rateMode: BigNumberish,
      overrides?: Overrides,
    ): Promise<ContractTransaction>;

    withdraw(
      asset: string,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides,
    ): Promise<ContractTransaction>;

    'withdraw(address,uint256,address)'(
      asset: string,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides,
    ): Promise<ContractTransaction>;
  };

  FLASHLOAN_PREMIUM_TOTAL(overrides?: CallOverrides): Promise<BigNumber>;

  'FLASHLOAN_PREMIUM_TOTAL()'(overrides?: CallOverrides): Promise<BigNumber>;

  borrow(
    asset: string,
    amount: BigNumberish,
    interestRateMode: BigNumberish,
    referralCode: BigNumberish,
    onBehalfOf: string,
    overrides?: Overrides,
  ): Promise<ContractTransaction>;

  'borrow(address,uint256,uint256,uint16,address)'(
    asset: string,
    amount: BigNumberish,
    interestRateMode: BigNumberish,
    referralCode: BigNumberish,
    onBehalfOf: string,
    overrides?: Overrides,
  ): Promise<ContractTransaction>;

  deposit(
    asset: string,
    amount: BigNumberish,
    onBehalfOf: string,
    referralCode: BigNumberish,
    overrides?: Overrides,
  ): Promise<ContractTransaction>;

  'deposit(address,uint256,address,uint16)'(
    asset: string,
    amount: BigNumberish,
    onBehalfOf: string,
    referralCode: BigNumberish,
    overrides?: Overrides,
  ): Promise<ContractTransaction>;

  flashLoan(
    receiverAddress: string,
    assets: string[],
    amounts: BigNumberish[],
    modes: BigNumberish[],
    onBehalfOf: string,
    params: BytesLike,
    referralCode: BigNumberish,
    overrides?: Overrides,
  ): Promise<ContractTransaction>;

  'flashLoan(address,address[],uint256[],uint256[],address,bytes,uint16)'(
    receiverAddress: string,
    assets: string[],
    amounts: BigNumberish[],
    modes: BigNumberish[],
    onBehalfOf: string,
    params: BytesLike,
    referralCode: BigNumberish,
    overrides?: Overrides,
  ): Promise<ContractTransaction>;

  liquidationCall(
    collateralAsset: string,
    debtAsset: string,
    user: string,
    debtToCover: BigNumberish,
    receiveLToken: boolean,
    overrides?: Overrides,
  ): Promise<ContractTransaction>;

  'liquidationCall(address,address,address,uint256,bool)'(
    collateralAsset: string,
    debtAsset: string,
    user: string,
    debtToCover: BigNumberish,
    receiveLToken: boolean,
    overrides?: Overrides,
  ): Promise<ContractTransaction>;

  repay(
    asset: string,
    amount: BigNumberish,
    rateMode: BigNumberish,
    onBehalfOf: string,
    overrides?: Overrides,
  ): Promise<ContractTransaction>;

  'repay(address,uint256,uint256,address)'(
    asset: string,
    amount: BigNumberish,
    rateMode: BigNumberish,
    onBehalfOf: string,
    overrides?: Overrides,
  ): Promise<ContractTransaction>;

  setUserUseReserveAsCollateral(
    asset: string,
    useAsCollateral: boolean,
    overrides?: Overrides,
  ): Promise<ContractTransaction>;

  'setUserUseReserveAsCollateral(address,bool)'(
    asset: string,
    useAsCollateral: boolean,
    overrides?: Overrides,
  ): Promise<ContractTransaction>;

  swapBorrowRateMode(
    asset: string,
    rateMode: BigNumberish,
    overrides?: Overrides,
  ): Promise<ContractTransaction>;

  'swapBorrowRateMode(address,uint256)'(
    asset: string,
    rateMode: BigNumberish,
    overrides?: Overrides,
  ): Promise<ContractTransaction>;

  withdraw(
    asset: string,
    amount: BigNumberish,
    to: string,
    overrides?: Overrides,
  ): Promise<ContractTransaction>;

  'withdraw(address,uint256,address)'(
    asset: string,
    amount: BigNumberish,
    to: string,
    overrides?: Overrides,
  ): Promise<ContractTransaction>;

  callStatic: {
    FLASHLOAN_PREMIUM_TOTAL(overrides?: CallOverrides): Promise<BigNumber>;

    'FLASHLOAN_PREMIUM_TOTAL()'(overrides?: CallOverrides): Promise<BigNumber>;

    borrow(
      asset: string,
      amount: BigNumberish,
      interestRateMode: BigNumberish,
      referralCode: BigNumberish,
      onBehalfOf: string,
      overrides?: CallOverrides,
    ): Promise<void>;

    'borrow(address,uint256,uint256,uint16,address)'(
      asset: string,
      amount: BigNumberish,
      interestRateMode: BigNumberish,
      referralCode: BigNumberish,
      onBehalfOf: string,
      overrides?: CallOverrides,
    ): Promise<void>;

    deposit(
      asset: string,
      amount: BigNumberish,
      onBehalfOf: string,
      referralCode: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>;

    'deposit(address,uint256,address,uint16)'(
      asset: string,
      amount: BigNumberish,
      onBehalfOf: string,
      referralCode: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>;

    flashLoan(
      receiverAddress: string,
      assets: string[],
      amounts: BigNumberish[],
      modes: BigNumberish[],
      onBehalfOf: string,
      params: BytesLike,
      referralCode: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>;

    'flashLoan(address,address[],uint256[],uint256[],address,bytes,uint16)'(
      receiverAddress: string,
      assets: string[],
      amounts: BigNumberish[],
      modes: BigNumberish[],
      onBehalfOf: string,
      params: BytesLike,
      referralCode: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>;

    liquidationCall(
      collateralAsset: string,
      debtAsset: string,
      user: string,
      debtToCover: BigNumberish,
      receiveLToken: boolean,
      overrides?: CallOverrides,
    ): Promise<void>;

    'liquidationCall(address,address,address,uint256,bool)'(
      collateralAsset: string,
      debtAsset: string,
      user: string,
      debtToCover: BigNumberish,
      receiveLToken: boolean,
      overrides?: CallOverrides,
    ): Promise<void>;

    repay(
      asset: string,
      amount: BigNumberish,
      rateMode: BigNumberish,
      onBehalfOf: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    'repay(address,uint256,uint256,address)'(
      asset: string,
      amount: BigNumberish,
      rateMode: BigNumberish,
      onBehalfOf: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    setUserUseReserveAsCollateral(
      asset: string,
      useAsCollateral: boolean,
      overrides?: CallOverrides,
    ): Promise<void>;

    'setUserUseReserveAsCollateral(address,bool)'(
      asset: string,
      useAsCollateral: boolean,
      overrides?: CallOverrides,
    ): Promise<void>;

    swapBorrowRateMode(
      asset: string,
      rateMode: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>;

    'swapBorrowRateMode(address,uint256)'(
      asset: string,
      rateMode: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>;

    withdraw(
      asset: string,
      amount: BigNumberish,
      to: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    'withdraw(address,uint256,address)'(
      asset: string,
      amount: BigNumberish,
      to: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    FLASHLOAN_PREMIUM_TOTAL(overrides?: CallOverrides): Promise<BigNumber>;

    'FLASHLOAN_PREMIUM_TOTAL()'(overrides?: CallOverrides): Promise<BigNumber>;

    borrow(
      asset: string,
      amount: BigNumberish,
      interestRateMode: BigNumberish,
      referralCode: BigNumberish,
      onBehalfOf: string,
      overrides?: Overrides,
    ): Promise<BigNumber>;

    'borrow(address,uint256,uint256,uint16,address)'(
      asset: string,
      amount: BigNumberish,
      interestRateMode: BigNumberish,
      referralCode: BigNumberish,
      onBehalfOf: string,
      overrides?: Overrides,
    ): Promise<BigNumber>;

    deposit(
      asset: string,
      amount: BigNumberish,
      onBehalfOf: string,
      referralCode: BigNumberish,
      overrides?: Overrides,
    ): Promise<BigNumber>;

    'deposit(address,uint256,address,uint16)'(
      asset: string,
      amount: BigNumberish,
      onBehalfOf: string,
      referralCode: BigNumberish,
      overrides?: Overrides,
    ): Promise<BigNumber>;

    flashLoan(
      receiverAddress: string,
      assets: string[],
      amounts: BigNumberish[],
      modes: BigNumberish[],
      onBehalfOf: string,
      params: BytesLike,
      referralCode: BigNumberish,
      overrides?: Overrides,
    ): Promise<BigNumber>;

    'flashLoan(address,address[],uint256[],uint256[],address,bytes,uint16)'(
      receiverAddress: string,
      assets: string[],
      amounts: BigNumberish[],
      modes: BigNumberish[],
      onBehalfOf: string,
      params: BytesLike,
      referralCode: BigNumberish,
      overrides?: Overrides,
    ): Promise<BigNumber>;

    liquidationCall(
      collateralAsset: string,
      debtAsset: string,
      user: string,
      debtToCover: BigNumberish,
      receiveLToken: boolean,
      overrides?: Overrides,
    ): Promise<BigNumber>;

    'liquidationCall(address,address,address,uint256,bool)'(
      collateralAsset: string,
      debtAsset: string,
      user: string,
      debtToCover: BigNumberish,
      receiveLToken: boolean,
      overrides?: Overrides,
    ): Promise<BigNumber>;

    repay(
      asset: string,
      amount: BigNumberish,
      rateMode: BigNumberish,
      onBehalfOf: string,
      overrides?: Overrides,
    ): Promise<BigNumber>;

    'repay(address,uint256,uint256,address)'(
      asset: string,
      amount: BigNumberish,
      rateMode: BigNumberish,
      onBehalfOf: string,
      overrides?: Overrides,
    ): Promise<BigNumber>;

    setUserUseReserveAsCollateral(
      asset: string,
      useAsCollateral: boolean,
      overrides?: Overrides,
    ): Promise<BigNumber>;

    'setUserUseReserveAsCollateral(address,bool)'(
      asset: string,
      useAsCollateral: boolean,
      overrides?: Overrides,
    ): Promise<BigNumber>;

    swapBorrowRateMode(
      asset: string,
      rateMode: BigNumberish,
      overrides?: Overrides,
    ): Promise<BigNumber>;

    'swapBorrowRateMode(address,uint256)'(
      asset: string,
      rateMode: BigNumberish,
      overrides?: Overrides,
    ): Promise<BigNumber>;

    withdraw(
      asset: string,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides,
    ): Promise<BigNumber>;

    'withdraw(address,uint256,address)'(
      asset: string,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides,
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    FLASHLOAN_PREMIUM_TOTAL(
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    'FLASHLOAN_PREMIUM_TOTAL()'(
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    borrow(
      asset: string,
      amount: BigNumberish,
      interestRateMode: BigNumberish,
      referralCode: BigNumberish,
      onBehalfOf: string,
      overrides?: Overrides,
    ): Promise<PopulatedTransaction>;

    'borrow(address,uint256,uint256,uint16,address)'(
      asset: string,
      amount: BigNumberish,
      interestRateMode: BigNumberish,
      referralCode: BigNumberish,
      onBehalfOf: string,
      overrides?: Overrides,
    ): Promise<PopulatedTransaction>;

    deposit(
      asset: string,
      amount: BigNumberish,
      onBehalfOf: string,
      referralCode: BigNumberish,
      overrides?: Overrides,
    ): Promise<PopulatedTransaction>;

    'deposit(address,uint256,address,uint16)'(
      asset: string,
      amount: BigNumberish,
      onBehalfOf: string,
      referralCode: BigNumberish,
      overrides?: Overrides,
    ): Promise<PopulatedTransaction>;

    flashLoan(
      receiverAddress: string,
      assets: string[],
      amounts: BigNumberish[],
      modes: BigNumberish[],
      onBehalfOf: string,
      params: BytesLike,
      referralCode: BigNumberish,
      overrides?: Overrides,
    ): Promise<PopulatedTransaction>;

    'flashLoan(address,address[],uint256[],uint256[],address,bytes,uint16)'(
      receiverAddress: string,
      assets: string[],
      amounts: BigNumberish[],
      modes: BigNumberish[],
      onBehalfOf: string,
      params: BytesLike,
      referralCode: BigNumberish,
      overrides?: Overrides,
    ): Promise<PopulatedTransaction>;

    liquidationCall(
      collateralAsset: string,
      debtAsset: string,
      user: string,
      debtToCover: BigNumberish,
      receiveLToken: boolean,
      overrides?: Overrides,
    ): Promise<PopulatedTransaction>;

    'liquidationCall(address,address,address,uint256,bool)'(
      collateralAsset: string,
      debtAsset: string,
      user: string,
      debtToCover: BigNumberish,
      receiveLToken: boolean,
      overrides?: Overrides,
    ): Promise<PopulatedTransaction>;

    repay(
      asset: string,
      amount: BigNumberish,
      rateMode: BigNumberish,
      onBehalfOf: string,
      overrides?: Overrides,
    ): Promise<PopulatedTransaction>;

    'repay(address,uint256,uint256,address)'(
      asset: string,
      amount: BigNumberish,
      rateMode: BigNumberish,
      onBehalfOf: string,
      overrides?: Overrides,
    ): Promise<PopulatedTransaction>;

    setUserUseReserveAsCollateral(
      asset: string,
      useAsCollateral: boolean,
      overrides?: Overrides,
    ): Promise<PopulatedTransaction>;

    'setUserUseReserveAsCollateral(address,bool)'(
      asset: string,
      useAsCollateral: boolean,
      overrides?: Overrides,
    ): Promise<PopulatedTransaction>;

    swapBorrowRateMode(
      asset: string,
      rateMode: BigNumberish,
      overrides?: Overrides,
    ): Promise<PopulatedTransaction>;

    'swapBorrowRateMode(address,uint256)'(
      asset: string,
      rateMode: BigNumberish,
      overrides?: Overrides,
    ): Promise<PopulatedTransaction>;

    withdraw(
      asset: string,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides,
    ): Promise<PopulatedTransaction>;

    'withdraw(address,uint256,address)'(
      asset: string,
      amount: BigNumberish,
      to: string,
      overrides?: Overrides,
    ): Promise<PopulatedTransaction>;
  };
}
