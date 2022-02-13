import { calculateIncentiveAPR } from './calculate-incentive-apr';
import { ReserveIncentiveWithFeedsResponse } from './types';

export interface CalculateReserveIncentivesRequest {
  reserveIncentiveData: ReserveIncentiveWithFeedsResponse;
  aRewardTokenPriceInMarketReferenceCurrency: string; // Can be priced in ETH or USD depending on market
  vRewardTokenPriceInMarketReferenceCurrency: string;
  sRewardTokenPriceInMarketReferenceCurrency: string;
  totalLiquidity: string;
  totalVariableDebt: string;
  totalStableDebt: string;
  decimals: number;
  priceInMarketReferenceCurrency: string; // Can be priced in ETH or USD depending on market
}

interface ReserveIncentiveResponse {
  incentiveAPR: string;
  rewardTokenAddress: string;
}
export interface CalculateReserveIncentivesResponse {
  underlyingAsset: string;
  lIncentivesData: ReserveIncentiveResponse;
  vdIncentivesData: ReserveIncentiveResponse;
  sdIncentivesData: ReserveIncentiveResponse;
}

// Calculate deposit, variableBorrow, and stableBorrow incentives APR for a reserve asset
export function calculateReserveIncentives({
  reserveIncentiveData,
  aRewardTokenPriceInMarketReferenceCurrency,
  vRewardTokenPriceInMarketReferenceCurrency,
  sRewardTokenPriceInMarketReferenceCurrency,
  totalLiquidity,
  totalVariableDebt,
  totalStableDebt,
  decimals,
  priceInMarketReferenceCurrency,
}: CalculateReserveIncentivesRequest): CalculateReserveIncentivesResponse {
  const lIncentivesAPR = calculateIncentiveAPR({
    emissionPerSecond: reserveIncentiveData.lIncentiveData.emissionPerSecond,
    rewardTokenPriceInMarketReferenceCurrency:
      aRewardTokenPriceInMarketReferenceCurrency,
    priceInMarketReferenceCurrency,
    totalTokenSupply: totalLiquidity,
    decimals,
    rewardTokenDecimals:
      reserveIncentiveData.lIncentiveData.rewardTokenDecimals,
  });

  const vdIncentivesAPR = calculateIncentiveAPR({
    emissionPerSecond: reserveIncentiveData.vdIncentiveData.emissionPerSecond,
    rewardTokenPriceInMarketReferenceCurrency:
      vRewardTokenPriceInMarketReferenceCurrency,
    priceInMarketReferenceCurrency,
    totalTokenSupply: totalVariableDebt,
    decimals,
    rewardTokenDecimals:
      reserveIncentiveData.lIncentiveData.rewardTokenDecimals,
  });

  const sdIncentivesAPR = calculateIncentiveAPR({
    emissionPerSecond: reserveIncentiveData.sdIncentiveData.emissionPerSecond,
    rewardTokenPriceInMarketReferenceCurrency:
      sRewardTokenPriceInMarketReferenceCurrency,
    priceInMarketReferenceCurrency,
    totalTokenSupply: totalStableDebt,
    decimals,
    rewardTokenDecimals:
      reserveIncentiveData.lIncentiveData.rewardTokenDecimals,
  });

  return {
    underlyingAsset: reserveIncentiveData.underlyingAsset,
    lIncentivesData: {
      incentiveAPR: lIncentivesAPR,
      rewardTokenAddress:
        reserveIncentiveData.lIncentiveData.rewardTokenAddress,
    },
    vdIncentivesData: {
      incentiveAPR: vdIncentivesAPR,
      rewardTokenAddress:
        reserveIncentiveData.vdIncentiveData.rewardTokenAddress,
    },
    sdIncentivesData: {
      incentiveAPR: sdIncentivesAPR,
      rewardTokenAddress:
        reserveIncentiveData.sdIncentiveData.rewardTokenAddress,
    },
  };
}
