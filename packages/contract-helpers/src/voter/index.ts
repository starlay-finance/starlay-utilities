import { BigNumber, providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  ProtocolAction,
  tEthereumAddress,
} from '../commons/types';
import { gasLimitRecommendations } from '../commons/utils';
import { Multicall } from '../multicall/typechain/Multicall';
import { Multicall__factory } from '../multicall/typechain/Multicall__factory';
import { Voter as VoterContract } from './typechain/Voter';
import { Voter__factory } from './typechain/Voter__factory';
import { UserVoteData, VoteArgs, VoteData } from './types';

export interface VoterInterface {
  voteData: (args: { timestamp: number }) => Promise<VoteData>;
  userData: (args: {
    lockerId: string;
    timestamp: number;
  }) => Promise<UserVoteData>;
  vote: (args: VoteArgs) => Promise<EthereumTransactionTypeExtended[]>;
  poke: (args: {
    user: tEthereumAddress;
  }) => Promise<EthereumTransactionTypeExtended[]>;
  claim: (args: {
    user: tEthereumAddress;
  }) => Promise<EthereumTransactionTypeExtended[]>;
}

const SECONDS_OF_WEEK = 60 * 60 * 24 * 7;

const timestampToTerm = (timestamp: number) =>
  Math.ceil(timestamp / SECONDS_OF_WEEK) * SECONDS_OF_WEEK;

export class Voter
  extends BaseService<VoterContract>
  implements VoterInterface
{
  readonly multicall: Multicall;

  readonly voterAddress: string;

  constructor(
    provider: providers.Provider,
    voterAddress: string,
    multicallAdress: string,
  ) {
    super(provider, Voter__factory);
    this.voterAddress = voterAddress;
    this.multicall = Multicall__factory.connect(multicallAdress, provider);
  }

  voteData: VoterInterface['voteData'] = async ({ timestamp }) => {
    const term = timestampToTerm(timestamp);
    const contract = this.getContractInstance(this.voterAddress);
    const iContract = contract.interface;

    const tokenList = await contract.tokenList();
    const calls = [
      {
        target: this.voterAddress,
        callData: iContract.encodeFunctionData('totalWeight', [term]),
      },
      ...tokenList.map(token => ({
        target: this.voterAddress,
        callData: iContract.encodeFunctionData('poolWeights', [token, term]),
      })),
    ];
    const {
      returnData: [totalWeightRes, ...poolWeightsRes],
    } = await this.multicall.callStatic.aggregate(calls);
    const [totalWeight] = iContract.decodeFunctionResult(
      'totalWeight',
      totalWeightRes,
    );
    const poolWeights = tokenList.reduce(
      (res, token, index) => ({
        ...res,
        [token]: iContract.decodeFunctionResult(
          'poolWeights',
          poolWeightsRes[index][0],
        ),
      }),
      {},
    );
    return { totalWeight: totalWeight as BigNumber, poolWeights };
  };

  userData: VoterInterface['userData'] = async ({ lockerId, timestamp }) => {
    const term = timestampToTerm(timestamp);
    const contract = this.getContractInstance(this.voterAddress);
    const iContract = contract.interface;

    const tokenList = await contract.tokenList();
    const calls = [
      ...tokenList.flatMap(token => [
        {
          target: this.voterAddress,
          callData: iContract.encodeFunctionData('weights', [lockerId, token]),
        },
        {
          target: this.voterAddress,
          callData: iContract.encodeFunctionData('votes', [
            lockerId,
            token,
            term,
          ]),
        },
      ]),
    ];
    const { returnData } = await this.multicall.callStatic.aggregate(calls);
    let cursor = 0;
    return tokenList.reduce(
      (res, token) => ({
        ...res,
        [token]: {
          weight: iContract.decodeFunctionResult(
            'weights',
            returnData[cursor++][0],
          ),
          vote: iContract.decodeFunctionResult(
            'votes',
            returnData[cursor++][0],
          ),
        },
      }),
      {},
    );
  };

  vote: VoterInterface['vote'] = async ({ user, weights }) => {
    const contract = this.getContractInstance(this.voterAddress);
    const tokenList = await contract.tokenList();
    const args = tokenList.map(token => weights[token.toLowerCase()]);

    const txs: EthereumTransactionTypeExtended[] = [];

    const txCallback = this.generateTxCallback({
      rawTxMethod: async () => contract.populateTransaction.vote(args),
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

  poke: VoterInterface['poke'] = async ({ user }) => {
    const txs: EthereumTransactionTypeExtended[] = [];
    const txCallback = this.generateTxCallback({
      rawTxMethod: this.getContractInstance(this.voterAddress)
        .populateTransaction.poke,
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

  claim: VoterInterface['claim'] = async ({ user }) => {
    const txs: EthereumTransactionTypeExtended[] = [];
    const txCallback = this.generateTxCallback({
      rawTxMethod: this.getContractInstance(this.voterAddress)
        .populateTransaction.claim,
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
