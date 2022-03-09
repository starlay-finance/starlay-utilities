import { BigNumber, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  tEthereumAddress,
  transactionType,
} from '../commons/types';
import { valueToWei, API_ETH_MOCK_ADDRESS } from '../commons/utils';
import { ERC20Validator } from '../commons/validators/methodValidators';
import {
  isEthAddress,
  isPositiveAmount,
} from '../commons/validators/paramValidators';
import { DebtERC20 } from './typechain/DebtERC20';
import { DebtERC20__factory } from './typechain/DebtERC20__factory';

export interface IDebtERC20ServiceInterface {
  decimalsOf: (token: tEthereumAddress) => Promise<number>;
  approveDelegation(args: ApproveType): EthereumTransactionTypeExtended;
  isDelegated(args: ApproveType): Promise<boolean>;
}

export type ApproveType = {
  user: tEthereumAddress;
  token: tEthereumAddress;
  delegatee: tEthereumAddress;
  amount: string;
};

export class DebtERC20Service
  extends BaseService<DebtERC20>
  implements IDebtERC20ServiceInterface
{
  readonly tokenDecimals: Record<string, number>;

  constructor(provider: providers.Provider) {
    super(provider, DebtERC20__factory);
    this.tokenDecimals = {};
    this.decimalsOf = this.decimalsOf.bind(this);
    this.approveDelegation = this.approveDelegation.bind(this);
    this.isDelegated = this.isDelegated.bind(this);
  }

  @ERC20Validator
  public approveDelegation(
    @isEthAddress('user')
    @isEthAddress('token')
    @isEthAddress('delegatee')
    @isPositiveAmount('amount')
    { user, token, delegatee, amount }: ApproveType,
  ): EthereumTransactionTypeExtended {
    const debtErc20Contract: DebtERC20 = this.getContractInstance(token);
    const txCallback: () => Promise<transactionType> = this.generateTxCallback({
      rawTxMethod: async () =>
        debtErc20Contract.populateTransaction.approveDelegation(
          delegatee,
          amount,
        ),
      from: user,
    });
    return {
      tx: txCallback,
      txType: eEthereumTxType.ERC20_APPROVAL,
      gas: this.generateTxPriceEstimation([], txCallback),
    };
  }

  @ERC20Validator
  public async isDelegated(
    @isEthAddress('user')
    @isEthAddress('token')
    @isEthAddress('delegatee')
    @isPositiveAmount('amount')
    { user, token, delegatee, amount }: ApproveType,
  ): Promise<boolean> {
    if (token.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) return true;
    const decimals = await this.decimalsOf(token);
    const debtErc20Contract: DebtERC20 = this.getContractInstance(token);
    const allowance: BigNumber = await debtErc20Contract.borrowAllowance(
      user,
      delegatee,
    );
    const amountBNWithDecimals: BigNumber = BigNumber.from(
      valueToWei(amount, decimals),
    );
    return allowance.gte(amountBNWithDecimals);
  }

  @ERC20Validator
  public async decimalsOf(
    @isEthAddress() token: tEthereumAddress,
  ): Promise<number> {
    if (token.toLowerCase() === API_ETH_MOCK_ADDRESS.toLowerCase()) return 18;

    if (!this.tokenDecimals[token]) {
      const erc20Contract = this.getContractInstance(token);
      this.tokenDecimals[token] = await erc20Contract.decimals();
    }

    return this.tokenDecimals[token];
  }
}
