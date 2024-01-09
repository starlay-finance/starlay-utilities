import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  ProtocolAction,
  transactionType,
} from '../commons/types';
import {
  gasLimitRecommendations,
  getTxValue,
  valueToWei,
  DEFAULT_APPROVE_AMOUNT,
} from '../commons/utils';
import { LeveragerValidator } from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isPositiveAmount,
} from '../commons/validators/paramValidators';
import { ERC20Service, IERC20ServiceInterface } from '../erc20-contract';
import { LeveragerLdot as LeveragerContract } from './typechain/LeveragerLdot';
import { LeveragerLdot__factory } from './typechain/LeveragerLdot__factory';
import { LeverageParamsType } from './types';

export interface LeverageInterface {
  leverageDot: (
    args: LeverageParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
}

export class LeveragerLdot
  extends BaseService<LeveragerContract>
  implements LeverageInterface
{
  readonly erc20Service: IERC20ServiceInterface;

  readonly leveragerAddress: string;

  constructor(provider: providers.Provider, leveragerAddress: string) {
    super(provider, LeveragerLdot__factory);
    this.leveragerAddress = leveragerAddress;
    // initialize services
    this.erc20Service = new ERC20Service(provider);
  }

  @LeveragerValidator
  public async leverageDot(
    @isEthAddress('user')
    @isEthAddress('token')
    @isPositiveAmount('borrow_dot_amount')
    @isPositiveAmount('repay_dot_amount')
    { user, token, borrow_dot_amount, repay_dot_amount }: LeverageParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const { isApproved, approve, decimalsOf }: IERC20ServiceInterface =
      this.erc20Service;
    const txs: EthereumTransactionTypeExtended[] = [];
    const decimals: number = await decimalsOf(token);
    const convertedBorrowAmount: string = valueToWei(
      borrow_dot_amount,
      decimals,
    );
    const convertedRepayAmount: string = valueToWei(repay_dot_amount, decimals);

    const approved = await isApproved({
      token,
      user,
      spender: this.leveragerAddress,
      amount: repay_dot_amount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended = approve({
        user,
        token,
        spender: this.leveragerAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });
      txs.push(approveTx);
    }

    const leveragerContract = this.getContractInstance(this.leveragerAddress);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        leveragerContract.populateTransaction.leverageDot(
          convertedBorrowAmount,
          convertedRepayAmount,
        ),
      action: ProtocolAction.leverageDot,
      from: user,
      value: getTxValue(token, convertedRepayAmount),
      skipEstimation: true,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: async () => ({
        gasLimit:
          gasLimitRecommendations[ProtocolAction.leverageDot].recommended,
        gasPrice: (await this.provider.getGasPrice()).toString(),
      }),
    });

    return txs;
  }
}
