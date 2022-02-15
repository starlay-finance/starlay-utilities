import { BigNumber } from 'ethers';
import { StakeData } from './types/stake';

export const mockStakeData: StakeData = {
  stakeTokenTotalSupply: BigNumber.from('0x00'),
  stakeCooldownSeconds: BigNumber.from('0x00'),
  stakeUnstakeWindow: BigNumber.from('0x00'),
  stakeTokenPriceEth: BigNumber.from('0x00'),
  rewardTokenPriceEth: BigNumber.from('0x00'),
  stakeApy: BigNumber.from('0x00'),
  distributionPerSecond: BigNumber.from('0x00'),
  distributionEnd: BigNumber.from('0x00'),
  stakeTokenUserBalance: BigNumber.from('0x00'),
  underlyingTokenUserBalance: BigNumber.from('0x00'),
  userCooldown: BigNumber.from('0x00'),
  userIncentivesToClaim: BigNumber.from('0x00'),
  userPermitNonce: BigNumber.from('0x00'),
};
