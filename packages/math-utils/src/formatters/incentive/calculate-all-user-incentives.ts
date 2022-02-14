import { BigNumber } from 'bignumber.js';
import { valueToZDBigNumber } from '../../bignumber';
import {
  calculateUserReserveIncentives,
  CalculateUserReserveIncentivesResponse,
} from './calculate-user-reserve-incentives';
import {
  ReserveIncentiveWithFeedsResponse,
  UserReserveCalculationData,
  UserReserveIncentiveDataHumanizedResponse,
} from './types';

// Indexed by incentives controller address
export type UserIncentiveDict = Record<string, UserIncentiveData>;

interface UserIncentiveData {
  rewardTokenAddress: string;
  rewardTokenDecimals: number;
  claimableRewards: BigNumber;
  assets: string[];
}

interface RewardCalculation {
  tokenAddress: string;
  incentiveController: string;
  rewardTokenAddress: string;
  rewardTokenDecimals: number;
  accruedRewards: BigNumber;
  unclaimedRewards: BigNumber;
}

export interface CalculateAllUserIncentivesRequest {
  reserveIncentives: ReserveIncentiveWithFeedsResponse[]; // token incentive data, from UiIncentiveDataProvider
  userReserveIncentives: UserReserveIncentiveDataHumanizedResponse[]; // user incentive data, from UiIncentiveDataProvider
  userReserves: UserReserveCalculationData[]; // deposit and borrow data for user assets
  currentTimestamp: number;
}

export function calculateAllUserIncentives({
  reserveIncentives,
  userReserveIncentives,
  userReserves,
  currentTimestamp,
}: CalculateAllUserIncentivesRequest): UserIncentiveDict {
  // calculate incentive per token
  const rewards = userReserveIncentives
    .map((userReserveIncentive: UserReserveIncentiveDataHumanizedResponse) => {
      const reserve: ReserveIncentiveWithFeedsResponse | undefined =
        reserveIncentives.find(
          (reserve: ReserveIncentiveWithFeedsResponse) =>
            reserve.underlyingAsset === userReserveIncentive.underlyingAsset,
        );
      const userReserve: UserReserveCalculationData | undefined =
        userReserves.find(
          (reserve: UserReserveCalculationData) =>
            reserve.underlyingAsset === userReserveIncentive.underlyingAsset,
        );
      if (reserve) {
        let rewards: CalculateUserReserveIncentivesResponse = {
          lIncentives: valueToZDBigNumber('0'),
          vdIncentives: valueToZDBigNumber('0'),
          sdIncentives: valueToZDBigNumber('0'),
        };
        if (userReserve) {
          rewards = calculateUserReserveIncentives({
            reserveIncentives: reserve,
            userReserveIncentives: userReserveIncentive,
            userReserveData: userReserve,
            currentTimestamp,
          });
        }

        return [
          {
            tokenAddress:
              userReserveIncentive.lTokenIncentivesUserData.tokenAddress,
            incentiveController:
              userReserveIncentive.lTokenIncentivesUserData
                .incentiveControllerAddress,
            rewardTokenAddress:
              userReserveIncentive.lTokenIncentivesUserData.rewardTokenAddress,
            rewardTokenDecimals:
              userReserveIncentive.lTokenIncentivesUserData.rewardTokenDecimals,
            accruedRewards: new BigNumber(rewards.lIncentives),
            unclaimedRewards: new BigNumber(
              userReserveIncentive.lTokenIncentivesUserData.userUnclaimedRewards,
            ),
          },
          {
            tokenAddress:
              userReserveIncentive.vdTokenIncentivesUserData.tokenAddress,
            incentiveController:
              userReserveIncentive.vdTokenIncentivesUserData
                .incentiveControllerAddress,
            rewardTokenAddress:
              userReserveIncentive.vdTokenIncentivesUserData.rewardTokenAddress,
            rewardTokenDecimals:
              userReserveIncentive.vdTokenIncentivesUserData
                .rewardTokenDecimals,
            accruedRewards: new BigNumber(rewards.vdIncentives),
            unclaimedRewards: new BigNumber(
              userReserveIncentive.vdTokenIncentivesUserData.userUnclaimedRewards,
            ),
          },
          {
            tokenAddress:
              userReserveIncentive.sdTokenIncentivesUserData.tokenAddress,
            incentiveController:
              userReserveIncentive.sdTokenIncentivesUserData
                .incentiveControllerAddress,
            rewardTokenAddress:
              userReserveIncentive.sdTokenIncentivesUserData.rewardTokenAddress,
            rewardTokenDecimals:
              userReserveIncentive.sdTokenIncentivesUserData
                .rewardTokenDecimals,
            accruedRewards: new BigNumber(rewards.sdIncentives),
            unclaimedRewards: new BigNumber(
              userReserveIncentive.sdTokenIncentivesUserData.userUnclaimedRewards,
            ),
          },
        ];
      }

      return [];
    })
    .flat();

  // normalize incentives per controller
  return rewards.reduce<UserIncentiveDict>(
    (acc: UserIncentiveDict, reward: RewardCalculation) => {
      if (!acc[reward.incentiveController]) {
        acc[reward.incentiveController] = {
          assets: [],
          claimableRewards: reward.unclaimedRewards,
          rewardTokenAddress: reward.rewardTokenAddress,
          rewardTokenDecimals: reward.rewardTokenDecimals,
        };
      }

      if (reward.accruedRewards.gt(0)) {
        acc[reward.incentiveController].claimableRewards = acc[
          reward.incentiveController
        ].claimableRewards.plus(reward.accruedRewards);
        acc[reward.incentiveController].assets.push(reward.tokenAddress);
      }

      return acc;
    },
    {},
  );
}
