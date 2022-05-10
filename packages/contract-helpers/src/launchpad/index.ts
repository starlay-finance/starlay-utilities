import { BigNumber, providers } from 'ethers';
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
  getTxValue,
  valueToWei,
  DEFAULT_APPROVE_AMOUNT,
} from '../commons/utils';
import { LaunchpadValidator } from '../commons/validators/methodValidators';
import {
  is0OrPositiveAmount,
  isEthAddress,
  isPositiveAmount,
} from '../commons/validators/paramValidators';
import { ERC20Service, IERC20ServiceInterface } from '../erc20-contract';
import { Launchpad as LaunchpadContract } from './typechain/Launchpad';
import { Launchpad__factory } from './typechain/Launchpad__factory';
import {
  Bid,
  BidParamsType,
  CancelParamsType,
  RefundParamsType,
  UpdateAmountParamsType,
  UpdateParamsType,
  UpdatePriceCapParamsType,
} from './types';

export interface LaunchpadInterface {
  bid: (args: BidParamsType) => Promise<EthereumTransactionTypeExtended[]>;
  update: (
    args: UpdateParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  updateAmount: (
    args: UpdateAmountParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  updatePriceCap: (
    args: UpdatePriceCapParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  cancel: (
    args: CancelParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  refund: (
    args: RefundParamsType,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  participant: (user: tEthereumAddress) => Promise<Bid | undefined>;
  price: () => Promise<BigNumber>;
  claimable: (user: tEthereumAddress) => Promise<BigNumber>;
  refundable: (user: tEthereumAddress) => Promise<BigNumber>;
}

export class Launchpad
  extends BaseService<LaunchpadContract>
  implements LaunchpadInterface
{
  readonly erc20Service: IERC20ServiceInterface;

  readonly launchpadAddress: string;

  constructor(provider: providers.Provider, launchpadAddress: string) {
    super(provider, Launchpad__factory);
    this.launchpadAddress = launchpadAddress;
    this.erc20Service = new ERC20Service(provider);
  }

  @LaunchpadValidator
  public async bid(
    @isEthAddress('user')
    @isEthAddress('reserve')
    @isPositiveAmount('amount')
    @is0OrPositiveAmount('priceCap')
    { user, reserve, amount, priceCap, cancelable }: BidParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const { isApproved, approve, decimalsOf }: IERC20ServiceInterface =
      this.erc20Service;
    const txs: EthereumTransactionTypeExtended[] = [];
    const reserveDecimals: number = await decimalsOf(reserve);
    const convertedAmount: string = valueToWei(amount, reserveDecimals);
    const convertedPriceCap: string = valueToWei(priceCap, reserveDecimals);

    const approved = await isApproved({
      token: reserve,
      user,
      spender: this.launchpadAddress,
      amount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended = approve({
        user,
        token: reserve,
        spender: this.launchpadAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });
      txs.push(approveTx);
    }

    const LaunchpadContract = this.getContractInstance(this.launchpadAddress);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        LaunchpadContract.populateTransaction.bid(
          convertedAmount,
          convertedPriceCap,
          cancelable,
        ),
      action: ProtocolAction.bid,
      from: user,
      value: getTxValue(reserve, convertedAmount),
      skipEstimation: true,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: async () => ({
        gasLimit: gasLimitRecommendations[ProtocolAction.bid].recommended,
        gasPrice: (await this.provider.getGasPrice()).toString(),
      }),
    });

    return txs;
  }

  @LaunchpadValidator
  public async update(
    @isEthAddress('user')
    @isEthAddress('reserve')
    @isPositiveAmount('amount')
    @is0OrPositiveAmount('priceCap')
    { user, reserve, amount, priceCap }: UpdateParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const { isApproved, approve, decimalsOf }: IERC20ServiceInterface =
      this.erc20Service;
    const txs: EthereumTransactionTypeExtended[] = [];
    const reserveDecimals: number = await decimalsOf(reserve);
    const convertedAmount: string = valueToWei(amount, reserveDecimals);
    const convertedPriceCap: string = valueToWei(priceCap, reserveDecimals);

    const approved = await isApproved({
      token: reserve,
      user,
      spender: this.launchpadAddress,
      amount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended = approve({
        user,
        token: reserve,
        spender: this.launchpadAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });
      txs.push(approveTx);
    }

    const LaunchpadContract = this.getContractInstance(this.launchpadAddress);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        LaunchpadContract.populateTransaction.update(
          convertedAmount,
          convertedPriceCap,
        ),
      action: ProtocolAction.updateBid,
      from: user,
      value: getTxValue(reserve, convertedAmount),
      skipEstimation: true,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: async () => ({
        gasLimit: gasLimitRecommendations[ProtocolAction.updateBid].recommended,
        gasPrice: (await this.provider.getGasPrice()).toString(),
      }),
    });

    return txs;
  }

  @LaunchpadValidator
  public async updateAmount(
    @isEthAddress('user')
    @isEthAddress('reserve')
    @isPositiveAmount('amount')
    { user, reserve, amount }: UpdateAmountParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const { isApproved, approve, decimalsOf }: IERC20ServiceInterface =
      this.erc20Service;
    const txs: EthereumTransactionTypeExtended[] = [];
    const reserveDecimals: number = await decimalsOf(reserve);
    const convertedAmount: string = valueToWei(amount, reserveDecimals);

    const approved = await isApproved({
      token: reserve,
      user,
      spender: this.launchpadAddress,
      amount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended = approve({
        user,
        token: reserve,
        spender: this.launchpadAddress,
        amount: DEFAULT_APPROVE_AMOUNT,
      });
      txs.push(approveTx);
    }

    const LaunchpadContract = this.getContractInstance(this.launchpadAddress);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        LaunchpadContract.populateTransaction.addBidding(convertedAmount),
      action: ProtocolAction.updateBid,
      from: user,
      value: getTxValue(reserve, convertedAmount),
      skipEstimation: true,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: async () => ({
        gasLimit: gasLimitRecommendations[ProtocolAction.updateBid].recommended,
        gasPrice: (await this.provider.getGasPrice()).toString(),
      }),
    });

    return txs;
  }

  @LaunchpadValidator
  public async updatePriceCap(
    @isEthAddress('user')
    @isEthAddress('reserve')
    @is0OrPositiveAmount('priceCap')
    { user, reserve, priceCap }: UpdatePriceCapParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const { decimalsOf }: IERC20ServiceInterface = this.erc20Service;
    const txs: EthereumTransactionTypeExtended[] = [];
    const reserveDecimals: number = await decimalsOf(reserve);
    const convertedPriceCap: string = valueToWei(priceCap, reserveDecimals);

    const LaunchpadContract = this.getContractInstance(this.launchpadAddress);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        LaunchpadContract.populateTransaction.updateCap(convertedPriceCap),
      action: ProtocolAction.updateBid,
      from: user,
      skipEstimation: true,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: async () => ({
        gasLimit: gasLimitRecommendations[ProtocolAction.updateBid].recommended,
        gasPrice: (await this.provider.getGasPrice()).toString(),
      }),
    });

    return txs;
  }

  @LaunchpadValidator
  public async cancel(
    @isEthAddress('user')
    { user }: CancelParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];

    const LaunchpadContract = this.getContractInstance(this.launchpadAddress);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () => LaunchpadContract.populateTransaction.cancel(),
      action: ProtocolAction.cancelBid,
      from: user,
      skipEstimation: true,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: async () => ({
        gasLimit: gasLimitRecommendations[ProtocolAction.cancelBid].recommended,
        gasPrice: (await this.provider.getGasPrice()).toString(),
      }),
    });

    return txs;
  }

  @LaunchpadValidator
  public async refund(
    @isEthAddress('user')
    { user }: CancelParamsType,
  ): Promise<EthereumTransactionTypeExtended[]> {
    const txs: EthereumTransactionTypeExtended[] = [];

    const LaunchpadContract = this.getContractInstance(this.launchpadAddress);

    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () => LaunchpadContract.populateTransaction.refund(),
      action: ProtocolAction.refundBid,
      from: user,
      skipEstimation: true,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: async () => ({
        gasLimit: gasLimitRecommendations[ProtocolAction.refundBid].recommended,
        gasPrice: (await this.provider.getGasPrice()).toString(),
      }),
    });

    return txs;
  }

  @LaunchpadValidator
  public async participant(
    @isEthAddress() user: tEthereumAddress,
  ): Promise<Bid | undefined> {
    const bid = await this.getContractInstance(
      this.launchpadAddress,
    ).participant(user);
    if (bid.amount.paid.isZero()) return;
    return {
      paid: bid.amount.paid,
      multiplied: bid.amount.multiplied,
      priceCap: bid.cap.price,
      cancelable: bid.cancelable,
    };
  }

  @LaunchpadValidator
  public async price(): Promise<BigNumber> {
    return this.getContractInstance(this.launchpadAddress).price();
  }

  @LaunchpadValidator
  public async claimable(
    @isEthAddress() user: tEthereumAddress,
  ): Promise<BigNumber> {
    return this.getContractInstance(this.launchpadAddress).claimable(user);
  }

  @LaunchpadValidator
  public async refundable(
    @isEthAddress() user: tEthereumAddress,
  ): Promise<BigNumber> {
    return this.getContractInstance(this.launchpadAddress).refundable(user);
  }
}
