// From UiIncentiveDatProvider
export interface ReserveIncentiveWithFeedsResponse {
  underlyingAsset: string;
  lIncentiveData: IncentivesWithFeeds;
  vdIncentiveData: IncentivesWithFeeds;
  sdIncentiveData: IncentivesWithFeeds;
}

export interface IncentivesWithFeeds extends IncentiveDataHumanized {
  priceFeed: string;
}

export interface IncentiveDataHumanized {
  emissionPerSecond: string;
  incentivesLastUpdateTimestamp: number;
  tokenIncentivesIndex: string;
  emissionEndTimestamp: number;
  tokenAddress: string;
  rewardTokenAddress: string;
  incentiveControllerAddress: string;
  rewardTokenDecimals: number;
  precision: number;
}

// From UiIncentiveDataProvider
export interface UserReserveIncentiveDataHumanizedResponse {
  underlyingAsset: string;
  lTokenIncentivesUserData: IncentiveUserDataHumanized;
  vdTokenIncentivesUserData: IncentiveUserDataHumanized;
  sdTokenIncentivesUserData: IncentiveUserDataHumanized;
}

export interface IncentiveUserDataHumanized {
  tokenIncentivesUserIndex: string;
  userUnclaimedRewards: string;
  tokenAddress: string;
  rewardTokenAddress: string;
  incentiveControllerAddress: string;
  rewardTokenDecimals: number;
}

export interface UserReserveCalculationData {
  underlyingAsset: string;
  totalLiquidity: string;
  liquidityIndex: string;
  totalScaledVariableDebt: string;
  totalPrincipalStableDebt: string;
  scaledLTokenBalance: string;
  scaledVariableDebt: string;
  principalStableDebt: string;
}

export interface ReserveCalculationData {
  underlyingAsset: string;
  symbol: string;
  totalLiquidity: string;
  totalVariableDebt: string;
  totalStableDebt: string;
  priceInMarketReferenceCurrency: string;
  marketReferenceCurrencyDecimals: number;
  decimals: number;
}
