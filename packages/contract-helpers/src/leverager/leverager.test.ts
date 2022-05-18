import { BigNumber, providers, utils } from 'ethers';
import {
  eEthereumTxType,
  GasType,
  InterestRate,
  ProtocolAction,
  transactionType,
} from '../commons/types';
import {
  API_ETH_MOCK_ADDRESS,
  gasLimitRecommendations,
  valueToWei,
} from '../commons/utils';
import { CloseParamsType, LoopParamsType } from './types';
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
    const amount = '1';
    const borrowRatio = '0.8';
    const borrowRatioAdjusted = '8000';
    const loopCount = '27';
    const interestRateMode = InterestRate.Variable;

    const defaultDecimals = 18;

    const validArgs: LoopParamsType = {
      user,
      reserve,
      debtToken,
      amount,
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
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.loop].recommended,
        ),
      );

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'uint256', 'uint256', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);
      expect(decoded[1]).toEqual(
        BigNumber.from(valueToWei(amount, defaultDecimals)),
      );
      // InterestRate.Variable
      expect(decoded[2]).toEqual(BigNumber.from('2'));
      expect(decoded[3]).toEqual(BigNumber.from(borrowRatioAdjusted));
      expect(decoded[4]).toEqual(BigNumber.from(loopCount));

      // gas price
      const gasPrice: GasType | null = await dlpTx.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.loop].recommended,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });

    it('if interestRade != Variable, coverted to 1 ', async () => {
      const leveragerInstance = newLeveragerInstance();

      const { decimalsSpy, isApprovedSpy, isDelegatedSpy } = setup(
        leveragerInstance,
        { isApproved: true, isDelegated: true },
      );

      const txs = await leveragerInstance.loop({
        ...validArgs,
        interestRateMode: InterestRate.None,
      });
      const dlpTx = txs[0];

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(isDelegatedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();
      expect(txs).toHaveLength(1);
      expect(dlpTx.txType).toBe(eEthereumTxType.DLP_ACTION);

      const tx = await dlpTx.tx();

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256', 'uint256', 'uint256', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );
      // InterestRate is not Variable
      expect(decoded[2]).toEqual(BigNumber.from('1'));
    });

    it('Expects the dlp tx object passing all parameters and not needing apporval nor delegation ', async () => {
      const leveragerInstance = newLeveragerInstance();

      const { decimalsSpy, isApprovedSpy, isDelegatedSpy } =
        setup(leveragerInstance);

      const txs = await leveragerInstance.loop({
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
          gasLimitRecommendations[ProtocolAction.loop].recommended,
        ),
      );
    });

    it('Call loopASTR on eth loop', async () => {
      const reserve = API_ETH_MOCK_ADDRESS;
      const leveragerInstance = newLeveragerInstance();

      const { decimalsSpy, isApprovedSpy, isDelegatedSpy } =
        setup(leveragerInstance);

      const txs = await leveragerInstance.loop({
        ...validArgs,
        reserve,
      });

      const dlpTx = txs[1];

      expect(isApprovedSpy).not.toHaveBeenCalled();
      expect(isDelegatedSpy).toHaveBeenCalled();
      expect(decimalsSpy).not.toHaveBeenCalled();

      const tx: transactionType = await dlpTx.tx();
      expect(tx.to).toEqual(LEVERAGER);
      expect(tx.from).toEqual(user);
      expect(tx.value).toEqual(
        utils.parseUnits(validArgs.amount, 'ether').toString(),
      );
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.loop].recommended,
        ),
      );
    });

    it('if interestRade != Variable, coverted to 1  on eth loop', async () => {
      const reserve = API_ETH_MOCK_ADDRESS;
      const leveragerInstance = newLeveragerInstance();

      setup(leveragerInstance, { isApproved: true, isDelegated: true });

      const txs = await leveragerInstance.loop({
        ...validArgs,
        reserve,
        interestRateMode: InterestRate.None,
      });
      const dlpTx = txs[0];

      const tx = await dlpTx.tx();

      const decoded = utils.defaultAbiCoder.decode(
        ['uint256', 'uint256', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );
      // InterestRate is not Variable
      expect(decoded[0]).toEqual(BigNumber.from('1'));
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
    it('return empty array if leverager address invalid', async () => {
      const reserve = API_ETH_MOCK_ADDRESS;
      const leveragerInstance = new Leverager(provider, invalidAddress);
      expect(
        leveragerInstance.loop({
          user,
          reserve,
          debtToken,
          amount,
          borrowRatio,
          loopCount,
          interestRateMode,
        }),
      ).toHaveLength(0);
    });
  });
  describe('loop', () => {
    const user = '0x0000000000000000000000000000000000000009';
    const reserve = '0x0000000000000000000000000000000000000010';
    const lToken = '0x0000000000000000000000000000000000000011';

    const validArgs: CloseParamsType = {
      user,
      reserve,
      lToken,
    };

    afterEach(() => {
      jest.clearAllMocks();
    });
    const setup = (
      instance: Leverager,
      params: {
        isApproved?: boolean;
      } = {},
    ) => {
      const isApprovedSpy = jest
        .spyOn(instance.erc20Service, 'isApproved')
        .mockImplementationOnce(async () =>
          Promise.resolve(Boolean(params.isApproved)),
        );
      return { isApprovedSpy };
    };

    it('Expects the 2 tx objects passing all parameters and needing approval and delegation approval', async () => {
      const leveragerInstance = newLeveragerInstance();

      const { isApprovedSpy } = setup(leveragerInstance, {
        isApproved: false,
      });

      const txs = await leveragerInstance.close(validArgs);

      const dlpTx = txs[1];

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(txs).toHaveLength(2);
      expect(txs[0].txType).toBe(eEthereumTxType.ERC20_APPROVAL);
      expect(dlpTx.txType).toBe(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await dlpTx.tx();
      expect(tx.to).toEqual(LEVERAGER);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.close].recommended,
        ),
      );

      const decoded = utils.defaultAbiCoder.decode(
        ['address'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(reserve);

      // gas price
      const gasPrice: GasType | null = await dlpTx.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.close].recommended,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });

    it('Expects the dlp tx object passing all parameters and not needing apporval nor delegation ', async () => {
      const leveragerInstance = newLeveragerInstance();

      const { isApprovedSpy } = setup(leveragerInstance, { isApproved: true });

      const txs = await leveragerInstance.close(validArgs);
      const dlpTx = txs[0];

      expect(isApprovedSpy).toHaveBeenCalled();

      const tx: transactionType = await dlpTx.tx();
      expect(tx.to).toEqual(LEVERAGER);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.close].recommended,
        ),
      );
    });
    it('return empty array if leverager address invalid', async () => {
      const invalidAddress = '0x0';
      const leveragerInstance = new Leverager(provider, invalidAddress);
      expect(leveragerInstance.close(validArgs)).toHaveLength(0);
    });
  });
});
