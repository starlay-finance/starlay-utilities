import { BigNumber, providers, utils } from 'ethers';
import {
  eEthereumTxType,
  GasType,
  ProtocolAction,
  transactionType,
} from '../commons/types';
import {
  API_ETH_MOCK_ADDRESS,
  gasLimitRecommendations,
  valueToWei,
} from '../commons/utils';
import { LoopParamsType } from './types';
import { Leverager } from './index';

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
  const LEVERAGER = '0x0000000000000000000000000000000000000001';

  const newLeveragerInstance = () => new Leverager(provider, LEVERAGER);

  describe('Initialization', () => {
    it('Expects to initialize correctly with all params', () => {
      const instance = newLeveragerInstance();
      expect(instance instanceof Leverager).toEqual(true);
    });
  });
  describe('loop', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const reserve = '0x0000000000000000000000000000000000000007';
    const debtToken = '0x0000000000000000000000000000000000000008';
    const onBehalfOf = '0x0000000000000000000000000000000000000009';
    const amount = '123.456';
    const borrowRatio = '0.8';
    const borrowRatioAdjusted = '8000';
    const loopCount = '40';
    const interestRateMode = '0';

    const defaultDecimals = 18;

    const validArgs: LoopParamsType = {
      user,
      reserve,
      debtToken,
      amount,
      onBehalfOf,
      borrowRatio,
      loopCount,
      interestRateMode,
    };

    const invalidAddress = '0x0';
    const invalidAmount = '0';

    afterEach(() => {
      jest.clearAllMocks();
    });
    const setup = (
      instance: Leverager,
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

      const txs = await leveragerInstance.loop(validArgs);

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
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'uint256', 'address', 'uint256', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(
        BigNumber.from(valueToWei(amount, defaultDecimals)),
      );
      expect(decoded[2]).toEqual(BigNumber.from(interestRateMode));
      expect(decoded[3]).toEqual(onBehalfOf);
      expect(decoded[4]).toEqual(BigNumber.from(borrowRatioAdjusted));
      expect(decoded[5]).toEqual(BigNumber.from(loopCount));

      // gas price
      const gasPrice: GasType | null = await dlpTx.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.loop].recommended,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });

    it('If omit onBehalfOf, the user is used as onBehalfOf', async () => {
      const leveragerInstance = newLeveragerInstance();

      const { decimalsSpy, isApprovedSpy, isDelegatedSpy } = setup(
        leveragerInstance,
        { isApproved: true, isDelegated: true },
      );

      const txs = await leveragerInstance.loop(validArgs);

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(isDelegatedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();
      expect(txs).toHaveLength(1);
      expect(txs[0].txType).toBe(eEthereumTxType.DLP_ACTION);
    });

    it('Expects the dlp tx object passing all parameters and not needing apporval nor delegation ', async () => {
      const leveragerInstance = newLeveragerInstance();

      const { decimalsSpy, isApprovedSpy, isDelegatedSpy } =
        setup(leveragerInstance);

      const txs = await leveragerInstance.loop({
        ...validArgs,
        onBehalfOf: undefined,
      });
      const dlpTx = txs[2];

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(isDelegatedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();

      const tx: transactionType = await dlpTx.tx();
      expect(tx.to).toEqual(LEVERAGER);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'uint256', 'address', 'uint256', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );
      expect(decoded[3]).toEqual(user);
    });

    it('throw error if invalid user', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.loop({
          ...validArgs,
          user: invalidAddress,
        }),
      ).rejects.toThrowError(
        `Address: ${invalidAddress} is not a valid ethereum Address`,
      );
    });
    it('throw error if invalid reserve', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.loop({
          ...validArgs,
          reserve: invalidAddress,
        }),
      ).rejects.toThrowError(
        `Address: ${invalidAddress} is not a valid ethereum Address`,
      );
    });
    it('throw error if invalid debtToken', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.loop({
          ...validArgs,
          debtToken: invalidAddress,
        }),
      ).rejects.toThrowError(
        `Address: ${invalidAddress} is not a valid ethereum Address`,
      );
    });
    it('throw error if amount lte 0', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.loop({
          ...validArgs,
          amount: invalidAmount,
        }),
      ).rejects.toThrowError(
        `Amount: ${invalidAmount} needs to be greater than 0`,
      );
    });
    it('throw error if invalid onBehalfOf', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.loop({
          ...validArgs,
          onBehalfOf: invalidAddress,
        }),
      ).rejects.toThrowError(
        `Address: ${invalidAddress} is not a valid ethereum Address`,
      );
    });
    it('throw error if borrowRatio lte 0', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.loop({
          ...validArgs,
          amount: invalidAmount,
        }),
      ).rejects.toThrowError(
        `Amount: ${invalidAmount} needs to be greater than 0`,
      );
    });
    it('throw error if loopCount lte 0', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.loop({
          ...validArgs,
          amount: invalidAmount,
        }),
      ).rejects.toThrowError(
        `Amount: ${invalidAmount} needs to be greater than 0`,
      );
    });
    it('throw error on eth loop', async () => {
      const reserve = API_ETH_MOCK_ADDRESS;
      const leveragerInstance = newLeveragerInstance();
      await expect(
        leveragerInstance.loop({
          user,
          reserve,
          debtToken,
          amount,
          onBehalfOf,
          borrowRatio,
          loopCount,
          interestRateMode,
        }),
      ).rejects.toThrowError(
        `Looping native asset has not been supported yet.`,
      );
    });
    it('return empty array if leverager address invalid', async () => {
      const reserve = API_ETH_MOCK_ADDRESS;
      const leveragerInstance = new Leverager(provider, invalidAddress);
      expect(
        leveragerInstance.loop({
          user,
          reserve,
          debtToken,
          amount,
          onBehalfOf,
          borrowRatio,
          loopCount,
          interestRateMode,
        }),
      ).toHaveLength(0);
    });
  });
});
