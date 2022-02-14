import BigNumber from 'bignumber.js';
import { rayDiv } from '../../ray.math';
import { calculateAccruedIncentives } from './calculate-accrued-incentives';
import {
  ReserveIncentiveWithFeedsResponse,
  UserReserveCalculationData,
  UserReserveIncentiveDataHumanizedResponse,
} from './types';

export interface CalculateUserReserveIncentivesRequest {
  reserveIncentives: ReserveIncentiveWithFeedsResponse; // token incentive data, from UiIncentiveDataProvider
  userReserveIncentives: UserReserveIncentiveDataHumanizedResponse; // user incentive data, from UiIncentiveDataProvider
  currentTimestamp: number;
  userReserveData: UserReserveCalculationData;
}

export interface CalculateUserReserveIncentivesResponse {
  lIncentives: BigNumber; // deposit incentives
  vdIncentives: BigNumber; // variable debt incentives
  sdIncentives: BigNumber; // stable debt incentives
}

// Calculate user deposit and borrow incentives for an individual reserve asset
export function calculateUserReserveIncentives({
  reserveIncentives,
  userReserveIncentives,
  currentTimestamp,
  userReserveData,
}: CalculateUserReserveIncentivesRequest): CalculateUserReserveIncentivesResponse {
  const totalDeposits = rayDiv(
    new BigNumber(userReserveData.totalLiquidity),
    new BigNumber(userReserveData.liquidityIndex),
  );
  const lIncentivesRequest = {
    principalUserBalance: new BigNumber(userReserveData.scaledLTokenBalance),
    reserveIndex: new BigNumber(
      reserveIncentives.lIncentiveData.tokenIncentivesIndex,
    ),
    userIndex: new BigNumber(
      userReserveIncentives.lTokenIncentivesUserData.tokenIncentivesUserIndex,
    ),
    precision: reserveIncentives.lIncentiveData.precision,
    rewardTokenDecimals: reserveIncentives.lIncentiveData.rewardTokenDecimals,
    reserveIndexTimestamp:
      reserveIncentives.lIncentiveData.incentivesLastUpdateTimestamp,
    emissionPerSecond: new BigNumber(
      reserveIncentives.lIncentiveData.emissionPerSecond,
    ),
    totalSupply: totalDeposits,
    currentTimestamp,
    emissionEndTimestamp: reserveIncentives.lIncentiveData.emissionEndTimestamp,
  };

  const vdIncentivesRequest = {
    principalUserBalance: new BigNumber(userReserveData.scaledVariableDebt),
    reserveIndex: new BigNumber(
      reserveIncentives.vdIncentiveData.tokenIncentivesIndex,
    ),
    userIndex: new BigNumber(
      userReserveIncentives.vdTokenIncentivesUserData.tokenIncentivesUserIndex,
    ),
    precision: reserveIncentives.vdIncentiveData.precision,
    rewardTokenDecimals: reserveIncentives.vdIncentiveData.rewardTokenDecimals,
    reserveIndexTimestamp:
      reserveIncentives.vdIncentiveData.incentivesLastUpdateTimestamp,
    emissionPerSecond: new BigNumber(
      reserveIncentives.vdIncentiveData.emissionPerSecond,
    ),
    totalSupply: new BigNumber(userReserveData.totalScaledVariableDebt),
    currentTimestamp,
    emissionEndTimestamp:
      reserveIncentives.vdIncentiveData.emissionEndTimestamp,
  };

  const sdIncentivesRequest = {
    principalUserBalance: new BigNumber(userReserveData.principalStableDebt),
    reserveIndex: new BigNumber(
      reserveIncentives.sdIncentiveData.tokenIncentivesIndex,
    ),
    userIndex: new BigNumber(
      userReserveIncentives.sdTokenIncentivesUserData.tokenIncentivesUserIndex,
    ),
    precision: reserveIncentives.sdIncentiveData.precision,
    rewardTokenDecimals: reserveIncentives.sdIncentiveData.rewardTokenDecimals,
    reserveIndexTimestamp:
      reserveIncentives.sdIncentiveData.incentivesLastUpdateTimestamp,
    emissionPerSecond: new BigNumber(
      reserveIncentives.sdIncentiveData.emissionPerSecond,
    ),
    totalSupply: new BigNumber(userReserveData.totalPrincipalStableDebt),
    currentTimestamp,
    emissionEndTimestamp:
      reserveIncentives.sdIncentiveData.emissionEndTimestamp,
  };

  const lIncentives = calculateAccruedIncentives(lIncentivesRequest);
  const vdIncentives = calculateAccruedIncentives(vdIncentivesRequest);
  const sdIncentives = calculateAccruedIncentives(sdIncentivesRequest);

  return { lIncentives, vdIncentives, sdIncentives };
}
