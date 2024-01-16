import { BigNumber, providers } from 'ethers';
import { LeverageParamsType } from './types';
import { LeveragerLdot } from './index';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('LeveragerLdot', () => {
  const provider = new providers.JsonRpcProvider();
  jest
    .spyOn(provider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));
  const LEVERAGER = '0x0000000000000000000000000000000000000001';

  const newLeveragerInstance = () => new LeveragerLdot(provider, LEVERAGER);

  describe('Initialization', () => {
    it('Expects to initialize correctly with all params', () => {
      const instance = newLeveragerInstance();
      expect(instance instanceof LeveragerLdot).toEqual(true);
    });
  });
  describe('leverageDot', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const token = '0x0000000000000000000000000000000000000007';
    const borrow_dot_amount = '10';
    const repay_dot_amount = '1';

    const validArgs: LeverageParamsType = {
      user,
      token,
      borrow_dot_amount,
      repay_dot_amount,
    };

    const invalidAddress = '0x0';
    const invalidAmount = '0';

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('throw error if invalid user', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.leverageDot({
          ...validArgs,
          user: invalidAddress,
        }),
      ).rejects.toThrowError(
        `Address: ${invalidAddress} is not a valid ethereum Address`,
      );
    });
    it('throw error if invalid token', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.leverageDot({
          ...validArgs,
          token: invalidAddress,
        }),
      ).rejects.toThrowError(
        `Address: ${invalidAddress} is not a valid ethereum Address`,
      );
    });
    it('throw error if borrow_dot_amount lte 0', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.leverageDot({
          ...validArgs,
          borrow_dot_amount: invalidAmount,
        }),
      ).rejects.toThrowError(
        `Amount: ${invalidAmount} needs to be greater than 0`,
      );
    });
    it('throw error if repay_dot_amount lte 0', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.leverageDot({
          ...validArgs,
          repay_dot_amount: invalidAmount,
        }),
      ).rejects.toThrowError(
        `Amount: ${invalidAmount} needs to be greater than 0`,
      );
    });
    it('return empty array if leverager address invalid', async () => {
      const leveragerInstance = new LeveragerLdot(provider, invalidAddress);
      expect(
        leveragerInstance.leverageDot({
          user,
          token,
          borrow_dot_amount,
          repay_dot_amount,
        }),
      ).toHaveLength(0);
    });
  });
});
