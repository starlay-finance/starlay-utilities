import { BigNumber as BigNumberJs } from 'bignumber.js';
import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  ProtocolAction,
  transactionType,
  InterestRate,
} from '../commons/types';
import {
  getTxValue,
  valueToWei,
  API_ETH_MOCK_ADDRESS,
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
import { Leverager as LeveragerContract } from './typechain/Leverager';
import { Leverager__factory } from './typechain/Leverager__factory';
import { LoopParamsType } from './types';
import { calcTotalBorrowingAmount } from './utils';

const BORROW_RATIO_DECIMALS = 4;

export interface LeverageInterface {
  loop: (args: LoopParamsType) => Promise<EthereumTransactionTypeExtended[]>;
}

export class Leverager
  extends BaseService<LeveragerContract>
  implements LeverageInterface
{
  readonly erc20Service: IERC20ServiceInterface;

  readonly debtErc20Service: IDebtERC20ServiceInterface;

  readonly leveragerAddress: string;

  constructor(provider: providers.Provider, leveragerAddress: string) {
    super(provider, Leverager__factory);
    this.leveragerAddress = leveragerAddress;
    // initialize services
    this.erc20Service = new ERC20Service(provider);
    this.debtErc20Service = new DebtERC20Service(provider);
  }

  @LeveragerValidator
  public async loop(
    @isEthAddress('user')
    @isEthAddress('reserve')
    @isEthAddress('debtToken')
    @isPositiveAmount('amount')
    @isEthAddress('onBehalfOf')
    @isPositiveAmount('borrowRatio')
    @isPositiveAmount('loopCount')
    {
      user,
      reserve,
      debtToken,
      amount,
      onBehalfOf,
      interestRateMode,
      borrowRatio,
      loopCount,
    }: LoopParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    if (reserve.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) {
      throw new Error(`Looping native asset has not been supported yet.`);
    }

    const { isApproved, approve, decimalsOf }: IERC20ServiceInterface =
      this.erc20Service;
    const { isDelegated, approveDelegation }: IDebtERC20ServiceInterface =
      this.debtErc20Service;
    const txs: EthereumTransactionTypeExtended[] = [];
    const reserveDecimals: number = await decimalsOf(reserve);
    const totalBorrowingAmount: string = calcTotalBorrowingAmount(
      new BigNumberJs(amount),
      new BigNumberJs(borrowRatio),
      new BigNumberJs(loopCount),
    ).toString();
    const convertedAmount: string = valueToWei(amount, reserveDecimals);

    const approved = await isApproved({
      token: reserve,
      user,
      spender: this.leveragerAddress,
      amount,
    });
    const delegated = await isDelegated({
      token: debtToken,
      user,
      delegatee: this.leveragerAddress,
      amount: totalBorrowingAmount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended = approve({
        user,
        token: reserve,
        spender: this.leveragerAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });
      txs.push(approveTx);
    }

    if (!delegated) {
      const delegateTx: EthereumTransactionTypeExtended = approveDelegation({
        user,
        token: debtToken,
        delegatee: this.leveragerAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });
      txs.push(delegateTx);
    }

    const leveragerContract = this.getContractInstance(this.leveragerAddress);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        leveragerContract.populateTransaction.loop(
          reserve,
          convertedAmount,
          interestRateMode === InterestRate.Variable ? 2 : 1,
          onBehalfOf ?? user,
          new BigNumberJs(borrowRatio)
            .shiftedBy(BORROW_RATIO_DECIMALS)
            .toFixed(),
          loopCount,
        ),
      from: user,
      value: getTxValue(reserve, convertedAmount),
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: this.generateTxPriceEstimation(txs, txCallback, ProtocolAction.loop),
    });

    return txs;
  }
}
