import { calculateIncentiveAPR } from './calculate-incentive-apr';
import { ReserveIncentiveWithFeedsResponse } from './types';

export interface CalculateReserveIncentivesRequest {
  reserveIncentiveData: ReserveIncentiveWithFeedsResponse;
  lRewardTokenPriceInMarketReferenceCurrency: string; // Can be priced in ETH or USD depending on market
  vdRewardTokenPriceInMarketReferenceCurrency: string;
  sdRewardTokenPriceInMarketReferenceCurrency: string;
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
  lRewardTokenPriceInMarketReferenceCurrency,
  vdRewardTokenPriceInMarketReferenceCurrency,
  sdRewardTokenPriceInMarketReferenceCurrency,
  totalLiquidity,
  totalVariableDebt,
  totalStableDebt,
  decimals,
  priceInMarketReferenceCurrency,
}: CalculateReserveIncentivesRequest): CalculateReserveIncentivesResponse {
  const aIncentivesAPR = calculateIncentiveAPR({
    emissionPerSecond: reserveIncentiveData.lIncentiveData.emissionPerSecond,
    rewardTokenPriceInMarketReferenceCurrency:
      lRewardTokenPriceInMarketReferenceCurrency,
    priceInMarketReferenceCurrency,
    totalTokenSupply: totalLiquidity,
    decimals,
    rewardTokenDecimals:
      reserveIncentiveData.lIncentiveData.rewardTokenDecimals,
  });

  const vIncentivesAPR = calculateIncentiveAPR({
    emissionPerSecond: reserveIncentiveData.vdIncentiveData.emissionPerSecond,
    rewardTokenPriceInMarketReferenceCurrency:
      vdRewardTokenPriceInMarketReferenceCurrency,
    priceInMarketReferenceCurrency,
    totalTokenSupply: totalVariableDebt,
    decimals,
    rewardTokenDecimals:
      reserveIncentiveData.lIncentiveData.rewardTokenDecimals,
  });

  const sIncentivesAPR = calculateIncentiveAPR({
    emissionPerSecond: reserveIncentiveData.sdIncentiveData.emissionPerSecond,
    rewardTokenPriceInMarketReferenceCurrency:
      sdRewardTokenPriceInMarketReferenceCurrency,
    priceInMarketReferenceCurrency,
    totalTokenSupply: totalStableDebt,
    decimals,
    rewardTokenDecimals:
      reserveIncentiveData.lIncentiveData.rewardTokenDecimals,
  });

  return {
    underlyingAsset: reserveIncentiveData.underlyingAsset,
    lIncentivesData: {
      incentiveAPR: aIncentivesAPR,
      rewardTokenAddress:
        reserveIncentiveData.lIncentiveData.rewardTokenAddress,
    },
    vdIncentivesData: {
      incentiveAPR: vIncentivesAPR,
      rewardTokenAddress:
        reserveIncentiveData.vdIncentiveData.rewardTokenAddress,
    },
    sdIncentivesData: {
      incentiveAPR: sIncentivesAPR,
      rewardTokenAddress:
        reserveIncentiveData.sdIncentiveData.rewardTokenAddress,
    },
  };
}
