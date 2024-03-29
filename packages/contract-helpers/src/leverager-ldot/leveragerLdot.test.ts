import { BigNumber, providers, utils } from 'ethers';
import {
  eEthereumTxType,
  GasType,
  ProtocolAction,
  transactionType,
} from '../commons/types';
import { gasLimitRecommendations, valueToWei } from '../commons/utils';
import { LeveragerLdot as LeveragerLdotType } from './typechain/LeveragerLdot';
import { LeveragerLdot__factory } from './typechain/LeveragerLdot__factory';
import {
  CloseLeverageDotParamsType,
  LeverageDotFromPositionParamsType,
  LeverageDotParamsType,
  LeverageLdotFromPositionParamsType,
  LeverageLdotParamsType,
} from './types';
import { ILeveragerLdotInterface, LeveragerLdot } from './index';

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
  const BALANCE_PROVIDER = '0x0000000000000000000000000000000000000002';

  const newLeveragerInstance = () =>
    new LeveragerLdot(provider, LEVERAGER, BALANCE_PROVIDER);

  describe('Initialization', () => {
    it('Expects to initialize correctly with all params', () => {
      const instance = newLeveragerInstance();
      expect(instance instanceof LeveragerLdot).toEqual(true);
    });
  });

  describe('leverageDot', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const dotAddress = '0x0000000000000000000000000000000000000007';
    const leverage = '2';
    const repayAmountInDot = '10';

    const defaultDecimals = 18;

    const validArgs: LeverageDotParamsType = {
      user,
      dotAddress,
      leverage,
      repayAmountInDot,
    };

    const invalidAddress = '0x0';
    const invalidAmount = '0';
    const invalidLeverage = '0';

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
      const getVariableDebtTokenSpy = jest
        .spyOn(instance, 'getVariableDebtToken')
        .mockImplementationOnce(async () => Promise.resolve(dotAddress));
      return {
        decimalsSpy,
        isApprovedSpy,
        isDelegatedSpy,
        getVariableDebtTokenSpy,
      };
    };

    it('Expects the 3 tx objects passing all parameters and needing approval and delegation approval', async () => {
      const leveragerInstance = newLeveragerInstance();

      const {
        decimalsSpy,
        isApprovedSpy,
        isDelegatedSpy,
        getVariableDebtTokenSpy,
      } = setup(leveragerInstance, { isApproved: false, isDelegated: false });

      const txs = await leveragerInstance.leverageDot(validArgs);

      const dlpTx = txs[2];

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(isDelegatedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();
      expect(getVariableDebtTokenSpy).toHaveBeenCalled();

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
        BigNumber.from(
          valueToWei(
            (Number(repayAmountInDot) * Number(leverage)).toString(),
            defaultDecimals,
          ),
        ),
      );
      expect(decoded[1]).toEqual(
        BigNumber.from(valueToWei(repayAmountInDot, defaultDecimals)),
      );

      // gas price
      const gasPrice: GasType | null = await dlpTx.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.leverageDot].recommended,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });

    it('Expects the dlp tx object passing all parameters and not needing approval', async () => {
      const leveragerInstance = newLeveragerInstance();

      const {
        decimalsSpy,
        isApprovedSpy,
        isDelegatedSpy,
        getVariableDebtTokenSpy,
      } = setup(leveragerInstance, {
        isApproved: false,
        isDelegated: false,
      });

      const txs = await leveragerInstance.leverageDot({
        ...validArgs,
      });
      const dlpTx = txs[2];

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(isDelegatedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();
      expect(getVariableDebtTokenSpy).toHaveBeenCalled();

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
          dotAddress: invalidAddress,
        }),
      ).rejects.toThrowError(
        `Address: ${invalidAddress} is not a valid ethereum Address`,
      );
    });
    it('throw error if leverage lte 0', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.leverageDot({
          ...validArgs,
          leverage: invalidLeverage,
        }),
      ).rejects.toThrowError(
        `Amount: ${invalidLeverage} needs to be greater than 0`,
      );
    });
    it('throw error if repayAmountInDot lte 0', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.leverageDot({
          ...validArgs,
          repayAmountInDot: invalidAmount,
        }),
      ).rejects.toThrowError(
        `Amount: ${invalidAmount} needs to be greater than 0`,
      );
    });
    it('return empty array if leverager address invalid', async () => {
      const leveragerInstance = new LeveragerLdot(
        provider,
        invalidAddress,
        dotAddress,
      );
      expect(
        leveragerInstance.leverageDot({
          user,
          dotAddress,
          leverage,
          repayAmountInDot,
        }),
      ).toHaveLength(0);
    });
  });

  describe('leverageDotFromPosition', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const dotAddress = '0x0000000000000000000000000000000000000007';
    const leverage = '2';
    const supplyAmountInDot = '10';

    const defaultDecimals = 18;

    const validArgs: LeverageDotFromPositionParamsType = {
      user,
      dotAddress,
      leverage,
      supplyAmountInDot,
    };

    const invalidAddress = '0x0';
    const invalidAmount = '0';
    const invalidLeverage = '0';

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
      const getVariableDebtTokenSpy = jest
        .spyOn(instance, 'getVariableDebtToken')
        .mockImplementationOnce(async () => Promise.resolve(dotAddress));
      const getlTokenSpy = jest
        .spyOn(instance, 'getLToken')
        .mockImplementationOnce(async () => Promise.resolve(dotAddress));
      return {
        decimalsSpy,
        isApprovedSpy,
        isDelegatedSpy,
        getVariableDebtTokenSpy,
        getlTokenSpy,
      };
    };

    it('Expects the 3 tx objects passing all parameters and needing approval and delegation approval', async () => {
      const leveragerInstance = newLeveragerInstance();

      const {
        decimalsSpy,
        isApprovedSpy,
        isDelegatedSpy,
        getVariableDebtTokenSpy,
        getlTokenSpy,
      } = setup(leveragerInstance, { isApproved: false, isDelegated: false });

      const txs = await leveragerInstance.leverageDotFromPosition(validArgs);

      const dlpTx = txs[2];

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(isDelegatedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();
      expect(getVariableDebtTokenSpy).toHaveBeenCalled();
      expect(getlTokenSpy).toHaveBeenCalled();

      expect(txs).toHaveLength(3);
      expect(txs[0].txType).toBe(eEthereumTxType.ERC20_APPROVAL);
      expect(txs[1].txType).toBe(eEthereumTxType.DEBTERC20_APPROVAL);
      expect(dlpTx.txType).toBe(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await dlpTx.tx();
      expect(tx.to).toEqual(LEVERAGER);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.leverageDotFromPosition]
            .recommended,
        ),
      );

      const decoded = utils.defaultAbiCoder.decode(
        ['uint256', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(
        BigNumber.from(
          valueToWei(
            (Number(supplyAmountInDot) * Number(leverage)).toString(),
            defaultDecimals,
          ),
        ),
      );
      expect(decoded[1]).toEqual(
        BigNumber.from(valueToWei(supplyAmountInDot, defaultDecimals)),
      );

      // gas price
      const gasPrice: GasType | null = await dlpTx.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.leverageDotFromPosition]
          .recommended,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });

    it('Expects the dlp tx object passing all parameters and not needing approval nor delegation', async () => {
      const leveragerInstance = newLeveragerInstance();

      const {
        decimalsSpy,
        isApprovedSpy,
        isDelegatedSpy,
        getVariableDebtTokenSpy,
      } = setup(leveragerInstance, {
        isApproved: false,
        isDelegated: false,
      });

      const txs = await leveragerInstance.leverageDotFromPosition({
        ...validArgs,
      });
      const dlpTx = txs[2];

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(isDelegatedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();
      expect(getVariableDebtTokenSpy).toHaveBeenCalled();

      const tx: transactionType = await dlpTx.tx();
      expect(tx.to).toEqual(LEVERAGER);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.leverageDotFromPosition]
            .recommended,
        ),
      );
    });
    it('throw error if invalid user', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.leverageDotFromPosition({
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
        leveragerInstance.leverageDotFromPosition({
          ...validArgs,
          dotAddress: invalidAddress,
        }),
      ).rejects.toThrowError(
        `Address: ${invalidAddress} is not a valid ethereum Address`,
      );
    });
    it('throw error if leverage lte 0', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.leverageDotFromPosition({
          ...validArgs,
          leverage: invalidLeverage,
        }),
      ).rejects.toThrowError(
        `Amount: ${invalidLeverage} needs to be greater than 0`,
      );
    });
    it('throw error if supplyAmountInDot lte 0', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.leverageDotFromPosition({
          ...validArgs,
          supplyAmountInDot: invalidAmount,
        }),
      ).rejects.toThrowError(
        `Amount: ${invalidAmount} needs to be greater than 0`,
      );
    });
    it('return empty array if leverager address invalid', async () => {
      const leveragerInstance = new LeveragerLdot(
        provider,
        invalidAddress,
        dotAddress,
      );
      expect(
        leveragerInstance.leverageDotFromPosition({
          user,
          dotAddress,
          leverage,
          supplyAmountInDot,
        }),
      ).toHaveLength(0);
    });
  });

  describe('leverageLdot', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const dotAddress = '0x0000000000000000000000000000000000000007';
    const ldotAddress = '0x0000000000000000000000000000000000000008';
    const leverage = '2';
    const repayAmountInLdot = '10';

    const defaultDecimals = 18;

    const validArgs: LeverageLdotParamsType = {
      user,
      dotAddress,
      ldotAddress,
      leverage,
      repayAmountInLdot,
    };

    const invalidAddress = '0x0';
    const invalidAmount = '0';
    const invalidLeverage = '0';

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
      const getVariableDebtTokenSpy = jest
        .spyOn(instance, 'getVariableDebtToken')
        .mockImplementationOnce(async () => Promise.resolve(dotAddress));
      return {
        decimalsSpy,
        isApprovedSpy,
        isDelegatedSpy,
        getVariableDebtTokenSpy,
      };
    };

    it('Expects the 3 tx objects passing all parameters and needing approval and delegation approval', async () => {
      const leveragerInstance = newLeveragerInstance();

      const {
        decimalsSpy,
        isApprovedSpy,
        isDelegatedSpy,
        getVariableDebtTokenSpy,
      } = setup(leveragerInstance, { isApproved: false, isDelegated: false });

      const txs = await leveragerInstance.leverageLdot(validArgs);

      const dlpTx = txs[2];

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(isDelegatedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();
      expect(getVariableDebtTokenSpy).toHaveBeenCalled();

      expect(txs).toHaveLength(3);
      expect(txs[0].txType).toBe(eEthereumTxType.ERC20_APPROVAL);
      expect(txs[1].txType).toBe(eEthereumTxType.DEBTERC20_APPROVAL);
      expect(dlpTx.txType).toBe(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await dlpTx.tx();
      expect(tx.to).toEqual(LEVERAGER);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.leverageLdot].recommended,
        ),
      );

      const decoded = utils.defaultAbiCoder.decode(
        ['uint256', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(
        BigNumber.from(
          valueToWei(
            (Number(repayAmountInLdot) * (Number(leverage) - 1)).toString(),
            defaultDecimals,
          ),
        ),
      );
      expect(decoded[1]).toEqual(
        BigNumber.from(valueToWei(repayAmountInLdot, defaultDecimals)),
      );

      // gas price
      const gasPrice: GasType | null = await dlpTx.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.leverageLdot].recommended,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });

    it('Expects the dlp tx object passing all parameters and not needing approval', async () => {
      const leveragerInstance = newLeveragerInstance();

      const {
        decimalsSpy,
        isApprovedSpy,
        isDelegatedSpy,
        getVariableDebtTokenSpy,
      } = setup(leveragerInstance, {
        isApproved: false,
        isDelegated: false,
      });

      const txs = await leveragerInstance.leverageLdot({
        ...validArgs,
      });
      const dlpTx = txs[2];

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(isDelegatedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();
      expect(getVariableDebtTokenSpy).toHaveBeenCalled();

      const tx: transactionType = await dlpTx.tx();
      expect(tx.to).toEqual(LEVERAGER);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.leverageLdot].recommended,
        ),
      );
    });
    it('throw error if invalid user', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.leverageLdot({
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
        leveragerInstance.leverageLdot({
          ...validArgs,
          dotAddress: invalidAddress,
        }),
      ).rejects.toThrowError(
        `Address: ${invalidAddress} is not a valid ethereum Address`,
      );
    });
    it('throw error if leverage lte 0', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.leverageLdot({
          ...validArgs,
          leverage: invalidLeverage,
        }),
      ).rejects.toThrowError(
        `Amount: ${invalidLeverage} needs to be greater than 0`,
      );
    });
    it('throw error if repayAmountInLdot lte 0', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.leverageLdot({
          ...validArgs,
          repayAmountInLdot: invalidAmount,
        }),
      ).rejects.toThrowError(
        `Amount: ${invalidAmount} needs to be greater than 0`,
      );
    });
    it('return empty array if leverager address invalid', async () => {
      const leveragerInstance = new LeveragerLdot(
        provider,
        invalidAddress,
        dotAddress,
      );
      expect(
        leveragerInstance.leverageLdot({
          user,
          dotAddress,
          ldotAddress,
          leverage,
          repayAmountInLdot,
        }),
      ).toHaveLength(0);
    });
  });

  describe('leverageLdotFromPosition', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const dotAddress = '0x0000000000000000000000000000000000000007';
    const ldotAddress = '0x0000000000000000000000000000000000000008';
    const leverage = '2';
    const supplyAmountInLdot = '10';

    const defaultDecimals = 18;

    const validArgs: LeverageLdotFromPositionParamsType = {
      user,
      dotAddress,
      ldotAddress,
      leverage,
      supplyAmountInLdot,
    };

    const invalidAddress = '0x0';
    const invalidAmount = '0';
    const invalidLeverage = '0';

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
      const getVariableDebtTokenSpy = jest
        .spyOn(instance, 'getVariableDebtToken')
        .mockImplementationOnce(async () => Promise.resolve(dotAddress));
      const getlTokenSpy = jest
        .spyOn(instance, 'getLToken')
        .mockImplementationOnce(async () => Promise.resolve(ldotAddress));
      return {
        decimalsSpy,
        isApprovedSpy,
        isDelegatedSpy,
        getVariableDebtTokenSpy,
        getlTokenSpy,
      };
    };

    it('Expects the 3 tx objects passing all parameters and needing approval and delegation approval', async () => {
      const leveragerInstance = newLeveragerInstance();

      const {
        decimalsSpy,
        isApprovedSpy,
        isDelegatedSpy,
        getVariableDebtTokenSpy,
        getlTokenSpy,
      } = setup(leveragerInstance, { isApproved: false, isDelegated: false });

      const txs = await leveragerInstance.leverageLdotFromPosition(validArgs);

      const dlpTx = txs[2];

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(isDelegatedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();
      expect(getVariableDebtTokenSpy).toHaveBeenCalled();
      expect(getlTokenSpy).toHaveBeenCalled();

      expect(txs).toHaveLength(3);
      expect(txs[0].txType).toBe(eEthereumTxType.ERC20_APPROVAL);
      expect(txs[1].txType).toBe(eEthereumTxType.DEBTERC20_APPROVAL);
      expect(dlpTx.txType).toBe(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await dlpTx.tx();
      expect(tx.to).toEqual(LEVERAGER);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.leverageLdotFromPosition]
            .recommended,
        ),
      );

      const decoded = utils.defaultAbiCoder.decode(
        ['uint256', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(
        BigNumber.from(
          valueToWei(
            (Number(supplyAmountInLdot) * (Number(leverage) - 1)).toString(),
            defaultDecimals,
          ),
        ),
      );
      expect(decoded[1]).toEqual(
        BigNumber.from(valueToWei(supplyAmountInLdot, defaultDecimals)),
      );

      // gas price
      const gasPrice: GasType | null = await dlpTx.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual(
        gasLimitRecommendations[ProtocolAction.leverageLdotFromPosition]
          .recommended,
      );
      expect(gasPrice?.gasPrice).toEqual('1');
    });

    it('Expects the dlp tx object passing all parameters and not needing approval nor delegation', async () => {
      const leveragerInstance = newLeveragerInstance();

      const {
        decimalsSpy,
        isApprovedSpy,
        isDelegatedSpy,
        getVariableDebtTokenSpy,
      } = setup(leveragerInstance, {
        isApproved: false,
        isDelegated: false,
      });

      const txs = await leveragerInstance.leverageLdotFromPosition({
        ...validArgs,
      });
      const dlpTx = txs[2];

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(isDelegatedSpy).toHaveBeenCalled();
      expect(decimalsSpy).toHaveBeenCalled();
      expect(getVariableDebtTokenSpy).toHaveBeenCalled();

      const tx: transactionType = await dlpTx.tx();
      expect(tx.to).toEqual(LEVERAGER);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.leverageLdotFromPosition]
            .recommended,
        ),
      );
    });
    it('throw error if invalid user', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.leverageLdotFromPosition({
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
        leveragerInstance.leverageLdotFromPosition({
          ...validArgs,
          dotAddress: invalidAddress,
        }),
      ).rejects.toThrowError(
        `Address: ${invalidAddress} is not a valid ethereum Address`,
      );
    });
    it('throw error if leverage lte 0', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.leverageLdotFromPosition({
          ...validArgs,
          leverage: invalidLeverage,
        }),
      ).rejects.toThrowError(
        `Amount: ${invalidLeverage} needs to be greater than 0`,
      );
    });
    it('throw error if supplyAmountInLdot lte 0', async () => {
      const leveragerInstance = newLeveragerInstance();
      await expect(async () =>
        leveragerInstance.leverageLdotFromPosition({
          ...validArgs,
          supplyAmountInLdot: invalidAmount,
        }),
      ).rejects.toThrowError(
        `Amount: ${invalidAmount} needs to be greater than 0`,
      );
    });
    it('return empty array if leverager address invalid', async () => {
      const leveragerInstance = new LeveragerLdot(
        provider,
        invalidAddress,
        dotAddress,
      );
      expect(
        leveragerInstance.leverageLdotFromPosition({
          user,
          dotAddress,
          ldotAddress,
          leverage,
          supplyAmountInLdot,
        }),
      ).toHaveLength(0);
    });
  });

  describe('closeLeverageDOT', () => {
    const user = '0x0000000000000000000000000000000000000006';
    const token = '0x0000000000000000000000000000000000000007';

    const validArgs: CloseLeverageDotParamsType = {
      user,
      dotAddress: token,
      ldotAddress: token,
    };

    const invalidAddress = '0x0';

    afterEach(() => {
      jest.clearAllMocks();
    });
    const setup = (
      instance: LeveragerLdot,
      params: {
        isApproved?: boolean;
      } = {},
    ) => {
      const { isApproved = false } = params || {};

      const isApprovedSpy = jest
        .spyOn(instance.erc20Service, 'isApproved')
        .mockImplementation(async () => Promise.resolve(isApproved));
      const getVariableDebtTokenSpy = jest
        .spyOn(instance, 'getVariableDebtToken')
        .mockImplementation(async () => Promise.resolve(token));
      const getlTokenSpy = jest
        .spyOn(instance, 'getLToken')
        .mockImplementation(async () => Promise.resolve(token));
      const balanceOfSpy = jest
        .spyOn(instance.walletBalanceProvider, 'balanceOf')
        .mockImplementation(async () => Promise.resolve(BigNumber.from(5000)));

      return {
        isApprovedSpy,
        getlTokenSpy,
        getVariableDebtTokenSpy,
        balanceOfSpy,
      };
    };

    it('Expects the 3 tx objects passing all parameters and needing approval and delegation approval', async () => {
      const leveragerInstance = newLeveragerInstance();

      const {
        isApprovedSpy,
        getlTokenSpy,
        balanceOfSpy,
        getVariableDebtTokenSpy,
      } = setup(leveragerInstance, { isApproved: false });

      const txs = await leveragerInstance.closeLeverageDOT(validArgs);

      const dlpTx = txs[2];

      expect(isApprovedSpy).toHaveBeenCalled();
      expect(getlTokenSpy).toHaveBeenCalled();
      expect(getVariableDebtTokenSpy).toHaveBeenCalled();
      expect(balanceOfSpy).toHaveBeenCalled();

      expect(txs).toHaveLength(3);
      expect(txs[0].txType).toBe(eEthereumTxType.ERC20_APPROVAL);
      expect(txs[1].txType).toBe(eEthereumTxType.ERC20_APPROVAL);
      expect(dlpTx.txType).toBe(eEthereumTxType.DLP_ACTION);

      const tx: transactionType = await dlpTx.tx();
      expect(tx.to).toEqual(LEVERAGER);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(
        BigNumber.from(
          gasLimitRecommendations[ProtocolAction.leverageDot].recommended,
        ),
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

      const { isApprovedSpy, getlTokenSpy, getVariableDebtTokenSpy } = setup(
        leveragerInstance,
        {
          isApproved: true,
        },
      );

      const txs = await leveragerInstance.closeLeverageDOT(validArgs);
      const dlpTx = txs[0];

      expect(txs).toHaveLength(1);
      expect(isApprovedSpy).toHaveBeenCalled();
      expect(getlTokenSpy).toHaveBeenCalled();
      expect(getVariableDebtTokenSpy).toHaveBeenCalled();

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
        leveragerInstance.closeLeverageDOT({
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
        leveragerInstance.closeLeverageDOT({
          ...validArgs,
          ldotAddress: invalidAddress,
        }),
      ).rejects.toThrowError(
        `Address: ${invalidAddress} is not a valid ethereum Address`,
      );
    });
    it('return empty array if debt amount is zero', async () => {
      const leveragerInstance = newLeveragerInstance();

      jest
        .spyOn(leveragerInstance.erc20Service, 'isApproved')
        .mockImplementation(async () => Promise.resolve(true));
      jest
        .spyOn(leveragerInstance, 'getVariableDebtToken')
        .mockImplementation(async () => Promise.resolve(token));
      jest
        .spyOn(leveragerInstance, 'getLToken')
        .mockImplementation(async () => Promise.resolve(token));
      jest
        .spyOn(leveragerInstance.walletBalanceProvider, 'balanceOf')
        .mockImplementation(async () => Promise.resolve(BigNumber.from(0)));

      await expect(async () =>
        leveragerInstance.closeLeverageDOT(validArgs),
      ).rejects.toThrowError(`INVALID_DEBT_AMOUNT`);
    });

    it('return empty array if deposit amount is zero', async () => {
      const leveragerInstance = newLeveragerInstance();

      jest
        .spyOn(leveragerInstance.erc20Service, 'isApproved')
        .mockImplementation(async () => Promise.resolve(true));
      jest
        .spyOn(leveragerInstance, 'getVariableDebtToken')
        .mockImplementation(async () => Promise.resolve(token));
      jest
        .spyOn(leveragerInstance, 'getLToken')
        .mockImplementation(async () => Promise.resolve(token));
      jest
        .spyOn(leveragerInstance.walletBalanceProvider, 'balanceOf')
        .mockImplementationOnce(async () =>
          Promise.resolve(BigNumber.from(500)),
        );
      jest
        .spyOn(leveragerInstance.walletBalanceProvider, 'balanceOf')
        .mockImplementationOnce(async () => Promise.resolve(BigNumber.from(0)));

      await expect(async () =>
        leveragerInstance.closeLeverageDOT(validArgs),
      ).rejects.toThrowError(`INVALID_DEPOSIT_AMOUNT`);
    });
  });

  describe('getVariableDebtToken', () => {
    const address = '0x0000000000000000000000000000000000000001';
    const leverager: ILeveragerLdotInterface = newLeveragerInstance();
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Expect to get the variable Debt address same to the leverager address.', async () => {
      jest.spyOn(LeveragerLdot__factory, 'connect').mockReturnValue({
        getReserveData: async () =>
          Promise.resolve({
            configuration: {
              data: BigNumber.from(0),
            },
            liquidityIndex: BigNumber.from(0),
            variableBorrowIndex: BigNumber.from(0),
            currentLiquidityRate: BigNumber.from(0),
            currentVariableBorrowRate: BigNumber.from(0),
            currentStableBorrowRate: BigNumber.from(0),
            lastUpdateTimestamp: 0,
            lTokenAddress: 'string',
            stableDebtTokenAddress: 'string',
            variableDebtTokenAddress: address,
            interestRateStrategyAddress: 'string',
            id: 0,
          }),
      } as unknown as LeveragerLdotType);

      const variablesToken = await leverager.getVariableDebtToken(address);

      expect(variablesToken).toEqual(address);
    });
  });

  describe('getLToken', () => {
    const address = '0x0000000000000000000000000000000000000001';
    const leverager: ILeveragerLdotInterface = newLeveragerInstance();
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Expect to get the variable Debt address same to the leverager address.', async () => {
      jest.spyOn(LeveragerLdot__factory, 'connect').mockReturnValue({
        getReserveData: async () =>
          Promise.resolve({
            configuration: {
              data: BigNumber.from(0),
            },
            liquidityIndex: BigNumber.from(0),
            variableBorrowIndex: BigNumber.from(0),
            currentLiquidityRate: BigNumber.from(0),
            currentVariableBorrowRate: BigNumber.from(0),
            currentStableBorrowRate: BigNumber.from(0),
            lastUpdateTimestamp: 0,
            lTokenAddress: address,
            stableDebtTokenAddress: 'string',
            variableDebtTokenAddress: address,
            interestRateStrategyAddress: 'string',
            id: 0,
          }),
      } as unknown as LeveragerLdotType);

      const variablesToken = await leverager.getLToken(address);

      expect(variablesToken).toEqual(address);
    });
  });

  describe('getStatusAfterLeverageDotTransaction', () => {
    const address = '0x0000000000000000000000000000000000000001';
    const leverager: LeveragerLdot = newLeveragerInstance();
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Expect to get the user status after transaction.', async () => {
      jest.spyOn(LeveragerLdot__factory, 'connect').mockReturnValue({
        getStatusAfterLeverageDotTransaction: async () =>
          Promise.resolve({
            totalCollateralAfterTx: 'totalCollateralAfterTx',
            totalDebtAfterTx: 'totalDebtAfterTx',
            totalCollateralInDotAfterTx: 'totalCollateralInDotAfterTx',
            totalDebtInDotAfterTx: 'totalDebtInDotAfterTx',
            healthFactorAfterTx: 'healthFactorAfterTx',
          }),
      } as unknown as LeveragerLdotType);

      jest
        .spyOn(leverager.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(10));

      const status = await leverager.getStatusAfterLeverageDotTransaction({
        user: address,
        dotAddress: address,
        leverage: '2',
        repayAmountInDot: '10',
      });

      expect(status.healthFactorAfterTx).toEqual('healthFactorAfterTx');
      expect(status.totalCollateralAfterTx).toEqual('totalCollateralAfterTx');
      expect(status.totalDebtAfterTx).toEqual('totalDebtAfterTx');
      expect(status.totalCollateralInDotAfterTx).toEqual(
        'totalCollateralInDotAfterTx',
      );
      expect(status.totalDebtInDotAfterTx).toEqual('totalDebtInDotAfterTx');
    });
  });

  describe('getStatusAfterLeverageDotFromPositionTransaction', () => {
    const address = '0x0000000000000000000000000000000000000001';
    const leverager: LeveragerLdot = newLeveragerInstance();
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Expect to get the user status after transaction.', async () => {
      jest.spyOn(LeveragerLdot__factory, 'connect').mockReturnValue({
        getStatusAfterLeverageDotFromPositionTransaction: async () =>
          Promise.resolve({
            totalCollateralAfterTx: 'totalCollateralAfterTx',
            totalDebtAfterTx: 'totalDebtAfterTx',
            totalCollateralInDotAfterTx: 'totalCollateralInDotAfterTx',
            totalDebtInDotAfterTx: 'totalDebtInDotAfterTx',
            healthFactorAfterTx: 'healthFactorAfterTx',
          }),
      } as unknown as LeveragerLdotType);

      jest
        .spyOn(leverager.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(10));

      const status =
        await leverager.getStatusAfterLeverageDotFromPositionTransaction({
          user: address,
          dotAddress: address,
          leverage: '2',
          supplyAmountInDot: '10',
        });

      expect(status.healthFactorAfterTx).toEqual('healthFactorAfterTx');
      expect(status.totalCollateralAfterTx).toEqual('totalCollateralAfterTx');
      expect(status.totalDebtAfterTx).toEqual('totalDebtAfterTx');
      expect(status.totalCollateralInDotAfterTx).toEqual(
        'totalCollateralInDotAfterTx',
      );
      expect(status.totalDebtInDotAfterTx).toEqual('totalDebtInDotAfterTx');
    });
  });

  describe('getStatusAfterLeverageLdotTransaction', () => {
    const address = '0x0000000000000000000000000000000000000001';
    const leverager: LeveragerLdot = newLeveragerInstance();
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Expect to get the user status after transaction.', async () => {
      jest.spyOn(LeveragerLdot__factory, 'connect').mockReturnValue({
        getStatusAfterLeverageLdotTransaction: async () =>
          Promise.resolve({
            totalCollateralAfterTx: 'totalCollateralAfterTx',
            totalDebtAfterTx: 'totalDebtAfterTx',
            totalCollateralInDotAfterTx: 'totalCollateralInDotAfterTx',
            totalDebtInDotAfterTx: 'totalDebtInDotAfterTx',
            healthFactorAfterTx: 'healthFactorAfterTx',
          }),
      } as unknown as LeveragerLdotType);

      jest
        .spyOn(leverager.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(10));

      const status = await leverager.getStatusAfterLeverageLdotTransaction({
        user: address,
        dotAddress: address,
        ldotAddress: address,
        leverage: '2',
        repayAmountInLdot: '10',
      });

      expect(status.healthFactorAfterTx).toEqual('healthFactorAfterTx');
      expect(status.totalCollateralAfterTx).toEqual('totalCollateralAfterTx');
      expect(status.totalDebtAfterTx).toEqual('totalDebtAfterTx');
      expect(status.totalCollateralInDotAfterTx).toEqual(
        'totalCollateralInDotAfterTx',
      );
      expect(status.totalDebtInDotAfterTx).toEqual('totalDebtInDotAfterTx');
    });
  });

  describe('getStatusAfterLeverageLdotFromPositionTransaction', () => {
    const address = '0x0000000000000000000000000000000000000001';
    const leverager: LeveragerLdot = newLeveragerInstance();
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Expect to get the user status after transaction.', async () => {
      jest.spyOn(LeveragerLdot__factory, 'connect').mockReturnValue({
        getStatusAfterLeverageLdotFromPositionTransaction: async () =>
          Promise.resolve({
            totalCollateralAfterTx: 'totalCollateralAfterTx',
            totalDebtAfterTx: 'totalDebtAfterTx',
            totalCollateralInDotAfterTx: 'totalCollateralInDotAfterTx',
            totalDebtInDotAfterTx: 'totalDebtInDotAfterTx',
            healthFactorAfterTx: 'healthFactorAfterTx',
          }),
      } as unknown as LeveragerLdotType);

      jest
        .spyOn(leverager.erc20Service, 'decimalsOf')
        .mockReturnValueOnce(Promise.resolve(10));

      const status =
        await leverager.getStatusAfterLeverageLdotFromPositionTransaction({
          user: address,
          dotAddress: address,
          ldotAddress: address,
          leverage: '2',
          supplyAmountInLdot: '10',
        });

      expect(status.healthFactorAfterTx).toEqual('healthFactorAfterTx');
      expect(status.totalCollateralAfterTx).toEqual('totalCollateralAfterTx');
      expect(status.totalDebtAfterTx).toEqual('totalDebtAfterTx');
      expect(status.totalCollateralInDotAfterTx).toEqual(
        'totalCollateralInDotAfterTx',
      );
      expect(status.totalDebtInDotAfterTx).toEqual('totalDebtInDotAfterTx');
    });
  });

  describe('ltv', () => {
    const address = '0x0000000000000000000000000000000000000001';
    const leverager: LeveragerLdot = newLeveragerInstance();
    afterEach(() => {
      jest.clearAllMocks();
    });
    const _ltv = '5000';
    it('Expect to get the user status after transaction.', async () => {
      jest.spyOn(LeveragerLdot__factory, 'connect').mockReturnValue({
        ltv: async () => Promise.resolve(_ltv),
      } as unknown as LeveragerLdotType);

      const ltv = await leverager.ltv(address);

      expect(ltv).toEqual(_ltv);
    });
  });

  describe('lt', () => {
    const address = '0x0000000000000000000000000000000000000001';
    const leverager: LeveragerLdot = newLeveragerInstance();
    afterEach(() => {
      jest.clearAllMocks();
    });
    const _lt = '5000';
    it('Expect to get the user status after transaction.', async () => {
      jest.spyOn(LeveragerLdot__factory, 'connect').mockReturnValue({
        lt: async () => Promise.resolve(_lt),
      } as unknown as LeveragerLdotType);

      const lt = await leverager.lt(address);

      expect(lt).toEqual(_lt);
    });
  });

  describe('getExchangeRateLDOT2DOT', () => {
    const leverager: LeveragerLdot = newLeveragerInstance();
    afterEach(() => {
      jest.clearAllMocks();
    });
    const _rate = '5000';
    it('Expect to get the user status after transaction.', async () => {
      jest.spyOn(LeveragerLdot__factory, 'connect').mockReturnValue({
        getExchangeRateLDOT2DOT: async () => Promise.resolve(_rate),
      } as unknown as LeveragerLdotType);

      const rate = await leverager.getExchangeRateLDOT2DOT();

      expect(rate).toEqual(_rate);
    });
  });

  describe('getExchangeRateDOT2LDOT', () => {
    const leverager: LeveragerLdot = newLeveragerInstance();
    afterEach(() => {
      jest.clearAllMocks();
    });
    const _rate = '5000';
    it('Expect to get the user status after transaction.', async () => {
      jest.spyOn(LeveragerLdot__factory, 'connect').mockReturnValue({
        getExchangeRateDOT2LDOT: async () => Promise.resolve(_rate),
      } as unknown as LeveragerLdotType);

      const rate = await leverager.getExchangeRateDOT2LDOT();

      expect(rate).toEqual(_rate);
    });
  });
});
