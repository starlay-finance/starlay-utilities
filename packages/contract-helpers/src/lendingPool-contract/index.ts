import { constants, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  InterestRate,
  ProtocolAction,
  transactionType,
  LendingPoolMarketConfig,
} from '../commons/types';
import {
  getTxValue,
  valueToWei,
  API_ETH_MOCK_ADDRESS,
  DEFAULT_APPROVE_AMOUNT,
} from '../commons/utils';
import { LPValidator } from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isPositiveAmount,
  isPositiveOrMinusOneAmount,
} from '../commons/validators/paramValidators';
import { ERC20Service, IERC20ServiceInterface } from '../erc20-contract';

import { SynthetixInterface, SynthetixService } from '../synthetix-contract';
import {
  WETHGatewayInterface,
  WETHGatewayService,
} from '../wethgateway-contract';
import {
  LPBorrowParamsType,
  LPDepositParamsType,
  LPLiquidationCall,
  LPRepayParamsType,
  LPSetUsageAsCollateral,
  LPSwapBorrowRateMode,
  LPWithdrawParamsType,
} from './lendingPoolTypes';
import { ILendingPool } from './typechain/ILendingPool';
import { ILendingPool__factory } from './typechain/ILendingPool__factory';

export interface LendingPoolInterface {
  deposit: (
    args: LPDepositParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  withdraw: (
    args: LPWithdrawParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  borrow: (
    args: LPBorrowParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  repay: (
    args: LPRepayParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  swapBorrowRateMode: (
    args: LPSwapBorrowRateMode,
  ) => EthereumTransactionTypeExtended[];
  setUsageAsCollateral: (
    args: LPSetUsageAsCollateral,
  ) => EthereumTransactionTypeExtended[];
  liquidationCall: (
    args: LPLiquidationCall,
  ) => Promise<EthereumTransactionTypeExtended[]>;
}

export class LendingPool
  extends BaseService<ILendingPool>
  implements LendingPoolInterface
{
  readonly erc20Service: IERC20ServiceInterface;

  readonly lendingPoolAddress: string;

  readonly synthetixService: SynthetixInterface;

  readonly wethGatewayService: WETHGatewayInterface;

  constructor(
    provider: providers.Provider,
    lendingPoolConfig?: LendingPoolMarketConfig,
  ) {
    super(provider, ILendingPool__factory);

    const { LENDING_POOL, WETH_GATEWAY } = lendingPoolConfig ?? {};

    this.lendingPoolAddress = LENDING_POOL ?? '';

    // initialize services
    this.erc20Service = new ERC20Service(provider);
    this.synthetixService = new SynthetixService(provider);
    this.wethGatewayService = new WETHGatewayService(
      provider,
      this.erc20Service,
      WETH_GATEWAY,
    );
  }

  @LPValidator
  public async deposit(
    @isEthAddress('user')
    @isEthAddress('reserve')
    @isPositiveAmount('amount')
    @isEthAddress('onBehalfOf')
    { user, reserve, amount, onBehalfOf, referralCode }: LPDepositParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
      return this.wethGatewayService.depositETH({
        lendingPool: this.lendingPoolAddress,
        user,
        amount,
        onBehalfOf,
        referralCode,
      });
    }

    const { isApproved, approve, decimalsOf }: IERC20ServiceInterface =
      this.erc20Service;
    const txs: EthereumTransactionTypeExtended[] = [];
    const reserveDecimals: number = await decimalsOf(reserve);
    const convertedAmount: string = valueToWei(amount, reserveDecimals);

    const fundsAvailable: boolean =
      await this.synthetixService.synthetixValidation({
        user,
        reserve,
        amount: convertedAmount,
      });
    if (!fundsAvailable) {
      throw new Error('Not enough funds to execute operation');
    }

    const approved = await isApproved({
      token: reserve,
      user,
      spender: this.lendingPoolAddress,
      amount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended = approve({
        user,
        token: reserve,
        spender: this.lendingPoolAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });
      txs.push(approveTx);
    }

    const lendingPoolContract: ILendingPool = this.getContractInstance(
      this.lendingPoolAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        lendingPoolContract.populateTransaction.deposit(
          reserve,
          convertedAmount,
          onBehalfOf ?? user,
          referralCode ?? '0',
        ),
      from: user,
      value: getTxValue(reserve, convertedAmount),
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: this.generateTxPriceEstimation(
        txs,
        txCallback,
        ProtocolAction.deposit,
      ),
    });

    return txs;
  }

  @LPValidator
  public async withdraw(
    @isEthAddress('user')
    @isEthAddress('reserve')
    @isPositiveOrMinusOneAmount('amount')
    @isEthAddress('onBehalfOf')
    @isEthAddress('aTokenAddress')
    { user, reserve, amount, onBehalfOf, aTokenAddress }: LPWithdrawParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
      if (!aTokenAddress) {
        throw new Error(
          'To withdraw ETH you need to pass the aWETH token address',
        );
      }

      return this.wethGatewayService.withdrawETH({
        lendingPool: this.lendingPoolAddress,
        user,
        amount,
        onBehalfOf,
        aTokenAddress,
      });
    }

    const { decimalsOf }: IERC20ServiceInterface = this.erc20Service;
    const decimals: number = await decimalsOf(reserve);

    const convertedAmount: string =
      amount === '-1'
        ? constants.MaxUint256.toString()
        : valueToWei(amount, decimals);

    const lendingPoolContract: ILendingPool = this.getContractInstance(
      this.lendingPoolAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        lendingPoolContract.populateTransaction.withdraw(
          reserve,
          convertedAmount,
          onBehalfOf ?? user,
        ),
      from: user,
      action: ProtocolAction.withdraw,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.DLP_ACTION,
        gas: this.generateTxPriceEstimation(
          [],
          txCallback,
          ProtocolAction.withdraw,
        ),
      },
    ];
  }

  @LPValidator
  public async borrow(
    @isEthAddress('user')
    @isEthAddress('reserve')
    @isPositiveAmount('amount')
    @isEthAddress('debtTokenAddress')
    @isEthAddress('onBehalfOf')
    {
      user,
      reserve,
      amount,
      interestRateMode,
      debtTokenAddress,
      onBehalfOf,
      referralCode,
    }: LPBorrowParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
      if (!debtTokenAddress) {
        throw new Error(
          `To borrow ETH you need to pass the stable or variable WETH debt Token Address corresponding the interestRateMode`,
        );
      }

      return this.wethGatewayService.borrowETH({
        lendingPool: this.lendingPoolAddress,
        user,
        amount,
        debtTokenAddress,
        interestRateMode,
        referralCode,
      });
    }

    const { decimalsOf }: IERC20ServiceInterface = this.erc20Service;
    const reserveDecimals = await decimalsOf(reserve);
    const formatAmount: string = valueToWei(amount, reserveDecimals);

    const numericRateMode = interestRateMode === InterestRate.Variable ? 2 : 1;

    const lendingPoolContract = this.getContractInstance(
      this.lendingPoolAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        lendingPoolContract.populateTransaction.borrow(
          reserve,
          formatAmount,
          numericRateMode,
          referralCode ?? 0,
          onBehalfOf ?? user,
        ),
      from: user,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.DLP_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }

  @LPValidator
  public async repay(
    @isEthAddress('user')
    @isEthAddress('reserve')
    @isPositiveOrMinusOneAmount('amount')
    @isEthAddress('onBehalfOf')
    { user, reserve, amount, interestRateMode, onBehalfOf }: LPRepayParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
      return this.wethGatewayService.repayETH({
        lendingPool: this.lendingPoolAddress,
        user,
        amount,
        interestRateMode,
        onBehalfOf,
      });
    }

    const txs: EthereumTransactionTypeExtended[] = [];
    const { isApproved, approve, decimalsOf }: IERC20ServiceInterface =
      this.erc20Service;

    const lendingPoolContract = this.getContractInstance(
      this.lendingPoolAddress,
    );
    const { populateTransaction }: ILendingPool = lendingPoolContract;
    const numericRateMode = interestRateMode === InterestRate.Variable ? 2 : 1;
    const decimals: number = await decimalsOf(reserve);

    const convertedAmount: string =
      amount === '-1'
        ? constants.MaxUint256.toString()
        : valueToWei(amount, decimals);

    if (amount !== '-1') {
      const fundsAvailable: boolean =
        await this.synthetixService.synthetixValidation({
          user,
          reserve,
          amount: convertedAmount,
        });
      if (!fundsAvailable) {
        throw new Error('Not enough funds to execute operation');
      }
    }

    const approved: boolean = await isApproved({
      token: reserve,
      user,
      spender: this.lendingPoolAddress,
      amount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended = approve({
        user,
        token: reserve,
        spender: this.lendingPoolAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });
      txs.push(approveTx);
    }

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        populateTransaction.repay(
          reserve,
          convertedAmount,
          numericRateMode,
          onBehalfOf ?? user,
        ),
      from: user,
      value: getTxValue(reserve, convertedAmount),
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: this.generateTxPriceEstimation(
        txs,
        txCallback,
        ProtocolAction.repay,
      ),
    });

    return txs;
  }

  @LPValidator
  public swapBorrowRateMode(
    @isEthAddress('user')
    @isEthAddress('reserve')
    { user, reserve, interestRateMode }: LPSwapBorrowRateMode,
  ): EthereumTransactionTypeExtended[] {
    const numericRateMode = interestRateMode === InterestRate.Variable ? 2 : 1;

    const lendingPoolContract = this.getContractInstance(
      this.lendingPoolAddress,
    );
    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        lendingPoolContract.populateTransaction.swapBorrowRateMode(
          reserve,
          numericRateMode,
        ),
      from: user,
    });

    return [
      {
        txType: eEthereumTxType.DLP_ACTION,
        tx: txCallback,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }

  @LPValidator
  public setUsageAsCollateral(
    @isEthAddress('user')
    @isEthAddress('reserve')
    { user, reserve, usageAsCollateral }: LPSetUsageAsCollateral,
  ): EthereumTransactionTypeExtended[] {
    const lendingPoolContract = this.getContractInstance(
      this.lendingPoolAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        lendingPoolContract.populateTransaction.setUserUseReserveAsCollateral(
          reserve,
          usageAsCollateral,
        ),
      from: user,
    });

    return [
      {
        tx: txCallback,
        txType: eEthereumTxType.DLP_ACTION,
        gas: this.generateTxPriceEstimation([], txCallback),
      },
    ];
  }

  @LPValidator
  public async liquidationCall(
    @isEthAddress('liquidator')
    @isEthAddress('liquidatedUser')
    @isEthAddress('debtReserve')
    @isEthAddress('collateralReserve')
    @isPositiveAmount('purchaseAmount')
    {
      liquidator,
      liquidatedUser,
      debtReserve,
      collateralReserve,
      purchaseAmount,
      getAToken,
      liquidateAll,
    }: LPLiquidationCall,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];
    const { isApproved, approve, decimalsOf }: IERC20ServiceInterface =
      this.erc20Service;

    const approved = await isApproved({
      token: debtReserve,
      user: liquidator,
      spender: this.lendingPoolAddress,
      amount: purchaseAmount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended = approve({
        user: liquidator,
        token: debtReserve,
        spender: this.lendingPoolAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });

      txs.push(approveTx);
    }

    let convertedAmount = constants.MaxUint256.toString();
    if (!liquidateAll) {
      const reserveDecimals = await decimalsOf(debtReserve);
      convertedAmount = valueToWei(purchaseAmount, reserveDecimals);
    }

    const lendingPoolContract = this.getContractInstance(
      this.lendingPoolAddress,
    );

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        lendingPoolContract.populateTransaction.liquidationCall(
          collateralReserve,
          debtReserve,
          liquidatedUser,
          convertedAmount,
          getAToken ?? false,
        ),
      from: liquidator,
      value: getTxValue(debtReserve, convertedAmount),
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: this.generateTxPriceEstimation(
        txs,
        txCallback,
        ProtocolAction.liquidationCall,
      ),
    });

    return txs;
  }
}
