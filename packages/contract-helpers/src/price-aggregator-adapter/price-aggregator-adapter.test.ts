import { providers } from 'ethers';
import { PriceFeedAggregatorAdapter } from './index';

const mockInvalidEthereumAddress = '0x0';
const mockValidEthereumAddress = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';

describe('ChainlinkFeedsRegistry', () => {
  describe('initialize', () => {
    it('Should throw error if contract address is wrong', async () => {
      expect(
        () =>
          new PriceFeedAggregatorAdapter({
            provider: new providers.JsonRpcProvider(),
            contractAddress: mockInvalidEthereumAddress,
          }),
      ).toThrowError('contract address is not valid');
    });
    it('should get instantiated correctly', () => {
      const registry = new PriceFeedAggregatorAdapter({
        provider: new providers.JsonRpcProvider(),
        contractAddress: mockValidEthereumAddress,
      });
      expect(registry instanceof PriceFeedAggregatorAdapter).toEqual(true);
    });
  });
  describe('getPriceFeed', () => {
    const registry = new PriceFeedAggregatorAdapter({
      provider: new providers.JsonRpcProvider(),
      contractAddress: mockValidEthereumAddress,
    });
    // @ts-expect-error readonly
    registry.adapterContract = {
      currentPrice: jest.fn().mockImplementation(() => 1),
    };
    it('Should throw error if token address is wrong', async () => {
      await expect(
        registry.currentPrice(mockInvalidEthereumAddress),
      ).rejects.toThrow('tokenAddress is not valid');
    });
    it('Should get the price', async () => {
      const priceFeed = await registry.currentPrice(mockValidEthereumAddress);
      expect(priceFeed).toEqual({ price: 1 });
    });
  });
});
