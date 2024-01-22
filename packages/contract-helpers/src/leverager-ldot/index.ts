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
  DEFAULT_APPROVE_AMOUNT,
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
import { WalletBalanceProvider } from '../wallet-balance-provider';
import { LeveragerLdot as LeveragerContract } from './typechain/LeveragerLdot';
import { LeveragerLdot__factory } from './typechain/LeveragerLdot__factory';
import {
  CloseLeverageDOTParamsType,
  LeverageDOTFromPositionParamsType,
  LeverageDOTParamsType,
  LeveragerStatusAfterTx,
} from './types';
import { calcDelegateAmount } from './utils';

export interface ILeveragerLdotInterface {
  leverageDot: (
    args: LeverageDOTParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  leverageDotFromPosition: (
    args: LeverageDOTFromPositionParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  getVariableDebtToken: (token: tEthereumAddress) => Promise<string>;
  getLToken: (token: tEthereumAddress) => Promise<string>;
  getStatusAfterLeverageDotTransaction: (
    args: LeverageDOTParamsType,
  ) => Promise<LeveragerStatusAfterTx>;
  getStatusAfterLeverageDotFromPositionTransaction: (
    args: LeverageDOTFromPositionParamsType,
  ) => Promise<LeveragerStatusAfterTx>;
  ltv: (token: tEthereumAddress) => Promise<string>;
  getExchangeRateLDOT2DOT: () => Promise<string>;
  getExchangeRateDOT2LDOT: () => Promise<string>;
  closeLeverageDOT: (
    args: CloseLeverageDOTParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
}

export class LeveragerLdot
  extends BaseService<LeveragerContract>
  implements ILeveragerLdotInterface
{
  readonly erc20Service: IERC20ServiceInterface;

  readonly debtErc20Service: IDebtERC20ServiceInterface;

  readonly walletBalanceProvider: WalletBalanceProvider;

  readonly leveragerAddress: string;

  constructor(
    provider: providers.Provider,
    leveragerAddress: string,
    walletBalanceProviderAddress: string,
  ) {
    super(provider, LeveragerLdot__factory);
    this.leveragerAddress = leveragerAddress;
    this.walletBalanceProvider = new WalletBalanceProvider({
      provider,
      walletBalanceProviderAddress,
    });
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
    { user, token, borrow_dot_amount, repay_dot_amount }: LeverageDOTParamsType,
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
        amount: DEFAULT_APPROVE_AMOUNT,
      });
      txs.push(approveTx);
    }

    if (!delegated) {
      const delegateTx: EthereumTransactionTypeExtended = approveDelegation({
        user,
        token: variableDebtTokenAddress,
        delegatee: this.leveragerAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
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

  @LeveragerValidator
  public async leverageDotFromPosition(
    @isEthAddress('user')
    @isEthAddress('token')
    @isPositiveAmount('borrow_dot_amount')
    @isPositiveAmount('supply_dot_amount')
    {
      user,
      token,
      borrow_dot_amount,
      supply_dot_amount,
    }: LeverageDOTFromPositionParamsType,
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
    const convertedSupplyAmount: string = valueToWei(
      supply_dot_amount,
      decimals,
    );
    const approveableBorrowDotAmount: string = calcDelegateAmount(
      new BigNumberJs(convertedSupplyAmount),
    ).toString();

    const leveragerContract = this.getContractInstance(this.leveragerAddress);
    const lTokenAddress = await this.getLToken(token);

    const approved = await isApproved({
      token: lTokenAddress,
      user,
      spender: this.leveragerAddress,
      amount: convertedSupplyAmount,
    });

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
        token: lTokenAddress,
        spender: this.leveragerAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });
      txs.push(approveTx);
    }

    if (!delegated) {
      const delegateTx: EthereumTransactionTypeExtended = approveDelegation({
        user,
        token: variableDebtTokenAddress,
        delegatee: this.leveragerAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });
      txs.push(delegateTx);
    }

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        leveragerContract.populateTransaction.leverageDot(
          convertedBorrowAmount,
          convertedSupplyAmount,
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

  @LeveragerValidator
  public async closeLeverageDOT(
    @isEthAddress('dotAddress')
    @isEthAddress('ldotAddress')
    @isEthAddress('user')
    { user, dotAddress, ldotAddress }: CloseLeverageDOTParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const leveragerContract = this.getContractInstance(this.leveragerAddress);
    const { isApproved, approve }: IERC20ServiceInterface = this.erc20Service;

    const variableDebtTokenAddress = await this.getVariableDebtToken(
      dotAddress,
    );
    const lTokenLDOTAddress = await this.getLToken(ldotAddress);

    const debtDOTAmount = await this.walletBalanceProvider.balanceOf(
      user,
      variableDebtTokenAddress,
    );

    const approvedDOT = await isApproved({
      token: dotAddress,
      user,
      spender: this.leveragerAddress,
      amount: debtDOTAmount.toString(),
    });

    if (!approvedDOT) {
      const approveTx: EthereumTransactionTypeExtended = approve({
        user,
        token: dotAddress,
        spender: this.leveragerAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });
      txs.push(approveTx);
    }

    const lTokenBalance = await this.walletBalanceProvider.balanceOf(
      user,
      lTokenLDOTAddress,
    );

    const approvedLToken = await isApproved({
      token: lTokenLDOTAddress,
      user,
      spender: this.leveragerAddress,
      amount: lTokenBalance.toString(),
    });

    if (!approvedLToken) {
      const approveTx: EthereumTransactionTypeExtended = approve({
        user,
        token: lTokenLDOTAddress,
        spender: this.leveragerAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });
      txs.push(approveTx);
    }

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        leveragerContract.populateTransaction.closeLeverageDOT(),
      action: ProtocolAction.closeLeverageDot,
      from: user,
      value: DEFAULT_NULL_VALUE_ON_TX,
      skipEstimation: true,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: async () => ({
        gasLimit:
          gasLimitRecommendations[ProtocolAction.closeLeverageDot].recommended,
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

  public async getLToken(
    @isEthAddress('token') token: string,
  ): Promise<string> {
    const leveragerContract = this.getContractInstance(this.leveragerAddress);
    const reservesData = await leveragerContract.getReserveData(token);
    return reservesData.lTokenAddress;
  }

  public async getStatusAfterLeverageDotTransaction(
    @isEthAddress('user')
    @isEthAddress('token')
    @isPositiveAmount('borrowAmount')
    @isPositiveAmount('repayAmount')
    {
      user,
      token,
      borrow_dot_amount: borrowAmount,
      repay_dot_amount: repayAmount,
    }: LeverageDOTParamsType,
  ): Promise<LeveragerStatusAfterTx> {
    const { decimalsOf }: IERC20ServiceInterface = this.erc20Service;
    const decimals: number = await decimalsOf(token);
    const convertedBorrowAmount: string = valueToWei(borrowAmount, decimals);
    const convertedRepayAmount: string = valueToWei(repayAmount, decimals);
    const leveragerContract = this.getContractInstance(this.leveragerAddress);
    const statusAfterTransaction =
      await leveragerContract.getStatusAfterLeverageDotTransaction(
        user,
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

  public async getStatusAfterLeverageDotFromPositionTransaction(
    @isEthAddress('user')
    @isEthAddress('token')
    @isPositiveAmount('borrowAmount')
    @isPositiveAmount('supplyAmount')
    {
      user,
      token,
      borrow_dot_amount: borrowAmount,
      supply_dot_amount: supplyAmount,
    }: LeverageDOTFromPositionParamsType,
  ): Promise<LeveragerStatusAfterTx> {
    const { decimalsOf }: IERC20ServiceInterface = this.erc20Service;
    const decimals: number = await decimalsOf(token);
    const convertedBorrowAmount: string = valueToWei(borrowAmount, decimals);
    const convertedSupplyAmount: string = valueToWei(supplyAmount, decimals);
    const leveragerContract = this.getContractInstance(this.leveragerAddress);
    const statusAfterTransaction =
      await leveragerContract.getStatusAfterLeverageDotFromPositionTransaction(
        user,
        convertedBorrowAmount,
        convertedSupplyAmount,
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

  public async getExchangeRateLDOT2DOT(): Promise<string> {
    const leveragerContract = this.getContractInstance(this.leveragerAddress);
    const ltv = await leveragerContract.getExchangeRateLDOT2DOT();
    return ltv.toString();
  }

  public async getExchangeRateDOT2LDOT(): Promise<string> {
    const leveragerContract = this.getContractInstance(this.leveragerAddress);
    const ltv = await leveragerContract.getExchangeRateDOT2LDOT();
    return ltv.toString();
  }
}
