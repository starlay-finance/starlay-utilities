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
    user: tEthereumAddress;
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

const timestampToTerms = (timestamp: number) => {
  const voteTerm = Math.ceil(timestamp / SECONDS_OF_WEEK) * SECONDS_OF_WEEK;
  return { voteTerm, claimableTerm: voteTerm - SECONDS_OF_WEEK * 2 };
};

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
    const { voteTerm, claimableTerm } = timestampToTerms(timestamp);
    const contract = this.getContractInstance(this.voterAddress);
    const iContract = contract.interface;

    const tokenList = await contract.tokenList();
    const calls = [
      {
        target: this.voterAddress,
        callData: iContract.encodeFunctionData('totalWeight', [voteTerm]),
      },
      ...tokenList.flatMap((token, index) => [
        {
          target: this.voterAddress,
          callData: iContract.encodeFunctionData('poolWeights', [
            token,
            voteTerm,
          ]),
        },
        {
          target: this.voterAddress,
          callData: iContract.encodeFunctionData('tokensPerWeek', [
            index,
            claimableTerm,
          ]),
        },
      ]),
    ];
    const {
      returnData: [totalWeightRes, ...returnData],
    } = await this.multicall.callStatic.aggregate(calls);
    const [totalWeight] = iContract.decodeFunctionResult(
      'totalWeight',
      totalWeightRes,
    );
    let cursor = 0;
    const data = tokenList.reduce(
      (res, token) => ({
        ...res,
        [token.toLowerCase()]: {
          weight: (
            iContract.decodeFunctionResult(
              'poolWeights',
              returnData[cursor++],
            ) as [BigNumber]
          )[0],
          lastWeekRevenue: (
            iContract.decodeFunctionResult(
              'tokensPerWeek',
              returnData[cursor++],
            ) as [BigNumber]
          )[0],
        },
      }),
      {},
    );
    return { totalWeight: totalWeight as BigNumber, data };
  };

  userData: VoterInterface['userData'] = async ({
    user,
    lockerId,
    timestamp,
  }) => {
    const { voteTerm } = timestampToTerms(timestamp);
    const contract = this.getContractInstance(this.voterAddress);
    const iContract = contract.interface;

    const tokenList = await contract.tokenList();
    const calls = [
      {
        target: this.voterAddress,
        callData: iContract.encodeFunctionData('claimableFor', [user]),
      },
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
            voteTerm,
          ]),
        },
      ]),
    ];
    const {
      returnData: [claimableRes, ...userVoteDataRes],
    } = await this.multicall.callStatic.aggregate(calls);
    const [claimables] = iContract.decodeFunctionResult(
      'claimableFor',
      claimableRes,
    );
    let cursor = 0;
    return tokenList.reduce(
      (res, token, index) => ({
        ...res,
        [token.toLowerCase()]: {
          claimable: (claimables as BigNumber[])[index],
          weight: (
            iContract.decodeFunctionResult(
              'weights',
              userVoteDataRes[cursor++],
            ) as [BigNumber]
          )[0],
          vote: (
            iContract.decodeFunctionResult(
              'votes',
              userVoteDataRes[cursor++],
            ) as [BigNumber]
          )[0],
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
