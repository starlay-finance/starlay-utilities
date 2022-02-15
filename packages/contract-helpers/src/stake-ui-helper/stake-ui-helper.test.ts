import { providers } from 'ethers';
import { mockStakeData } from './_mocks';
import { StakeDataHumanized } from './types/stake';
import { StakeUiHelper } from './index';

describe('StakeUiHelper', () => {
  const mockValidEthereumAddress = '0x88757f2f99175387ab4c6a4b3067c77a695b0349';
  const mockInvalidEthereumAddress = '0x0';

  const createValidInstance = () => {
    const instance = new StakeUiHelper({
      stakeUiHelperAddress: mockValidEthereumAddress,
      provider: new providers.JsonRpcProvider(),
    });

    const mockGetUserUIData = jest.fn();
    mockGetUserUIData.mockResolvedValue([mockStakeData]);

    // @ts-expect-error readonly
    instance._contract = {
      getUserUIData: mockGetUserUIData,
    };

    return instance;
  };

  describe('creating', () => {
    it('should throw an error if the contractAddress is not valid', () => {
      expect(
        () =>
          new StakeUiHelper({
            stakeUiHelperAddress: mockInvalidEthereumAddress,
            provider: new providers.JsonRpcProvider(),
          }),
      ).toThrowError('contract address is not valid');
    });
    it('should work if all info is correct', () => {
      const instance = new StakeUiHelper({
        stakeUiHelperAddress: mockValidEthereumAddress,
        provider: new providers.JsonRpcProvider(),
      });

      expect(instance instanceof StakeUiHelper).toEqual(true);
    });
  });

  describe('getUserUIData - to get 100% in coverage :( pointless test', () => {
    it('should not throw', async () => {
      const instance = createValidInstance();
      await expect(
        instance.getUserUIData(mockValidEthereumAddress),
      ).resolves.not.toThrow();
    });
  });

  describe('getUserUIDataHumanized', () => {
    const expected: StakeDataHumanized = {
      stakeTokenTotalSupply: '0',
      stakeCooldownSeconds: 0,
      stakeUnstakeWindow: 0,
      stakeTokenPriceEth: '0',
      rewardTokenPriceEth: '0',
      stakeApy: '0',
      distributionPerSecond: '0',
      distributionEnd: '0',
      stakeTokenUserBalance: '0',
      underlyingTokenUserBalance: '0',
      userCooldown: 0,
      userIncentivesToClaim: '0',
      userPermitNonce: '0',
    };
    it('should not throw', async () => {
      const instance = createValidInstance();
      const result = await instance.getUserUIDataHumanized(
        mockValidEthereumAddress,
      );
      expect(result).toEqual(expected);
    });
  });
});
