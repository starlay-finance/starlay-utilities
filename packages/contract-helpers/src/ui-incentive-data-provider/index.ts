import { BigNumber } from 'bignumber.js';
import { providers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { ERC20Service } from '..';
import {
  PriceFeedAggregatorAdapter,
  PriceFeedAggregatorAdapterInterface,
} from '../price-aggregator-adapter';

import { UiIncentiveDataProvider as UiIncentiveDataProviderContract } from './typechain/UiIncentiveDataProvider';
import { UiIncentiveDataProviderFactory } from './typechain/UiIncentiveDataProviderFactory';
import {
  FullReservesIncentiveDataResponse,
  IncentiveData,
  IncentiveDataHumanized,
  IncentiveUserData,
  IncentiveUserDataHumanized,
  ReserveIncentiveDataHumanizedResponse,
  ReserveIncentiveDataResponse,
  ReserveIncentiveWithFeedsResponse,
  UserReserveIncentiveDataHumanizedResponse,
  UserReserveIncentiveDataResponse,
} from './types/UiIncentiveDataProviderTypes';
export * from './types/UiIncentiveDataProviderTypes';

export interface UiIncentiveDataProviderInterface {
  getFullReservesIncentiveData: (
    user: string,
    incentiveDataProviderAddress: string,
    lendingPoolAddressProvider: string,
  ) => Promise<FullReservesIncentiveDataResponse>;
  getReservesIncentivesData: (
    lendingPoolAddressProvider: string,
  ) => Promise<ReserveIncentiveDataResponse[]>;
  getUserReservesIncentivesData: (
    user: string,
    lendingPoolAddressProvider: string,
  ) => Promise<UserReserveIncentiveDataResponse[]>;
  getReservesIncentivesDataHumanized: (
    lendingPoolAddressProvider: string,
  ) => Promise<ReserveIncentiveDataHumanizedResponse[]>;
  getUserReservesIncentivesDataHumanized: (
    user: string,
    lendingPoolAddressProvider: string,
  ) => Promise<UserReserveIncentiveDataHumanizedResponse[]>;
  getIncentivesDataWithPrice: (
    args: GetIncentivesDataWithPriceType,
  ) => Promise<ReserveIncentiveWithFeedsResponse[]>;
}
export interface UiIncentiveDataProviderContext {
  incentiveDataProviderAddress: string;
  priceAggregatorAdapterAddress: string;
  provider: providers.Provider;
}

export interface FeedResultSuccessful {
  rewardTokenAddress: string;
  price: BigNumber;
}

export interface GetIncentivesDataWithPriceType {
  lendingPoolAddressProvider: string;
  tokenAddress?: string;
}

interface DecimalResultSuccessful {
  tokenAddress: string;
  decimal: number;
}

export class UiIncentiveDataProvider
  implements UiIncentiveDataProviderInterface
{
  public readonly _contract: UiIncentiveDataProviderContract;

  private readonly _chainlinkFeedsRegistries: PriceFeedAggregatorAdapterInterface;

  private readonly _erc20Service: ERC20Service;
  /**
   * Constructor
   * @param context The ui incentive data provider context
   */
  public constructor(context: UiIncentiveDataProviderContext) {
    if (!isAddress(context.incentiveDataProviderAddress)) {
      throw new Error('contract address is not valid');
    }

    if (!isAddress(context.priceAggregatorAdapterAddress)) {
      throw new Error('price aggregator address is not valid');
    }

    this._chainlinkFeedsRegistries = new PriceFeedAggregatorAdapter({
      provider: context.provider,
      contractAddress: context.priceAggregatorAdapterAddress,
    });

    this._contract = UiIncentiveDataProviderFactory.connect(
      context.incentiveDataProviderAddress,
      context.provider,
    );

    this._erc20Service = new ERC20Service(context.provider);
  }

  /**
   *  Get the full reserve incentive data for the lending pool and the user
   * @param user The user address
   */
  public async getFullReservesIncentiveData(
    user: string,
    lendingPoolAddressProvider: string,
  ): Promise<FullReservesIncentiveDataResponse> {
    if (!isAddress(lendingPoolAddressProvider)) {
      throw new Error('Lending pool address provider is not valid');
    }

    if (!isAddress(user)) {
      throw new Error('User address is not a valid ethereum address');
    }

    return this._contract.getFullReservesIncentiveData(
      lendingPoolAddressProvider,
      user,
    );
  }

  /**
   *  Get the reserve incentive data for the lending pool
   */
  public async getReservesIncentivesData(
    lendingPoolAddressProvider: string,
  ): Promise<ReserveIncentiveDataResponse[]> {
    if (!isAddress(lendingPoolAddressProvider)) {
      throw new Error('Lending pool address provider is not valid');
    }

    return this._contract.getReservesIncentivesData(lendingPoolAddressProvider);
  }

  public async getReservesIncentivesDataHumanized(
    lendingPoolAddressProvider: string,
  ): Promise<ReserveIncentiveDataHumanizedResponse[]> {
    const response = await this.getReservesIncentivesData(
      lendingPoolAddressProvider,
    );

    return response.map(r => ({
      underlyingAsset: r.underlyingAsset.toLowerCase(),
      lIncentiveData: this._formatIncentiveData(r.lIncentiveData),
      vdIncentiveData: this._formatIncentiveData(r.vdIncentiveData),
      sdIncentiveData: this._formatIncentiveData(r.sdIncentiveData),
    }));
  }

  public async getUserReservesIncentivesDataHumanized(
    user: string,
    lendingPoolAddressProvider: string,
  ): Promise<UserReserveIncentiveDataHumanizedResponse[]> {
    const response = await this.getUserReservesIncentivesData(
      user,
      lendingPoolAddressProvider,
    );

    return response.map(r => ({
      underlyingAsset: r.underlyingAsset.toLowerCase(),
      lTokenIncentivesUserData: this._formatUserIncentiveData(
        r.lTokenIncentivesUserData,
      ),
      vdTokenIncentivesUserData: this._formatUserIncentiveData(
        r.vdTokenIncentivesUserData,
      ),
      sdTokenIncentivesUserData: this._formatUserIncentiveData(
        r.sdTokenIncentivesUserData,
      ),
    }));
  }

  /**
   *  Get the reserve incentive data for the user
   * @param user The user address
   */
  public async getUserReservesIncentivesData(
    user: string,
    lendingPoolAddressProvider: string,
  ): Promise<UserReserveIncentiveDataResponse[]> {
    if (!isAddress(lendingPoolAddressProvider)) {
      throw new Error('Lending pool address provider is not valid');
    }

    if (!isAddress(user)) {
      throw new Error('User address is not a valid ethereum address');
    }

    return this._contract.getUserReservesIncentivesData(
      lendingPoolAddressProvider,
      user,
    );
  }

  public async getIncentivesDataWithPrice({
    lendingPoolAddressProvider,
  }: GetIncentivesDataWithPriceType): Promise<
    ReserveIncentiveWithFeedsResponse[]
  > {
    const incentives: ReserveIncentiveDataHumanizedResponse[] =
      await this.getReservesIncentivesDataHumanized(lendingPoolAddressProvider);
    const feeds: FeedResultSuccessful[] = [];
    const decimals: Map<string, number> = new Map();
    const allIncentiveRewardTokens: Set<string> = new Set();

    incentives.forEach(incentive => {
      allIncentiveRewardTokens.add(incentive.lIncentiveData.rewardTokenAddress);
      allIncentiveRewardTokens.add(
        incentive.vdIncentiveData.rewardTokenAddress,
      );
      allIncentiveRewardTokens.add(
        incentive.sdIncentiveData.rewardTokenAddress,
      );
    });

    const incentiveRewardTokens: string[] = Array.from(
      allIncentiveRewardTokens,
    );

    // eslint-disable-next-line @typescript-eslint/promise-function-async
    const rewardFeedPromises = incentiveRewardTokens.map(rewardToken =>
      this._getFeed(rewardToken),
    );

    // eslint-disable-next-line @typescript-eslint/promise-function-async
    const decimalsPromises = incentiveRewardTokens.map(rewardToken =>
      this._getTokenDecimals(rewardToken),
    );

    const feedResults = await Promise.allSettled(rewardFeedPromises);
    const decimalsResults = await Promise.allSettled(decimalsPromises);

    feedResults.forEach(feedResult => {
      if (feedResult.status === 'fulfilled')
        feeds.push({ ...feedResult.value });
    });
    decimalsResults.forEach(result => {
      if (result.status === 'fulfilled')
        decimals.set(result.value.tokenAddress, result.value.decimal);
    });

    return incentives.map(
      (incentive: ReserveIncentiveDataHumanizedResponse) => {
        const lFeed = feeds.find(
          feed =>
            feed.rewardTokenAddress ===
            incentive.lIncentiveData.rewardTokenAddress,
        );
        const vdFeed = feeds.find(
          feed =>
            feed.rewardTokenAddress ===
            incentive.vdIncentiveData.rewardTokenAddress,
        );
        const sdFeed = feeds.find(
          feed =>
            feed.rewardTokenAddress ===
            incentive.sdIncentiveData.rewardTokenAddress,
        );
        const lDec = decimals.get(incentive.lIncentiveData.rewardTokenAddress);
        const vdDec = decimals.get(
          incentive.vdIncentiveData.rewardTokenAddress,
        );
        const sdDec = decimals.get(
          incentive.sdIncentiveData.rewardTokenAddress,
        );

        return {
          underlyingAsset: incentive.underlyingAsset,
          lIncentiveData: {
            ...incentive.lIncentiveData,
            priceFeed: lFeed ? lFeed.price.toFixed() : '0',
            priceFeedDecimals: lDec ? lDec : 0,
          },
          vdIncentiveData: {
            ...incentive.vdIncentiveData,
            priceFeed: vdFeed ? vdFeed.price.toFixed() : '0',
            priceFeedDecimals: vdDec ? vdDec : 0,
          },
          sdIncentiveData: {
            ...incentive.sdIncentiveData,
            priceFeed: sdFeed ? sdFeed.price.toFixed() : '0',
            priceFeedDecimals: sdDec ? sdDec : 0,
          },
        };
      },
    );
  }

  private readonly _getFeed = async (
    rewardToken: string,
  ): Promise<FeedResultSuccessful> => {
    const feed = await this._chainlinkFeedsRegistries.currentPrice(rewardToken);

    return {
      price: new BigNumber(feed.price.toNumber()),
      rewardTokenAddress: rewardToken,
    };
  };

  private readonly _getTokenDecimals = async (
    tokenAddress: string,
  ): Promise<DecimalResultSuccessful> => {
    const decimal = await this._erc20Service.decimalsOf(tokenAddress);
    return {
      tokenAddress,
      decimal,
    };
  };

  private _formatIncentiveData(data: IncentiveData): IncentiveDataHumanized {
    return {
      tokenAddress: data.tokenAddress,
      precision: data.precision,
      rewardTokenAddress: data.rewardTokenAddress,
      incentiveControllerAddress: data.incentiveControllerAddress,
      rewardTokenDecimals: data.rewardTokenDecimals,
      emissionPerSecond: data.emissionPerSecond.toString(),
      incentivesLastUpdateTimestamp:
        data.incentivesLastUpdateTimestamp.toNumber(),
      tokenIncentivesIndex: data.tokenIncentivesIndex.toString(),
      emissionEndTimestamp: data.emissionEndTimestamp.toNumber(),
    };
  }

  private _formatUserIncentiveData(
    data: IncentiveUserData,
  ): IncentiveUserDataHumanized {
    return {
      tokenAddress: data.tokenAddress,
      rewardTokenAddress: data.rewardTokenAddress,
      incentiveControllerAddress: data.incentiveControllerAddress,
      rewardTokenDecimals: data.rewardTokenDecimals,
      tokenIncentivesUserIndex: data.tokenincentivesUserIndex.toString(),
      userUnclaimedRewards: data.userUnclaimedRewards.toString(),
    };
  }
}
