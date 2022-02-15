import { BigNumber } from 'ethers';

export interface StakeGeneralDataT<SimpleNumber, BN> {
  stakeTokenTotalSupply: BN;
  stakeCooldownSeconds: SimpleNumber;
  stakeUnstakeWindow: SimpleNumber;
  stakeTokenPriceEth: BN;
  rewardTokenPriceEth: BN;
  stakeApy: BN;
  distributionPerSecond: BN;
  distributionEnd: BN;
}

export interface StakeUserDataT<SimpleNumber, BN> {
  stakeTokenUserBalance: BN;
  underlyingTokenUserBalance: BN;
  userCooldown: SimpleNumber;
  userIncentivesToClaim: BN;
  userPermitNonce: BN;
}

export type StakeGeneralData = StakeGeneralDataT<BigNumber, BigNumber>;
export type StakeUserData = StakeUserDataT<BigNumber, BigNumber>;
export type StakeData = StakeGeneralData & StakeUserData;

export type StakeGeneralDataHumanized = StakeGeneralDataT<number, string>;
export type StakeUserDataHumanized = StakeUserDataT<number, string>;
export type StakeDataHumanized = StakeGeneralDataHumanized &
  StakeUserDataHumanized;
