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
  CloseLeverageDotParamsType,
  LeverageDotFromPositionParamsType,
  LeverageDotParamsType,
  LeverageLdotFromPositionParamsType,
  LeverageLdotParamsType,
  LeveragerStatusAfterTx,
} from './types';
import { calcDelegateAmount } from './utils';

export interface ILeveragerLdotInterface {
  leverageDot: (
    args: LeverageDotParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  leverageDotFromPosition: (
    args: LeverageDotFromPositionParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  leverageLdot: (
    args: LeverageLdotParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  leverageLdotFromPosition: (
    args: LeverageLdotFromPositionParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  getVariableDebtToken: (token: tEthereumAddress) => Promise<string>;
  getLToken: (token: tEthereumAddress) => Promise<string>;
  getStatusAfterLeverageDotTransaction: (
    args: LeverageDotParamsType,
  ) => Promise<LeveragerStatusAfterTx>;
  getStatusAfterLeverageDotFromPositionTransaction: (
    args: LeverageDotFromPositionParamsType,
  ) => Promise<LeveragerStatusAfterTx>;
  getStatusAfterLeverageLdotTransaction: (
    args: LeverageLdotParamsType,
  ) => Promise<LeveragerStatusAfterTx>;
  getStatusAfterLeverageLdotFromPositionTransaction: (
    args: LeverageLdotFromPositionParamsType,
  ) => Promise<LeveragerStatusAfterTx>;
  ltv: (token: tEthereumAddress) => Promise<string>;
  lt: (token: tEthereumAddress) => Promise<string>;
  getExchangeRateLDOT2DOT: () => Promise<string>;
  getExchangeRateDOT2LDOT: () => Promise<string>;
  closeLeverageDOT: (
    args: CloseLeverageDotParamsType,
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
    @isEthAddress('dotAddress')
    @isPositiveAmount('leverage')
    @isPositiveAmount('repayAmountInDot')
    { user, dotAddress, leverage, repayAmountInDot }: LeverageDotParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const { isApproved, approve, decimalsOf }: IERC20ServiceInterface =
      this.erc20Service;
    const { isDelegated, approveDelegation }: IDebtERC20ServiceInterface =
      this.debtErc20Service;
    const txs: EthereumTransactionTypeExtended[] = [];
    const decimals: number = await decimalsOf(dotAddress);
    const borrowAmountInDot = (
      Number(repayAmountInDot) * Number(leverage)
    ).toString();
    const convertedBorrowAmount: string = valueToWei(
      borrowAmountInDot,
      decimals,
    );
    const convertedRepayAmount: string = valueToWei(
      repayAmountInDot.toString(),
      decimals,
    );
    const approveableBorrowDotAmount: string = calcDelegateAmount(
      new BigNumberJs(convertedRepayAmount),
    ).toString();
    const approved = await isApproved({
      token: dotAddress,
      user,
      spender: this.leveragerAddress,
      amount: convertedRepayAmount,
    });

    const leveragerContract = this.getContractInstance(this.leveragerAddress);
    const variableDebtTokenAddress = await this.getVariableDebtToken(
      dotAddress,
    );

    const delegated = await isDelegated({
      token: variableDebtTokenAddress,
      user,
      delegatee: this.leveragerAddress,
      amount: approveableBorrowDotAmount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended = approve({
        user,
        token: dotAddress,
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
    @isEthAddress('dotAddress')
    @isPositiveAmount('leverage')
    @isPositiveAmount('supplyAmountInDot')
    {
      user,
      dotAddress,
      leverage,
      supplyAmountInDot,
    }: LeverageDotFromPositionParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const { isApproved, approve, decimalsOf }: IERC20ServiceInterface =
      this.erc20Service;
    const { isDelegated, approveDelegation }: IDebtERC20ServiceInterface =
      this.debtErc20Service;
    const txs: EthereumTransactionTypeExtended[] = [];
    const decimals: number = await decimalsOf(dotAddress);
    const borrowAmountInDot = (
      Number(supplyAmountInDot) * Number(leverage)
    ).toString();
    const convertedBorrowAmount: string = valueToWei(
      borrowAmountInDot,
      decimals,
    );
    const convertedSupplyAmount: string = valueToWei(
      supplyAmountInDot.toString(),
      decimals,
    );
    const approveableBorrowDotAmount: string = calcDelegateAmount(
      new BigNumberJs(convertedSupplyAmount),
    ).toString();

    const leveragerContract = this.getContractInstance(this.leveragerAddress);
    const lTokenAddress = await this.getLToken(dotAddress);

    const approved = await isApproved({
      token: lTokenAddress,
      user,
      spender: this.leveragerAddress,
      amount: convertedSupplyAmount,
    });

    const variableDebtTokenAddress = await this.getVariableDebtToken(
      dotAddress,
    );

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
        leveragerContract.populateTransaction.leverageDotFromPosition(
          convertedBorrowAmount,
          convertedSupplyAmount,
        ),
      action: ProtocolAction.leverageDotFromPosition,
      from: user,
      value: DEFAULT_NULL_VALUE_ON_TX,
      skipEstimation: true,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: async () => ({
        gasLimit:
          gasLimitRecommendations[ProtocolAction.leverageDotFromPosition]
            .recommended,
        gasPrice: (await this.provider.getGasPrice()).toString(),
      }),
    });

    return txs;
  }

  @LeveragerValidator
  public async leverageLdot(
    @isEthAddress('user')
    @isEthAddress('dotAddress')
    @isEthAddress('ldotAddress')
    @isPositiveAmount('leverage')
    @isPositiveAmount('repayAmountInLdot')
    {
      user,
      dotAddress,
      ldotAddress,
      leverage,
      repayAmountInLdot,
    }: LeverageLdotParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const { isApproved, approve, decimalsOf }: IERC20ServiceInterface =
      this.erc20Service;
    const { isDelegated, approveDelegation }: IDebtERC20ServiceInterface =
      this.debtErc20Service;
    const txs: EthereumTransactionTypeExtended[] = [];
    const decimals: number = await decimalsOf(ldotAddress);
    const borrowAmountInLdot = (
      Number(repayAmountInLdot) *
      (Number(leverage) - 1)
    ).toString();
    const convertedBorrowAmount: string = valueToWei(
      borrowAmountInLdot,
      decimals,
    );
    const convertedRepayAmount: string = valueToWei(
      repayAmountInLdot.toString(),
      decimals,
    );
    const approveableBorrowLdotAmount: string = calcDelegateAmount(
      new BigNumberJs(convertedRepayAmount),
    ).toString();

    const leveragerContract = this.getContractInstance(this.leveragerAddress);
    const variableDebtTokenAddress = await this.getVariableDebtToken(
      dotAddress,
    );

    const approved = await isApproved({
      token: ldotAddress,
      user,
      spender: this.leveragerAddress,
      amount: convertedRepayAmount,
    });
    const delegated = await isDelegated({
      token: variableDebtTokenAddress,
      user,
      delegatee: this.leveragerAddress,
      amount: approveableBorrowLdotAmount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended = approve({
        user,
        token: ldotAddress,
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
        leveragerContract.populateTransaction.leverageLdot(
          convertedBorrowAmount,
          convertedRepayAmount,
        ),
      action: ProtocolAction.leverageLdot,
      from: user,
      value: DEFAULT_NULL_VALUE_ON_TX,
      skipEstimation: true,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: async () => ({
        gasLimit:
          gasLimitRecommendations[ProtocolAction.leverageLdot].recommended,
        gasPrice: (await this.provider.getGasPrice()).toString(),
      }),
    });

    return txs;
  }

  @LeveragerValidator
  public async leverageLdotFromPosition(
    @isEthAddress('user')
    @isEthAddress('dotAddress')
    @isEthAddress('ldotAddress')
    @isPositiveAmount('leverage')
    @isPositiveAmount('supplyAmountInLdot')
    {
      user,
      dotAddress,
      ldotAddress,
      leverage,
      supplyAmountInLdot,
    }: LeverageLdotFromPositionParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const { isApproved, approve, decimalsOf }: IERC20ServiceInterface =
      this.erc20Service;
    const { isDelegated, approveDelegation }: IDebtERC20ServiceInterface =
      this.debtErc20Service;
    const txs: EthereumTransactionTypeExtended[] = [];
    const decimals: number = await decimalsOf(ldotAddress);
    const borrowAmountInLdot = (
      Number(supplyAmountInLdot) *
      (Number(leverage) - 1)
    ).toString();
    const convertedBorrowAmount: string = valueToWei(
      borrowAmountInLdot,
      decimals,
    );
    const convertedSupplyAmount: string = valueToWei(
      supplyAmountInLdot.toString(),
      decimals,
    );
    const approveableBorrowLdotAmount: string = calcDelegateAmount(
      new BigNumberJs(convertedSupplyAmount),
    ).toString();

    const leveragerContract = this.getContractInstance(this.leveragerAddress);
    const variableDebtTokenAddress = await this.getVariableDebtToken(
      dotAddress,
    );
    const lTokenAddress = await this.getLToken(ldotAddress);

    const approved = await isApproved({
      token: lTokenAddress,
      user,
      spender: this.leveragerAddress,
      amount: convertedSupplyAmount,
    });
    const delegated = await isDelegated({
      token: variableDebtTokenAddress,
      user,
      delegatee: this.leveragerAddress,
      amount: approveableBorrowLdotAmount,
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
        leveragerContract.populateTransaction.leverageLdotFromPosition(
          convertedBorrowAmount,
          convertedSupplyAmount,
        ),
      action: ProtocolAction.leverageLdotFromPosition,
      from: user,
      value: DEFAULT_NULL_VALUE_ON_TX,
      skipEstimation: true,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: async () => ({
        gasLimit:
          gasLimitRecommendations[ProtocolAction.leverageLdotFromPosition]
            .recommended,
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
    { user, dotAddress, ldotAddress }: CloseLeverageDotParamsType,
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

    if (debtDOTAmount.isZero()) {
      throw Error('INVALID_DEBT_AMOUNT');
    }

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

    if (lTokenBalance.isZero()) {
      throw Error('INVALID_DEPOSIT_AMOUNT');
    }

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
    @isEthAddress('dotAddress')
    @isPositiveAmount('leverage')
    @isPositiveAmount('repayAmountInDot')
    { user, dotAddress, leverage, repayAmountInDot }: LeverageDotParamsType,
  ): Promise<LeveragerStatusAfterTx> {
    const { decimalsOf }: IERC20ServiceInterface = this.erc20Service;
    const decimals: number = await decimalsOf(dotAddress);
    const borrowAmountInDot = (
      Number(repayAmountInDot) * Number(leverage)
    ).toString();
    const convertedBorrowAmount: string = valueToWei(
      borrowAmountInDot,
      decimals,
    );
    const convertedRepayAmount: string = valueToWei(
      repayAmountInDot.toString(),
      decimals,
    );
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
      totalCollateralInDotAfterTx:
        statusAfterTransaction.totalCollateralInDotAfterTx.toString(),
      totalDebtInDotAfterTx:
        statusAfterTransaction.totalDebtInDotAfterTx.toString(),
      healthFactorAfterTx:
        statusAfterTransaction.healthFactorAfterTx.toString(),
    };
  }

  public async getStatusAfterLeverageDotFromPositionTransaction(
    @isEthAddress('user')
    @isEthAddress('dotAddress')
    @isPositiveAmount('leverage')
    @isPositiveAmount('supplyAmountInDot')
    {
      user,
      dotAddress,
      leverage,
      supplyAmountInDot,
    }: LeverageDotFromPositionParamsType,
  ): Promise<LeveragerStatusAfterTx> {
    const { decimalsOf }: IERC20ServiceInterface = this.erc20Service;
    const decimals: number = await decimalsOf(dotAddress);
    const borrowAmountInDot = (
      Number(supplyAmountInDot) * Number(leverage)
    ).toString();
    const convertedBorrowAmount: string = valueToWei(
      borrowAmountInDot,
      decimals,
    );
    const convertedSupplyAmount: string = valueToWei(
      supplyAmountInDot.toString(),
      decimals,
    );
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
      totalCollateralInDotAfterTx:
        statusAfterTransaction.totalCollateralInDotAfterTx.toString(),
      totalDebtInDotAfterTx:
        statusAfterTransaction.totalDebtInDotAfterTx.toString(),
      healthFactorAfterTx:
        statusAfterTransaction.healthFactorAfterTx.toString(),
    };
  }

  public async getStatusAfterLeverageLdotTransaction(
    @isEthAddress('user')
    @isEthAddress('ldotAddress')
    @isPositiveAmount('leverage')
    @isPositiveAmount('repayAmountInLdot')
    { user, ldotAddress, leverage, repayAmountInLdot }: LeverageLdotParamsType,
  ): Promise<LeveragerStatusAfterTx> {
    const { decimalsOf }: IERC20ServiceInterface = this.erc20Service;
    const decimals: number = await decimalsOf(ldotAddress);
    const borrowAmountInLdot = (
      Number(repayAmountInLdot) *
      (Number(leverage) - 1)
    ).toString();
    const convertedBorrowAmount: string = valueToWei(
      borrowAmountInLdot,
      decimals,
    );
    const convertedRepayAmount: string = valueToWei(
      repayAmountInLdot.toString(),
      decimals,
    );
    const leveragerContract = this.getContractInstance(this.leveragerAddress);
    const statusAfterTransaction =
      await leveragerContract.getStatusAfterLeverageLdotTransaction(
        user,
        convertedBorrowAmount,
        convertedRepayAmount,
      );
    return {
      totalCollateralAfterTx:
        statusAfterTransaction.totalCollateralAfterTx.toString(),
      totalDebtAfterTx: statusAfterTransaction.totalDebtAfterTx.toString(),
      totalCollateralInDotAfterTx:
        statusAfterTransaction.totalCollateralInDotAfterTx.toString(),
      totalDebtInDotAfterTx:
        statusAfterTransaction.totalDebtInDotAfterTx.toString(),
      healthFactorAfterTx:
        statusAfterTransaction.healthFactorAfterTx.toString(),
    };
  }

  public async getStatusAfterLeverageLdotFromPositionTransaction(
    @isEthAddress('user')
    @isEthAddress('ldotAddress')
    @isPositiveAmount('leverage')
    @isPositiveAmount('supplyAmountInLdot')
    {
      user,
      ldotAddress,
      leverage,
      supplyAmountInLdot,
    }: LeverageLdotFromPositionParamsType,
  ): Promise<LeveragerStatusAfterTx> {
    const { decimalsOf }: IERC20ServiceInterface = this.erc20Service;
    const decimals: number = await decimalsOf(ldotAddress);
    const borrowAmountInLdot = (
      Number(supplyAmountInLdot) *
      (Number(leverage) - 1)
    ).toString();
    const convertedBorrowAmount: string = valueToWei(
      borrowAmountInLdot,
      decimals,
    );
    const convertedSupplyAmount: string = valueToWei(
      supplyAmountInLdot.toString(),
      decimals,
    );
    const leveragerContract = this.getContractInstance(this.leveragerAddress);
    const statusAfterTransaction =
      await leveragerContract.getStatusAfterLeverageLdotFromPositionTransaction(
        user,
        convertedBorrowAmount,
        convertedSupplyAmount,
      );
    return {
      totalCollateralAfterTx:
        statusAfterTransaction.totalCollateralAfterTx.toString(),
      totalDebtAfterTx: statusAfterTransaction.totalDebtAfterTx.toString(),
      totalCollateralInDotAfterTx:
        statusAfterTransaction.totalCollateralInDotAfterTx.toString(),
      totalDebtInDotAfterTx:
        statusAfterTransaction.totalDebtInDotAfterTx.toString(),
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

  public async lt(
    @isEthAddress('token') token: tEthereumAddress,
  ): Promise<string> {
    const leveragerContract = this.getContractInstance(this.leveragerAddress);
    const lt = await leveragerContract.lt(token);
    return lt.toString();
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
