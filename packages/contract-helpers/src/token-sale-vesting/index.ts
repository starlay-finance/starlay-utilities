import { BigNumber, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  ProtocolAction,
  tEthereumAddress,
} from '../commons/types';
import { gasLimitRecommendations, valueToWei } from '../commons/utils';
import { Multicall } from '../multicall/typechain/Multicall';
import { Multicall__factory } from '../multicall/typechain/Multicall__factory';
import { TokenSale as TokenSaleVestingContract } from './typechain/TokenSale';
import { TokenSale__factory } from './typechain/TokenSale__factory';
import { UserData } from './types';

export interface TokenSaleVestingInterface {
  userData: (args: { user: tEthereumAddress }) => Promise<UserData>;
  lock: (args: {
    user: tEthereumAddress;
    amount: BigNumber;
    duration: number;
  }) => Promise<EthereumTransactionTypeExtended[]>;
  deposit: (args: {
    user: tEthereumAddress;
    amount: BigNumber;
  }) => Promise<EthereumTransactionTypeExtended[]>;
}

const LAY_DECIMALS = 18;

export class TokenSaleVesting
  extends BaseService<TokenSaleVestingContract>
  implements TokenSaleVestingInterface
{
  readonly multicall: Multicall;
  readonly contractAddress: string;

  constructor(
    provider: providers.Provider,
    contractAddress: string,
    multicallAddress: string,
  ) {
    super(provider, TokenSale__factory);
    this.multicall = Multicall__factory.connect(multicallAddress, provider);
    this.contractAddress = contractAddress;
  }

  lock: TokenSaleVestingInterface['lock'] = async ({
    user,
    amount,
    duration,
  }) => {
    const txs: EthereumTransactionTypeExtended[] = [];
    const convertedAmount = valueToWei(amount.toString(), LAY_DECIMALS);
    const txCallback = this.generateTxCallback({
      rawTxMethod: async () =>
        this.getContractInstance(this.contractAddress).populateTransaction.lock(
          convertedAmount,
          duration,
        ),
      action: ProtocolAction.ve,
      from: user,
      skipEstimation: true,
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

  deposit: TokenSaleVestingInterface['deposit'] = async ({ user, amount }) => {
    const txs: EthereumTransactionTypeExtended[] = [];
    const convertedAmount = valueToWei(amount.toString(), LAY_DECIMALS);
    const txCallback = this.generateTxCallback({
      rawTxMethod: async () =>
        this.getContractInstance(
          this.contractAddress,
        ).populateTransaction.depositInVe(convertedAmount),
      action: ProtocolAction.ve,
      from: user,
      skipEstimation: true,
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

  userData: TokenSaleVestingInterface['userData'] = async ({ user }) => {
    const iContract = this.getContractInstance(this.contractAddress).interface;
    const calls = [
      {
        target: this.contractAddress,
        callData: iContract.encodeFunctionData('releasableAmount', [user]),
      },
      {
        target: this.contractAddress,
        callData: iContract.encodeFunctionData('lockableAmount', [user]),
      },
      {
        target: this.contractAddress,
        callData: iContract.encodeFunctionData('vestingEnd'),
      },
    ];
    const { returnData } = await this.multicall.callStatic.aggregate(calls);
    return {
      releasable: (
        iContract.decodeFunctionResult('releasableAmount', returnData[0]) as [
          BigNumber,
        ]
      )[0],
      lockableAmount: (
        iContract.decodeFunctionResult('lockableAmount', returnData[1]) as [
          BigNumber,
        ]
      )[0],
      vestingEnd: (
        iContract.decodeFunctionResult('vestingEnd', returnData[2]) as [
          BigNumber,
        ]
      )[0],
    };
  };
}
