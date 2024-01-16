import { BigNumber, providers, utils } from 'ethers';
import {
  eEthereumTxType,
  GasType,
  ProtocolAction,
  transactionType,
} from '../commons/types';
import { gasLimitRecommendations, valueToWei } from '../commons/utils';
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

    const defaultDecimals = 18;

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
    const setup = (
      instance: LeveragerLdot,
      params: {
        decimals?: number;
        isApproved?: boolean;
        isDelegated?: boolean;
      } = {},
    ) => {
      const {
        decimals = defaultDecimals,
        isApproved = false,
        isDelegated = false,
      } = params || {};
      const decimalsSpy = jest
        .spyOn(instance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const isApprovedSpy = jest
        .spyOn(instance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(isApproved));
      const isDelegatedSpy = jest
        .spyOn(instance.debtErc20Service, 'isDelegated')
        .mockImplementationOnce(async () => Promise.resolve(isDelegated));
      return { decimalsSpy, isApprovedSpy, isDelegatedSpy };
    };

    it('Expects the 3 tx objects passing all parameters and needing approval and delegation approval', async () => {
      const leveragerInstance = newLeveragerInstance();

      const { decimalsSpy, isApprovedSpy, isDelegatedSpy } = setup(
        leveragerInstance,
        { isApproved: false, isDelegated: false },
      );

      const txs = await leveragerInstance.leverageDot(validArgs);

      const dlpTx = txs[2];

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(isDelegatedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();
      expect(txs).toHaveLength(3);
      expect(txs[0].txType).toBe(eEthereumTxType.ERC20_APPROVAL);
      expect(txs[1].txType).toBe(eEthereumTxType.DEBTERC20_APPROVAL);
      expect(dlpTx.txType).toBe(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await dlpTx.tx();
      expect(tx.to).toEqual(LEVERAGER);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.leverageDot].recommended,
        ),
      );

      const decoded = utils.defaultAbiCoder.decode(
        ['uint256', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(
        BigNumber.from(valueToWei(borrow_dot_amount, defaultDecimals)),
      );
      expect(decoded[1]).toEqual(
        BigNumber.from(valueToWei(repay_dot_amount, defaultDecimals)),
      );

      // gas price
      const gasPrice: GasType | null = await dlpTx.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.leverageDot].recommended,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });

    it('Expects the dlp tx object passing all parameters and not needing approval nor delegation', async () => {
      const leveragerInstance = newLeveragerInstance();

      const { decimalsSpy, isApprovedSpy, isDelegatedSpy } =
        setup(leveragerInstance);

      const txs = await leveragerInstance.leverageDot({
        ...validArgs,
      });
      const dlpTx = txs[2];

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(isDelegatedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      const tx: transactionType = await dlpTx.tx();
      expect(tx.to).toEqual(LEVERAGER);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.leverageDot].recommended,
        ),
      );
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
