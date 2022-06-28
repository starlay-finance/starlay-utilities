import { providers } from 'ethers';
import BaseService from '../commons/BaseService';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  ProtocolAction,
} from '../commons/types';
import { gasLimitRecommendations } from '../commons/utils';
import { Claimer as ClaimerContract } from './typechain/Claimer';
import { Claimer__factory } from './typechain/Claimer__factory';
import { Releasable, ReleasableArgs, ReleaseArgs } from './types';

export interface ClaimerInterface {
  releasable: (args: ReleasableArgs) => Promise<Releasable>;
  release: (args: ReleaseArgs) => Promise<EthereumTransactionTypeExtended[]>;
}

export class Claimer
  extends BaseService<ClaimerContract>
  implements ClaimerInterface
{
  readonly claimerAddress: string;

  constructor(provider: providers.Provider, claimerAddress: string) {
    super(provider, Claimer__factory);
    this.claimerAddress = claimerAddress;
  }

  releasable: ClaimerInterface['releasable'] = async ({ user, reserves }) => {
    const contract = this.getContractInstance(this.claimerAddress);
    const { _arthswapTokenSale, _starlayTokenSale, _liquidityMining } =
      await contract.releasable(user, reserves);
    return {
      ido: _arthswapTokenSale,
      tokenSale: _starlayTokenSale,
      rewards: _liquidityMining,
    };
  };

  release: ClaimerInterface['release'] = async ({ user, reserves }) => {
    const contract = this.getContractInstance(this.claimerAddress);
    const txs: EthereumTransactionTypeExtended[] = [];
    const txCallback = this.generateTxCallback({
      rawTxMethod: async () => contract.populateTransaction.release(reserves),
      action: ProtocolAction.ve,
      from: user,
    });

    txs.push({
      tx: txCallback,
      txType: eEthereumTxType.DLP_ACTION,
      gas: async () => ({
        gasLimit: gasLimitRecommendations[ProtocolAction.bulk].recommended,
        gasPrice: (await this.provider.getGasPrice()).toString(),
      }),
    });
    return txs;
  };
}
