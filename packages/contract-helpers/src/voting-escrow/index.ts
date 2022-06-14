import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  ProtocolAction,
  tEthereumAddress,
} from '../commons/types';
import {
  DEFAULT_APPROVE_AMOUNT,
  gasLimitRecommendations,
} from '../commons/utils';
import { ERC20Service, IERC20ServiceInterface } from '../erc20-contract';
import { VotingEscrow as VotingEscrowContract } from './typechain/VotingEscrow';
import { VotingEscrow__factory } from './typechain/VotingEscrow__factory';
import {
  CreateLockArgs,
  IncreaseAmountArgs,
  IncreaseUnlockTimeArgs,
  LockData,
  UserLockData,
} from './types';

export interface VotingEscrowInterface {
  lockData: () => Promise<LockData>;
  userLockData: (args: {
    user: tEthereumAddress;
  }) => Promise<UserLockData | undefined>;
  createLock: (
    args: CreateLockArgs,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  withdraw: (args: {
    user: tEthereumAddress;
  }) => Promise<EthereumTransactionTypeExtended[]>;
  increaseAmount: (
    args: IncreaseAmountArgs,
  ) => Promise<EthereumTransactionTypeExtended[]>;
  increaseUnlockTime: (
    args: IncreaseUnlockTimeArgs,
  ) => Promise<EthereumTransactionTypeExtended[]>;
}

export class VotingEscrow
  extends BaseService<VotingEscrowContract>
  implements VotingEscrowInterface
{
  readonly erc20Service: IERC20ServiceInterface;

  readonly votingEscrowAddress: string;
  readonly layAddress: string;

  constructor(
    provider: providers.Provider,
    votingEscrowAddress: string,
    layAddress: string,
  ) {
    super(provider, VotingEscrow__factory);
    this.erc20Service = new ERC20Service(provider);
    this.votingEscrowAddress = votingEscrowAddress;
    this.layAddress = layAddress;
  }

  contract = () => this.getContractInstance(this.votingEscrowAddress);

  lockData: VotingEscrowInterface['lockData'] = async () => {
    const contract = this.contract();
    const totalVotingPower = await contract.totalSupply();
    const totalLocked = await contract.supply();
    return {
      totalVotingPower,
      totalLocked,
    };
  };

  userLockData: VotingEscrowInterface['userLockData'] = async ({ user }) => {
    const contract = this.contract();
    const lockerId = await contract.ownerToId(user);
    if (lockerId.isZero()) return;
    const [locked, votingPower] = await Promise.all([
      contract.locked(lockerId),
      contract.balanceOfLockerId(lockerId),
    ]);
    return {
      lockerId,
      locked: locked.amount,
      lockedEnd: locked.end,
      votingPower,
    };
  };

  createLock: VotingEscrowInterface['createLock'] = async ({
    user,
    amount,
    duration,
  }) => {
    const txs: EthereumTransactionTypeExtended[] = [];

    const approved = await this.erc20Service.isApproved({
      token: this.layAddress,
      user,
      spender: this.votingEscrowAddress,
      amount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended =
        this.erc20Service.approve({
          token: this.layAddress,
          user,
          spender: this.votingEscrowAddress,
          amount: DEFAULT_APPROVE_AMOUNT,
        });
      txs.push(approveTx);
    }

    const txCallback = this.generateTxCallback({
      rawTxMethod: async () =>
        this.contract().populateTransaction.createLock(amount, duration),
      action: ProtocolAction.ve,
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: async () => ({
        gasLimit: gasLimitRecommendations[ProtocolAction.ve].recommended,
        gasPrice: (await this.provider.getGasPrice()).toString(),
      }),
    });

    return txs;
  };

  withdraw: VotingEscrowInterface['withdraw'] = async ({ user }) => {
    const txs: EthereumTransactionTypeExtended[] = [];

    const txCallback = this.generateTxCallback({
      rawTxMethod: async () => this.contract().populateTransaction.withdraw(),
      action: ProtocolAction.ve,
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: async () => ({
        gasLimit: gasLimitRecommendations[ProtocolAction.ve].recommended,
        gasPrice: (await this.provider.getGasPrice()).toString(),
      }),
    });
    return txs;
  };

  increaseAmount: VotingEscrowInterface['increaseAmount'] = async ({
    user,
    amount,
  }) => {
    const txs: EthereumTransactionTypeExtended[] = [];

    const approved = await this.erc20Service.isApproved({
      token: this.layAddress,
      user,
      spender: this.votingEscrowAddress,
      amount,
    });

    if (!approved) {
      const approveTx: EthereumTransactionTypeExtended =
        this.erc20Service.approve({
          token: this.layAddress,
          user,
          spender: this.votingEscrowAddress,
          amount: DEFAULT_APPROVE_AMOUNT,
        });
      txs.push(approveTx);
    }

    const txCallback = this.generateTxCallback({
      rawTxMethod: async () =>
        this.contract().populateTransaction.increaseAmount(amount),
      action: ProtocolAction.ve,
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: async () => ({
        gasLimit: gasLimitRecommendations[ProtocolAction.ve].recommended,
        gasPrice: (await this.provider.getGasPrice()).toString(),
      }),
    });

    return txs;
  };

  increaseUnlockTime: VotingEscrowInterface['increaseUnlockTime'] = async ({
    user,
    duration,
  }) => {
    const txs: EthereumTransactionTypeExtended[] = [];

    const txCallback = this.generateTxCallback({
      rawTxMethod: async () =>
        this.contract().populateTransaction.increaseUnlockTime(duration),
      action: ProtocolAction.ve,
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: async () => ({
        gasLimit: gasLimitRecommendations[ProtocolAction.ve].recommended,
        gasPrice: (await this.provider.getGasPrice()).toString(),
      }),
    });

    return txs;
  };
}
