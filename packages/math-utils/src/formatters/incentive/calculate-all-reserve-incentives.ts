import {
  calculateReserveIncentives,
  CalculateReserveIncentivesResponse,
} from './calculate-reserve-incentives';
import {
  ReserveCalculationData,
  ReserveIncentiveWithFeedsResponse,
} from './types';

// Indexed by reserve underlyingAsset address
export type ReserveIncentiveDict = Record<string, ReserveIncentives>;

interface ReserveIncentives {
  lIncentives: ReserveIncentive;
  vdIncentives: ReserveIncentive;
  sdIncentives: ReserveIncentive;
}

interface ReserveIncentive {
  incentiveAPR: string;
  rewardTokenAddress: string;
}

export interface CalculateAllReserveIncentivesRequest {
  reserveIncentives: ReserveIncentiveWithFeedsResponse[];
  reserves: ReserveCalculationData[];
  underlyingAsserDict?: Record<string, string>;
}

// Calculate incentive token price from reserves data or priceFeed from UiIncentiveDataProvider

function calculateRewardTokenPrice(
  reserves: ReserveCalculationData[],
  address: string,
  priceFeed: string,
  underlyingAssetDict?: Record<string, string>,
): string {
  const addressLowerCase = address.toLowerCase();
  const underlyingAssetAddress =
    underlyingAssetDict?.[addressLowerCase] ?? addressLowerCase;
  const rewardReserve = reserves.find(
    reserve => reserve.underlyingAsset.toLowerCase() === underlyingAssetAddress,
  );
  if (rewardReserve) {
    return rewardReserve.priceInMarketReferenceCurrency;
  }

  return priceFeed;
}

export function calculateAllReserveIncentives({
  reserveIncentives,
  reserves,
  underlyingAsserDict,
}: CalculateAllReserveIncentivesRequest): ReserveIncentiveDict {
  const reserveDict: ReserveIncentiveDict = {};
  // calculate incentive per reserve token
  reserveIncentives.forEach(reserveIncentive => {
    // Find the corresponding reserve data for each reserveIncentive
    const reserve: ReserveCalculationData | undefined = reserves.find(
      (reserve: ReserveCalculationData) =>
        reserve.underlyingAsset.toLowerCase() ===
        reserveIncentive.underlyingAsset.toLowerCase(),
    );
    if (reserve) {
      const calculatedReserveIncentives: CalculateReserveIncentivesResponse =
        calculateReserveIncentives({
          reserveIncentiveData: reserveIncentive,
          totalLiquidity: reserve.totalLiquidity,
          totalVariableDebt: reserve.totalVariableDebt,
          totalStableDebt: reserve.totalStableDebt,
          priceInMarketReferenceCurrency:
            reserve.priceInMarketReferenceCurrency,
          decimals: reserve.decimals,
          lRewardTokenPriceInMarketReferenceCurrency: calculateRewardTokenPrice(
            reserves,
            reserveIncentive.lIncentiveData.rewardTokenAddress.toLowerCase(),
            reserveIncentive.lIncentiveData.priceFeed,
            underlyingAsserDict,
          ),
          vdRewardTokenPriceInMarketReferenceCurrency:
            calculateRewardTokenPrice(
              reserves,
              reserveIncentive.vdIncentiveData.rewardTokenAddress.toLowerCase(),
              reserveIncentive.vdIncentiveData.priceFeed,
              underlyingAsserDict,
            ),
          sdRewardTokenPriceInMarketReferenceCurrency:
            calculateRewardTokenPrice(
              reserves,
              reserveIncentive.sdIncentiveData.rewardTokenAddress.toLowerCase(),
              reserveIncentive.sdIncentiveData.priceFeed,
              underlyingAsserDict,
            ),
        });
      reserveDict[calculatedReserveIncentives.underlyingAsset] = {
        lIncentives: calculatedReserveIncentives.lIncentivesData,
        vdIncentives: calculatedReserveIncentives.vdIncentivesData,
        sdIncentives: calculatedReserveIncentives.sdIncentivesData,
      };
    }
  });

  return reserveDict;
}
