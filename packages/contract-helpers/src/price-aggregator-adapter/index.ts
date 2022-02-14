import { providers } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { IPriceAggregatorAdapter } from './typechain/IPriceAggregatorAdapter';
import { IPriceAggregatorAdapterFactory } from './typechain/IPriceAggregatorAdapterFactory';
import { PriceFeed } from './types/PriceAggregatorTypes';

export * from './types/PriceAggregatorTypes';

export interface PriceFeedAggregatorAdapterInterface {
  currentPrice: (tokenAddress: string) => Promise<PriceFeed>;
}

export interface PriceFeedAggregatorAdapterContext {
  contractAddress: string;
  provider: providers.Provider;
}

export class PriceFeedAggregatorAdapter
  implements PriceFeedAggregatorAdapterInterface
{
  private readonly adapterContract: IPriceAggregatorAdapter;

  public constructor({
    provider,
    contractAddress,
  }: PriceFeedAggregatorAdapterContext) {
    if (!isAddress(contractAddress)) {
      throw new Error('contract address is not valid');
    }

    this.adapterContract = IPriceAggregatorAdapterFactory.connect(
      contractAddress,
      provider,
    );
  }

  public currentPrice = async (tokenAddress: string): Promise<PriceFeed> => {
    if (!isAddress(tokenAddress)) {
      throw new Error('tokenAddress is not valid');
    }

    const price = await this.adapterContract.currentPrice(tokenAddress);
    return { price };
  };
}
