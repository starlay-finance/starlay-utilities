import { providers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { StakeUiHelper as StakeUiHelperContract } from './typechain/StakeUiHelper';
import { StakeUiHelper__factory } from './typechain/StakeUiHelper__factory';
import { StakeData, StakeDataHumanized } from './types/stake';

function formatRawStakeData(data: StakeData): StakeDataHumanized {
  return {
    stakeTokenTotalSupply: data.stakeTokenTotalSupply.toString(),
    stakeCooldownSeconds: data.stakeCooldownSeconds.toNumber(),
    stakeUnstakeWindow: data.stakeUnstakeWindow.toNumber(),
    stakeTokenPriceEth: data.stakeTokenPriceEth.toString(),
    rewardTokenPriceEth: data.rewardTokenPriceEth.toString(),
    stakeApy: data.stakeApy.toString(),
    distributionPerSecond: data.distributionPerSecond.toString(),
    distributionEnd: data.distributionEnd.toString(),
    stakeTokenUserBalance: data.stakeTokenUserBalance.toString(),
    underlyingTokenUserBalance: data.underlyingTokenUserBalance.toString(),
    userCooldown: data.userCooldown.toNumber(),
    userIncentivesToClaim: data.userIncentivesToClaim.toString(),
    userPermitNonce: data.userPermitNonce.toString(),
  };
}

export interface StakeUiHelperContext {
  stakeUiHelperAddress: string;
  provider: providers.Provider;
}

export interface StakeUiHelperInterface {
  getUserUIData: (user: string) => Promise<StakeData>;
  getUserUIDataHumanized: (user: string) => Promise<StakeDataHumanized>;
}

export class StakeUiHelper implements StakeUiHelperInterface {
  private readonly _contract: StakeUiHelperContract;

  /**
   * Constructor
   * @param context The ui pool data provider context
   */
  public constructor(context: StakeUiHelperContext) {
    if (!isAddress(context.stakeUiHelperAddress)) {
      throw new Error('contract address is not valid');
    }

    this._contract = StakeUiHelper__factory.connect(
      context.stakeUiHelperAddress,
      context.provider,
    );
  }

  public async getUserUIData(user: string) {
    const data = await this._contract.getUserUIData(user);
    return data[0];
  }

  public async getUserUIDataHumanized(user: string) {
    const data = await this.getUserUIData(user);
    return formatRawStakeData(data);
  }
}
