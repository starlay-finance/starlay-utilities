/* Autogenerated file. Do not edit manually. */
/* eslint-disable */
import {
  ethers,
  Signer,
  BigNumber,
  PopulatedTransaction,
  Overrides,
  BaseContract,
  BytesLike,
  ContractTransaction,
} from 'ethers';
import { FunctionFragment, Result } from '@ethersproject/abi';
import { Provider } from '@ethersproject/providers';

interface ClaimerInterface extends ethers.utils.Interface {
  contractName: 'Claimer';
  functions: {
    'arthSwapTokenSale()': FunctionFragment;
    'incentivesController()': FunctionFragment;
    'releasable(address,address[])': FunctionFragment;
    'release(address[])': FunctionFragment;
    'starlayTokenSale()': FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: 'arthSwapTokenSale',
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: 'incentivesController',
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: 'releasable',
    values: [string, string[]],
  ): string;
  encodeFunctionData(functionFragment: 'release', values: [string[]]): string;
  encodeFunctionData(
    functionFragment: 'starlayTokenSale',
    values?: undefined,
  ): string;

  decodeFunctionResult(
    functionFragment: 'arthSwapTokenSale',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'incentivesController',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: 'releasable', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'release', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'starlayTokenSale',
    data: BytesLike,
  ): Result;

  events: {};
}

export interface Claimer extends BaseContract {
  contractName: 'Claimer';
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ClaimerInterface;

  functions: {
    arthSwapTokenSale(overrides?: Overrides): Promise<{
      0: string;
    }>;

    incentivesController(overrides?: Overrides): Promise<{
      0: string;
    }>;

    releasable(
      account: string,
      assets: string[],
      overrides?: Overrides,
    ): Promise<{
      _starlayTokenSale: BigNumber;
      _arthswapTokenSale: BigNumber;
      _liquidityMining: BigNumber;
      0: BigNumber;
      1: BigNumber;
      2: BigNumber;
    }>;

    release(
      assets: string[],
      overrides?: Overrides,
    ): Promise<ContractTransaction>;

    starlayTokenSale(overrides?: Overrides): Promise<{
      0: string;
    }>;
  };

  arthSwapTokenSale(overrides?: Overrides): Promise<string>;

  incentivesController(overrides?: Overrides): Promise<string>;

  releasable(
    account: string,
    assets: string[],
    overrides?: Overrides,
  ): Promise<{
    _starlayTokenSale: BigNumber;
    _arthswapTokenSale: BigNumber;
    _liquidityMining: BigNumber;
    0: BigNumber;
    1: BigNumber;
    2: BigNumber;
  }>;

  release(
    assets: string[],
    overrides?: Overrides,
  ): Promise<ContractTransaction>;

  starlayTokenSale(overrides?: Overrides): Promise<string>;

  callStatic: {
    arthSwapTokenSale(overrides?: Overrides): Promise<string>;

    incentivesController(overrides?: Overrides): Promise<string>;

    releasable(
      account: string,
      assets: string[],
      overrides?: Overrides,
    ): Promise<{
      _starlayTokenSale: BigNumber;
      _arthswapTokenSale: BigNumber;
      _liquidityMining: BigNumber;
      0: BigNumber;
      1: BigNumber;
      2: BigNumber;
    }>;

    starlayTokenSale(overrides?: Overrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    arthSwapTokenSale(overrides?: Overrides): Promise<BigNumber>;

    incentivesController(overrides?: Overrides): Promise<BigNumber>;

    releasable(
      account: string,
      assets: string[],
      overrides?: Overrides,
    ): Promise<BigNumber>;

    release(assets: string[], overrides?: Overrides): Promise<BigNumber>;

    starlayTokenSale(overrides?: Overrides): Promise<BigNumber>;
  };

  populateTransaction: {
    arthSwapTokenSale(overrides?: Overrides): Promise<PopulatedTransaction>;

    incentivesController(overrides?: Overrides): Promise<PopulatedTransaction>;

    releasable(
      account: string,
      assets: string[],
      overrides?: Overrides,
    ): Promise<PopulatedTransaction>;

    release(
      assets: string[],
      overrides?: Overrides,
    ): Promise<PopulatedTransaction>;

    starlayTokenSale(overrides?: Overrides): Promise<PopulatedTransaction>;
  };
}