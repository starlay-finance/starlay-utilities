import { BigNumber, providers } from 'ethers';
import { mocked } from 'ts-jest/utils';
import { ERC20Service } from '../erc20-contract';
import { PriceFeedAggregatorAdapter } from '../price-aggregator-adapter';
import {
  getReservesIncentivesDataMock,
  getUserIncentivesDataMock,
} from './_mocks';
import { ReserveIncentiveWithFeedsResponse } from './types/UiIncentiveDataProviderTypes';
import { UiIncentiveDataProvider } from './index';

jest.mock('../price-aggregator-adapter/index', () => {
  const adapterInstance = { currentPrice: jest.fn() };
  const ad = jest.fn(() => adapterInstance);
  return { PriceFeedAggregatorAdapter: ad };
});

jest.mock('../erc20-contract/index', () => {
  const erc20ContractInstance = { decimalsOf: jest.fn() };
  const ad = jest.fn(() => erc20ContractInstance);
  return { ERC20Service: ad };
});

describe('UiIncentiveDataProvider', () => {
  const mockValidEthereumAddress = '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984';
  const mockInvalidEthereumAddress = '0x0';

  const createValidInstance = () => {
    const instance = new UiIncentiveDataProvider({
      incentiveDataProviderAddress: mockValidEthereumAddress,
      priceAggregatorAdapterAddress: mockValidEthereumAddress,
      provider: new providers.JsonRpcProvider(),
    });

    const mockGetReservesIncentivesData = jest.fn();
    const mockGetUserIncentivesData = jest.fn();

    mockGetReservesIncentivesData.mockResolvedValue(
      getReservesIncentivesDataMock,
    );

    mockGetUserIncentivesData.mockResolvedValue(getUserIncentivesDataMock);

    // @ts-expect-error readonly
    instance._contract = {
      getFullReservesIncentiveData: jest.fn(),
      getReservesIncentivesData: mockGetReservesIncentivesData,
      getUserReservesIncentivesData: mockGetUserIncentivesData,
    };

    return instance;
  };

  describe('creating', () => {
    it('should throw an error if the contractAddress is not valid', () => {
      expect(
        () =>
          new UiIncentiveDataProvider({
            incentiveDataProviderAddress: mockInvalidEthereumAddress,
            priceAggregatorAdapterAddress: mockValidEthereumAddress,
            provider: new providers.JsonRpcProvider(),
          }),
      ).toThrowError('contract address is not valid');
    });
    it('should throw an error if the adapterAddres is not valid', () => {
      expect(
        () =>
          new UiIncentiveDataProvider({
            incentiveDataProviderAddress: mockValidEthereumAddress,
            priceAggregatorAdapterAddress: mockInvalidEthereumAddress,
            provider: new providers.JsonRpcProvider(),
          }),
      ).toThrowError('price aggregator address is not valid');
    });
    // it('should throw an error if the lendingPoolAddress is not valid', () => {
    //   expect(
    //     () =>
    //       new UiIncentiveDataProvider({
    //         incentiveDataProviderAddress: mockValidEthereumAddress,
    //         provider: new providers.JsonRpcProvider(),
    //       }),
    //   ).toThrowError('Lending pool address is not valid');
    // });
  });

  describe('getFullReservesIncentiveData', () => {
    it('should throw if user is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getFullReservesIncentiveData(
          mockInvalidEthereumAddress,
          mockValidEthereumAddress,
        ),
      ).rejects.toThrow('User address is not a valid ethereum address');
    });

    it('should throw if lending pool address is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getFullReservesIncentiveData(
          mockValidEthereumAddress,
          mockInvalidEthereumAddress,
        ),
      ).rejects.toThrow('Lending pool address provider is not valid');
    });

    it('should not throw if user and lending pool address provider is a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getFullReservesIncentiveData(
          mockValidEthereumAddress,
          mockValidEthereumAddress,
        ),
      ).resolves.not.toThrow();
    });
  });

  describe('getReservesIncentivesData - to get 100% in coverage :( pointless test', () => {
    it('should throw if lending pool address is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getReservesIncentivesData(mockInvalidEthereumAddress),
      ).rejects.toThrow('Lending pool address provider is not valid');
    });
    it('should not throw', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getReservesIncentivesData(mockValidEthereumAddress),
      ).resolves.not.toThrow();
    });
  });

  describe('getReservesIncentivesDataHumanized', () => {
    it('Should throw error if token address is wrong', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getReservesIncentivesDataHumanized(mockInvalidEthereumAddress),
      ).rejects.toThrow('Lending pool address provider is not valid');
    });
  });

  describe('getUserReservesIncentivesDataHumanized', () => {
    it('Should throw error if token address is wrong', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserReservesIncentivesDataHumanized(
          mockInvalidEthereumAddress,
          mockInvalidEthereumAddress,
        ),
      ).rejects.toThrow('Lending pool address provider is not valid');
    });
    it('should work with finding only', async () => {
      const instance = createValidInstance();
      const response = await instance.getUserReservesIncentivesDataHumanized(
        mockValidEthereumAddress,
        mockValidEthereumAddress,
      );

      expect(response).toEqual([
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          lTokenIncentivesUserData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            tokenIncentivesUserIndex: '43565143328112327495233486',
            userUnclaimedRewards: '1637573428',
          },
          vdTokenIncentivesUserData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            tokenIncentivesUserIndex: '43565143328112327495233486',
            userUnclaimedRewards: '1637573428',
          },
          sdTokenIncentivesUserData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            tokenIncentivesUserIndex: '43565143328112327495233486',
            userUnclaimedRewards: '1637573428',
          },
        },
      ]);
    });
  });

  describe('getIncentivesDataWithPrice', () => {
    it('Should throw error if token address is wrong', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getReservesIncentivesDataHumanized(mockInvalidEthereumAddress),
      ).rejects.toThrow('Lending pool address provider is not valid');
    });
    it('should work with one feed', async () => {
      const adapterInstance = new PriceFeedAggregatorAdapter({
        contractAddress: mockValidEthereumAddress,
        provider: new providers.JsonRpcProvider(),
      });
      const erc20Instance = new ERC20Service(new providers.JsonRpcProvider());
      const instance = createValidInstance();

      mocked(adapterInstance).currentPrice.mockReturnValueOnce(
        Promise.reject(),
      );

      mocked(adapterInstance).currentPrice.mockReturnValue(
        Promise.resolve({
          price: BigNumber.from('2'),
        }),
      );
      mocked(erc20Instance).decimalsOf.mockReturnValue(Promise.resolve(18));

      const result: ReserveIncentiveWithFeedsResponse[] =
        await instance.getIncentivesDataWithPrice({
          lendingPoolAddressProvider: mockValidEthereumAddress,
          tokenAddress: mockValidEthereumAddress,
        });
      expect(erc20Instance.decimalsOf).toBeCalled();
      expect(adapterInstance.currentPrice).toBeCalled();
      expect(typeof result[0].lIncentiveData.emissionEndTimestamp).toEqual(
        typeof 1,
      );
      expect(result).toEqual([
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          lIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          vdIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedDecimals: 18,
          },
          sdIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '2',
            priceFeedDecimals: 18,
          },
        },
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          lIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          vdIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedDecimals: 18,
          },
          sdIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '2',
            priceFeedDecimals: 18,
          },
        },
      ]);
    });
    it('should work with all feeds', async () => {
      const adapterInstance = new PriceFeedAggregatorAdapter({
        contractAddress: mockValidEthereumAddress,
        provider: new providers.JsonRpcProvider(),
      });
      const erc20Instance = new ERC20Service(new providers.JsonRpcProvider());
      const instance = createValidInstance();

      mocked(adapterInstance).currentPrice.mockReturnValue(
        Promise.resolve({
          price: BigNumber.from('2'),
        }),
      );
      mocked(erc20Instance).decimalsOf.mockReturnValue(Promise.resolve(18));

      const result: ReserveIncentiveWithFeedsResponse[] =
        await instance.getIncentivesDataWithPrice({
          lendingPoolAddressProvider: mockValidEthereumAddress,
          tokenAddress: mockValidEthereumAddress,
        });

      expect(adapterInstance.currentPrice).toBeCalled();
      expect(typeof result[0].lIncentiveData.emissionEndTimestamp).toEqual(
        typeof 1,
      );
      expect(result).toEqual([
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          lIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedDecimals: 18,
          },
          vdIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedDecimals: 18,
          },
          sdIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '2',
            priceFeedDecimals: 18,
          },
        },
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          lIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedDecimals: 18,
          },
          vdIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedDecimals: 18,
          },
          sdIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '2',
            priceFeedDecimals: 18,
          },
        },
      ]);
    });
    it('should work with all feeds and no quote', async () => {
      const adapterInstance = new PriceFeedAggregatorAdapter({
        contractAddress: mockValidEthereumAddress,
        provider: new providers.JsonRpcProvider(),
      });
      const instance = createValidInstance();

      mocked(adapterInstance).currentPrice.mockReturnValue(
        Promise.resolve({
          price: BigNumber.from('2'),
        }),
      );

      const result: ReserveIncentiveWithFeedsResponse[] =
        await instance.getIncentivesDataWithPrice({
          lendingPoolAddressProvider: mockValidEthereumAddress,
          tokenAddress: mockValidEthereumAddress,
        });

      expect(adapterInstance.currentPrice).toBeCalled();
      expect(typeof result[0].lIncentiveData.emissionEndTimestamp).toEqual(
        typeof 1,
      );
      expect(result).toEqual([
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          lIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedDecimals: 18,
          },
          vdIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedDecimals: 18,
          },
          sdIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '2',
            priceFeedDecimals: 18,
          },
        },
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          lIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedDecimals: 18,
          },
          vdIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '2',
            priceFeedDecimals: 18,
          },
          sdIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '2',
            priceFeedDecimals: 18,
          },
        },
      ]);
    });
    it('should work with no feed', async () => {
      const adapterInstance = new PriceFeedAggregatorAdapter({
        contractAddress: mockValidEthereumAddress,
        provider: new providers.JsonRpcProvider(),
      });
      const instance = createValidInstance();

      mocked(adapterInstance).currentPrice.mockReturnValue(Promise.reject());

      const result: ReserveIncentiveWithFeedsResponse[] =
        await instance.getIncentivesDataWithPrice({
          lendingPoolAddressProvider: mockValidEthereumAddress,
          tokenAddress: mockValidEthereumAddress,
        });

      expect(adapterInstance.currentPrice).toBeCalled();
      expect(typeof result[0].lIncentiveData.emissionEndTimestamp).toEqual(
        typeof 1,
      );
      expect(result).toEqual([
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          lIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          vdIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          sdIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
        },
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          lIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          vdIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          sdIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
        },
      ]);
    });
    it('should work with no feed twice', async () => {
      const adapterInstance = new PriceFeedAggregatorAdapter({
        contractAddress: mockValidEthereumAddress,
        provider: new providers.JsonRpcProvider(),
      });

      const instance = createValidInstance();

      mocked(adapterInstance).currentPrice.mockReturnValue(Promise.reject());

      const result: ReserveIncentiveWithFeedsResponse[] =
        await instance.getIncentivesDataWithPrice({
          lendingPoolAddressProvider: mockValidEthereumAddress,
          tokenAddress: mockValidEthereumAddress,
        });
      const result2: ReserveIncentiveWithFeedsResponse[] =
        await instance.getIncentivesDataWithPrice({
          lendingPoolAddressProvider: mockValidEthereumAddress,
          tokenAddress: mockValidEthereumAddress,
        });

      expect(adapterInstance.currentPrice).toBeCalled();
      expect(typeof result[0].lIncentiveData.emissionEndTimestamp).toEqual(
        typeof 1,
      );
      expect(result).toEqual([
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          lIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          vdIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          sdIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
        },
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          lIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          vdIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          sdIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
        },
      ]);
      expect(result2).toEqual([
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          lIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          vdIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          sdIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
        },
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          lIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          vdIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          sdIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
        },
      ]);
    });
    it('should work with token address incorrect', async () => {
      const instance = createValidInstance();
      const result: ReserveIncentiveWithFeedsResponse[] =
        await instance.getIncentivesDataWithPrice({
          lendingPoolAddressProvider: mockValidEthereumAddress,
          tokenAddress: mockInvalidEthereumAddress,
        });

      expect(result).toEqual([
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          lIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          vdIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          sdIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
        },
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          lIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          vdIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          sdIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
        },
      ]);
    });
    it('should work with no token address no quote ', async () => {
      const instance = createValidInstance();
      const result: ReserveIncentiveWithFeedsResponse[] =
        await instance.getIncentivesDataWithPrice({
          lendingPoolAddressProvider: mockValidEthereumAddress,
        });

      expect(result).toEqual([
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          lIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          vdIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          sdIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
        },
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          lIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          vdIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          sdIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
        },
      ]);
    });
    it('should work with no tokenAddress address and quote ', async () => {
      const instance = createValidInstance();
      const result: ReserveIncentiveWithFeedsResponse[] =
        await instance.getIncentivesDataWithPrice({
          lendingPoolAddressProvider: mockValidEthereumAddress,
        });

      expect(result).toEqual([
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          lIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          vdIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          sdIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
        },
        {
          underlyingAsset: '0xdac17f958d2ee523a2206206994597c13d831ec7',
          lIncentiveData: {
            tokenAddress: '0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f5',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '43565143328112327495233486',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          vdIncentiveData: {
            tokenAddress: '0x531842cEbbdD378f8ee36D171d6cC9C4fcf475Ec',
            precision: 18,
            rewardTokenAddress: '0x4da27a545c0c5B758a6BA100e3a049001de870f4',
            incentiveControllerAddress:
              '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
            rewardTokenDecimals: 18,
            emissionPerSecond: '1880787037037037',
            incentivesLastUpdateTimestamp: 1633175478,
            tokenIncentivesIndex: '57970476598005880594044681',
            emissionEndTimestamp: 1637573428,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
          sdIncentiveData: {
            tokenAddress: '0x0000000000000000000000000000000000000000',
            precision: 0,
            rewardTokenAddress: '0x0000000000000000000000000000000000000000',
            incentiveControllerAddress:
              '0x0000000000000000000000000000000000000000',
            rewardTokenDecimals: 0,
            emissionPerSecond: '0',
            incentivesLastUpdateTimestamp: 0,
            tokenIncentivesIndex: '0',
            emissionEndTimestamp: 0,
            priceFeed: '0',
            priceFeedDecimals: 18,
          },
        },
      ]);
    });
  });

  describe('getUserReserves', () => {
    it('should throw if lending pool address is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserReservesIncentivesData(
          mockValidEthereumAddress,
          mockInvalidEthereumAddress,
        ),
      ).rejects.toThrow('Lending pool address provider is not valid');
    });
    it('should throw if user is not a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserReservesIncentivesData(
          mockInvalidEthereumAddress,
          mockValidEthereumAddress,
        ),
      ).rejects.toThrow('User address is not a valid ethereum address');
    });

    it('should not throw if user is a valid ethereum address', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserReservesIncentivesData(
          mockValidEthereumAddress,
          mockValidEthereumAddress,
        ),
      ).resolves.not.toThrow();
    });
  });
});
