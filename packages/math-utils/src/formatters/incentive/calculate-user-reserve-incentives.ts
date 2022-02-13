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
  vIncentives: BigNumber; // variable debt incentives
  sIncentives: BigNumber; // stable debt incentives
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

  const vIncentivesRequest = {
    principalUserBalance: new BigNumber(userReserveData.scaledVariableDebt),
    reserveIndex: new BigNumber(
      reserveIncentives.vIncentiveData.tokenIncentivesIndex,
    ),
    userIndex: new BigNumber(
      userReserveIncentives.vTokenIncentivesUserData.tokenIncentivesUserIndex,
    ),
    precision: reserveIncentives.vIncentiveData.precision,
    rewardTokenDecimals: reserveIncentives.vIncentiveData.rewardTokenDecimals,
    reserveIndexTimestamp:
      reserveIncentives.vIncentiveData.incentivesLastUpdateTimestamp,
    emissionPerSecond: new BigNumber(
      reserveIncentives.vIncentiveData.emissionPerSecond,
    ),
    totalSupply: new BigNumber(userReserveData.totalScaledVariableDebt),
    currentTimestamp,
    emissionEndTimestamp: reserveIncentives.vIncentiveData.emissionEndTimestamp,
  };

  const sIncentivesRequest = {
    principalUserBalance: new BigNumber(userReserveData.principalStableDebt),
    reserveIndex: new BigNumber(
      reserveIncentives.sIncentiveData.tokenIncentivesIndex,
    ),
    userIndex: new BigNumber(
      userReserveIncentives.sTokenIncentivesUserData.tokenIncentivesUserIndex,
    ),
    precision: reserveIncentives.sIncentiveData.precision,
    rewardTokenDecimals: reserveIncentives.sIncentiveData.rewardTokenDecimals,
    reserveIndexTimestamp:
      reserveIncentives.sIncentiveData.incentivesLastUpdateTimestamp,
    emissionPerSecond: new BigNumber(
      reserveIncentives.sIncentiveData.emissionPerSecond,
    ),
    totalSupply: new BigNumber(userReserveData.totalPrincipalStableDebt),
    currentTimestamp,
    emissionEndTimestamp: reserveIncentives.sIncentiveData.emissionEndTimestamp,
  };

  const lIncentives = calculateAccruedIncentives(lIncentivesRequest);
  const vIncentives = calculateAccruedIncentives(vIncentivesRequest);
  const sIncentives = calculateAccruedIncentives(sIncentivesRequest);

  return { lIncentives, vIncentives, sIncentives };
}
