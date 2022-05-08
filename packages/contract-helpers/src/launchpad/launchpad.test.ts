import { BigNumber, providers, utils } from 'ethers';
import {
  eEthereumTxType,
  GasType,
  ProtocolAction,
  transactionType,
} from '../commons/types';
import { gasLimitRecommendations, valueToWei } from '../commons/utils';
import { BidParamsType, CancelParamsType, UpdateParamsType } from './types';
import { Launchpad } from './index';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('Leverager', () => {
  const provider = new providers.JsonRpcProvider();
  jest
    .spyOn(provider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));
  const LAUNCHPAD = '0x0000000000000000000000000000000000000001';

  const newLaunchPadInstance = () => new Launchpad(provider, LAUNCHPAD);

  describe('Initialization', () => {
    it('Expects to initialize correctly with all params', () => {
      const instance = newLaunchPadInstance();
      expect(instance instanceof Launchpad).toEqual(true);
    });
  });

  const user = '0x0000000000000000000000000000000000000009';
  const reserve = '0x0000000000000000000000000000000000000010';
  const amount = '1';
  const priceCap = '0.8';
  const cancelable = false;

  const defaultDecimals = 6;

  const invalidAddress = '0x0';
  const invalidAmount = '0';
  const invalidPriceCap = '-1';

  describe('bid', () => {
    const validArgs: BidParamsType = {
      user,
      reserve,
      amount,
      priceCap,
      cancelable,
    };
    afterEach(() => {
      jest.clearAllMocks();
    });
    const setup = (
      instance: Launchpad,
      params: {
        decimals?: number;
        isApproved?: boolean;
      } = {},
    ) => {
      const { decimals = defaultDecimals, isApproved = false } = params || {};
      const decimalsSpy = jest
        .spyOn(instance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const isApprovedSpy = jest
        .spyOn(instance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(isApproved));
      return { decimalsSpy, isApprovedSpy };
    };

    it('Expects the 2 tx objects passing all parameters and needing approval', async () => {
      const launchpadInstance = newLaunchPadInstance();

      const { decimalsSpy, isApprovedSpy } = setup(launchpadInstance);

      const txs = await launchpadInstance.bid(validArgs);

      const dlpTx = txs[1];

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();
      expect(txs).toHaveLength(2);
      expect(txs[0].txType).toBe(eEthereumTxType.ERC20_APPROVAL);
      expect(dlpTx.txType).toBe(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await dlpTx.tx();
      expect(tx.to).toEqual(LAUNCHPAD);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(gasLimitRecommendations[ProtocolAction.bid].recommended),
      );

      const decoded = utils.defaultAbiCoder.decode(
        ['uint256', 'uint256', 'bool'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(
        BigNumber.from(valueToWei(amount, defaultDecimals)),
      );
      expect(decoded[1]).toEqual(
        BigNumber.from(valueToWei(priceCap, defaultDecimals)),
      );
      expect(decoded[2]).toEqual(cancelable);

      // gas price
      const gasPrice: GasType | null = await dlpTx.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.bid].recommended,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });

    it('Expects the dlp tx object passing all parameters and not needing apporval', async () => {
      const launchpadInstance = newLaunchPadInstance();

      const { decimalsSpy, isApprovedSpy } = setup(launchpadInstance, {
        isApproved: true,
      });

      const txs = await launchpadInstance.bid({
        ...validArgs,
      });
      const dlpTx = txs[0];

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      const tx: transactionType = await dlpTx.tx();
      expect(tx.to).toEqual(LAUNCHPAD);
    });

    it('throw error if invalid user', async () => {
      const launchpadInstance = newLaunchPadInstance();
      await expect(async () =>
        launchpadInstance.bid({
          ...validArgs,
          user: invalidAddress,
        }),
      ).rejects.toThrowError(
        `Address: ${invalidAddress} is not a valid ethereum Address`,
      );
    });
    it('throw error if invalid reserve', async () => {
      const launchpadInstance = newLaunchPadInstance();
      await expect(async () =>
        launchpadInstance.bid({
          ...validArgs,
          reserve: invalidAddress,
        }),
      ).rejects.toThrowError(
        `Address: ${invalidAddress} is not a valid ethereum Address`,
      );
    });
    it('throw error if amount lte 0', async () => {
      const launchpadInstance = newLaunchPadInstance();
      await expect(async () =>
        launchpadInstance.bid({
          ...validArgs,
          amount: invalidAmount,
        }),
      ).rejects.toThrowError(
        `Amount: ${invalidAmount} needs to be greater than 0`,
      );
    });
    it('throw error if priceCap lt 0', async () => {
      const launchpadInstance = newLaunchPadInstance();
      await expect(async () =>
        launchpadInstance.bid({
          ...validArgs,
          priceCap: invalidPriceCap,
        }),
      ).rejects.toThrowError(
        `Amount: ${invalidPriceCap} needs to be greater or equal than 0`,
      );
    });
    it('return empty array if launchpad address invalid', async () => {
      const launchpadInstance = new Launchpad(provider, invalidAddress);
      expect(launchpadInstance.bid(validArgs)).toHaveLength(0);
    });
  });

  describe('update', () => {
    const validArgs: UpdateParamsType = {
      user,
      reserve,
      amount,
      priceCap,
    };
    afterEach(() => {
      jest.clearAllMocks();
    });
    const setup = (
      instance: Launchpad,
      params: {
        decimals?: number;
        isApproved?: boolean;
      } = {},
    ) => {
      const { decimals = defaultDecimals, isApproved = false } = params || {};
      const decimalsSpy = jest
        .spyOn(instance.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(decimals));
      const isApprovedSpy = jest
        .spyOn(instance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () => Promise.resolve(isApproved));
      return { decimalsSpy, isApprovedSpy };
    };

    it('Expects the 2 tx objects passing all parameters and needing approval', async () => {
      const launchpadInstance = newLaunchPadInstance();

      const { decimalsSpy, isApprovedSpy } = setup(launchpadInstance);

      const txs = await launchpadInstance.update(validArgs);

      const dlpTx = txs[1];

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();
      expect(txs).toHaveLength(2);
      expect(txs[0].txType).toBe(eEthereumTxType.ERC20_APPROVAL);
      expect(dlpTx.txType).toBe(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await dlpTx.tx();
      expect(tx.to).toEqual(LAUNCHPAD);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(gasLimitRecommendations[ProtocolAction.bid].recommended),
      );

      const decoded = utils.defaultAbiCoder.decode(
        ['uint256', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(
        BigNumber.from(valueToWei(amount, defaultDecimals)),
      );
      expect(decoded[1]).toEqual(
        BigNumber.from(valueToWei(priceCap, defaultDecimals)),
      );

      // gas price
      const gasPrice: GasType | null = await dlpTx.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.updateBid].recommended,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });

    it('Expects the dlp tx object passing all parameters and not needing apporval', async () => {
      const launchpadInstance = newLaunchPadInstance();

      const { decimalsSpy, isApprovedSpy } = setup(launchpadInstance, {
        isApproved: true,
      });

      const txs = await launchpadInstance.update({
        ...validArgs,
      });
      const dlpTx = txs[0];

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      const tx: transactionType = await dlpTx.tx();
      expect(tx.to).toEqual(LAUNCHPAD);
    });

    it('throw error if invalid user', async () => {
      const launchpadInstance = newLaunchPadInstance();
      await expect(async () =>
        launchpadInstance.update({
          ...validArgs,
          user: invalidAddress,
        }),
      ).rejects.toThrowError(
        `Address: ${invalidAddress} is not a valid ethereum Address`,
      );
    });
    it('throw error if invalid reserve', async () => {
      const launchpadInstance = newLaunchPadInstance();
      await expect(async () =>
        launchpadInstance.update({
          ...validArgs,
          reserve: invalidAddress,
        }),
      ).rejects.toThrowError(
        `Address: ${invalidAddress} is not a valid ethereum Address`,
      );
    });
    it('throw error if amount lte 0', async () => {
      const launchpadInstance = newLaunchPadInstance();
      await expect(async () =>
        launchpadInstance.update({
          ...validArgs,
          amount: invalidAmount,
        }),
      ).rejects.toThrowError(
        `Amount: ${invalidAmount} needs to be greater than 0`,
      );
    });
    it('throw error if priceCap lt 0', async () => {
      const launchpadInstance = newLaunchPadInstance();
      await expect(async () =>
        launchpadInstance.update({
          ...validArgs,
          priceCap: invalidPriceCap,
        }),
      ).rejects.toThrowError(
        `Amount: ${invalidPriceCap} needs to be greater or equal than 0`,
      );
    });
    it('return empty array if launchpad address invalid', async () => {
      const launchpadInstance = new Launchpad(provider, invalidAddress);
      expect(launchpadInstance.update(validArgs)).toHaveLength(0);
    });
  });

  describe('cancel', () => {
    const validArgs: CancelParamsType = { user };
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Expects the 1 tx objects', async () => {
      const launchpadInstance = newLaunchPadInstance();

      const txs = await launchpadInstance.cancel(validArgs);

      const dlpTx = txs[0];

      expect(txs).toHaveLength(1);
      expect(dlpTx.txType).toBe(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await dlpTx.tx();
      expect(tx.to).toEqual(LAUNCHPAD);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(gasLimitRecommendations[ProtocolAction.bid].recommended),
      );

      const decoded = utils.defaultAbiCoder.decode(
        [],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded).toHaveLength(0);

      // gas price
      const gasPrice: GasType | null = await dlpTx.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.cancelBid].recommended,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });

    it('throw error if invalid user', async () => {
      const launchpadInstance = newLaunchPadInstance();
      await expect(async () =>
        launchpadInstance.cancel({
          ...validArgs,
          user: invalidAddress,
        }),
      ).rejects.toThrowError(
        `Address: ${invalidAddress} is not a valid ethereum Address`,
      );
    });
    it('return empty array if launchpad address invalid', async () => {
      const launchpadInstance = new Launchpad(provider, invalidAddress);
      expect(launchpadInstance.cancel(validArgs)).toHaveLength(0);
    });
  });
});
