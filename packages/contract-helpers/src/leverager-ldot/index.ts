import { BigNumber as BigNumberJs } from 'bignumber.js';
import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  ProtocolAction,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import {
  gasLimitRecommendations,
  valueToWei,
  DEFAULT_NULL_VALUE_ON_TX,
} from '../commons/utils';
import { LeveragerValidator } from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isPositiveAmount,
} from '../commons/validators/paramValidators';
import {
  DebtERC20Service,
  IDebtERC20ServiceInterface,
} from '../debtErc20-contract';
import { ERC20Service, IERC20ServiceInterface } from '../erc20-contract';
import { LeveragerLdot as LeveragerContract } from './typechain/LeveragerLdot';
import { LeveragerLdot__factory } from './typechain/LeveragerLdot__factory';
import { LeveragerParamsType, LeveragerStatusAfterTx } from './types';
import { calcDelegateAmount } from './utils';

export interface ILeveragerLdotInterface {
  leverageDot: (
    args: LeveragerParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  getVariableDebtToken: (token: tEthereumAddress) => Promise<string>;
  getStatusAfterTransaction: (
    account: tEthereumAddress,
    token: tEthereumAddress,
    borrowAmount: string,
    repayAmount: string,
  ) => Promise<LeveragerStatusAfterTx>;
  ltv: (token: tEthereumAddress) => Promise<string>;
}

export class LeveragerLdot
  extends BaseService<LeveragerContract>
  implements ILeveragerLdotInterface
{
  readonly erc20Service: IERC20ServiceInterface;

  readonly debtErc20Service: IDebtERC20ServiceInterface;

  readonly leveragerAddress: string;

  constructor(provider: providers.Provider, leveragerAddress: string) {
    super(provider, LeveragerLdot__factory);
    this.leveragerAddress = leveragerAddress;
    // initialize services
    this.erc20Service = new ERC20Service(provider);
    this.debtErc20Service = new DebtERC20Service(provider);
  }

  @LeveragerValidator
  public async leverageDot(
    @isEthAddress('user')
    @isEthAddress('token')
    @isPositiveAmount('borrow_dot_amount')
    @isPositiveAmount('repay_dot_amount')
    { user, token, borrow_dot_amount, repay_dot_amount }: LeveragerParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const { isApproved, approve, decimalsOf }: IERC20ServiceInterface =
      this.erc20Service;
    const { isDelegated, approveDelegation }: IDebtERC20ServiceInterface =
      this.debtErc20Service;
    const txs: EthereumTransactionTypeExtended[] = [];
    const decimals: number = await decimalsOf(token);
    const convertedBorrowAmount: string = valueToWei(
      borrow_dot_amount,
      decimals,
    );
    const convertedRepayAmount: string = valueToWei(repay_dot_amount, decimals);
    const approveableBorrowDotAmount: string = calcDelegateAmount(
      new BigNumberJs(convertedRepayAmount),
    ).toString();
    const approved = await isApproved({
      token,
      user,
      spender: this.leveragerAddress,
      amount: convertedRepayAmount,
    });

    const leveragerContract = this.getContractInstance(this.leveragerAddress);
    const variableDebtTokenAddress = await this.getVariableDebtToken(token);

    const delegated = await isDelegated({
      token: variableDebtTokenAddress,
      user,
      delegatee: this.leveragerAddress,
      amount: approveableBorrowDotAmount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended = approve({
        user,
        token,
        spender: this.leveragerAddress,
        amount: convertedRepayAmount,
      });
      txs.push(approveTx);
    }

    if (!delegated) {
      const delegateTx: EthereumTransactionTypeExtended = approveDelegation({
        user,
        token: variableDebtTokenAddress,
        delegatee: this.leveragerAddress,
        amount: approveableBorrowDotAmount,
      });
      txs.push(delegateTx);
    }

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        leveragerContract.populateTransaction.leverageDot(
          convertedBorrowAmount,
          convertedRepayAmount,
        ),
      action: ProtocolAction.leverageDot,
      from: user,
      value: DEFAULT_NULL_VALUE_ON_TX,
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

  public async getVariableDebtToken(
    @isEthAddress('token') token: tEthereumAddress,
  ): Promise<string> {
    const leveragerContract = this.getContractInstance(this.leveragerAddress);
    const reservesData = await leveragerContract.getReserveData(token);
    return reservesData.variableDebtTokenAddress;
  }

  public async getStatusAfterTransaction(
    @isEthAddress('account')
    @isEthAddress('token')
    @isPositiveAmount('borrowAmount')
    @isPositiveAmount('repayAmount')
    account: tEthereumAddress,
    token: tEthereumAddress,
    borrowAmount: string,
    repayAmount: string,
  ): Promise<LeveragerStatusAfterTx> {
    const { decimalsOf }: IERC20ServiceInterface = this.erc20Service;
    const decimals: number = await decimalsOf(token);
    const convertedBorrowAmount: string = valueToWei(borrowAmount, decimals);
    const convertedRepayAmount: string = valueToWei(repayAmount, decimals);
    const leveragerContract = this.getContractInstance(this.leveragerAddress);
    const statusAfterTransaction =
      await leveragerContract.getStatusAfterTransaction(
        account,
        convertedBorrowAmount,
        convertedRepayAmount,
      );
    return {
      totalCollateralAfterTx:
        statusAfterTransaction.totalCollateralAfterTx.toString(),
      totalDebtAfterTx: statusAfterTransaction.totalDebtAfterTx.toString(),
      healthFactorAfterTx:
        statusAfterTransaction.healthFactorAfterTx.toString(),
    };
  }

  public async ltv(
    @isEthAddress('token') token: tEthereumAddress,
  ): Promise<string> {
    const leveragerContract = this.getContractInstance(this.leveragerAddress);
    const ltv = await leveragerContract.ltv(token);
    return ltv.toString();
  }
}
