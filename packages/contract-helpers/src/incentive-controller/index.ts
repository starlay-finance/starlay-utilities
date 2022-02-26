import { constants, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  transactionType,
} from '../commons/types';
import { IncentivesValidator } from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isEthAddressArray,
} from '../commons/validators/paramValidators';
import { IIncentivesController } from './typechain/IIncentivesController';
import { IIncentivesController__factory } from './typechain/IIncentivesController__factory';

export type ClaimRewardsMethodType = {
  user: string;
  assets: string[];
  to?: string;
  incentivesControllerAddress: string;
};
export type GetUserUnclaimedRewardsMethodType = {
  user: string;
  incentivesControllerAddress: string;
};

export interface IncentivesControllerInterface {
  claimRewards: (
    args: ClaimRewardsMethodType,
  ) => EthereumTransactionTypeExtended[];
  getUserUnclaimedRewards: (
    args: GetUserUnclaimedRewardsMethodType,
  ) => EthereumTransactionTypeExtended[];
}

export class IncentivesController
  extends BaseService<IIncentivesController>
  implements IncentivesControllerInterface
{
  constructor(provider: providers.Provider) {
    super(provider, IIncentivesController__factory);
  }

  @IncentivesValidator
  public claimRewards(
    @isEthAddress('user')
    @isEthAddress('incentivesControllerAddress')
    @isEthAddress('to')
    @isEthAddressArray('assets')
    { user, assets, to, incentivesControllerAddress }: ClaimRewardsMethodType,
  ): EthereumTransactionTypeExtended[] {
    const incentivesContract: IIncentivesController = this.getContractInstance(
      incentivesControllerAddress,
    );
    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        incentivesContract.populateTransaction.claimRewards(
          assets,
          constants.MaxUint256.toString(),
          to ?? user,
        ),
      from: user,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.REWARD_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }

  @IncentivesValidator
  public getUserUnclaimedRewards(
    @isEthAddress('user')
    { user, incentivesControllerAddress }: GetUserUnclaimedRewardsMethodType,
  ): EthereumTransactionTypeExtended[] {
    const incentivesContract: IIncentivesController = this.getContractInstance(
      incentivesControllerAddress,
    );
    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        incentivesContract.populateTransaction.getUserUnclaimedRewards(user),
      from: user,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.REWARD_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }
}
