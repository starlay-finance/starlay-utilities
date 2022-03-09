import { BigNumber, providers, utils } from 'ethers';
import {
  eEthereumTxType,
  EthereumTransactionTypeExtended,
  GasType,
  transactionType,
} from '../commons/types';
import { API_ETH_MOCK_ADDRESS } from '../commons/utils';
import { DebtERC20 } from './typechain/DebtERC20';
import { DebtERC20__factory } from './typechain/DebtERC20__factory';
import { DebtERC20Service, IDebtERC20ServiceInterface } from './index';

jest.mock('../commons/gasStation', () => {
  return {
    __esModule: true,
    estimateGasByNetwork: jest
      .fn()
      .mockImplementation(async () => Promise.resolve(BigNumber.from(1))),
    estimateGas: jest.fn(async () => Promise.resolve(BigNumber.from(1))),
  };
});

describe('DebtERC20Service', () => {
  const provider: providers.Provider = new providers.JsonRpcProvider();
  jest
    .spyOn(provider, 'getGasPrice')
    .mockImplementation(async () => Promise.resolve(BigNumber.from(1)));
  describe('Initialize', () => {
    it('Expects to be initialized correctly', () => {
      const instance: IDebtERC20ServiceInterface = new DebtERC20Service(
        provider,
      );
      expect(instance instanceof DebtERC20Service).toEqual(true);
    });
  });
  describe('approveDelegation', () => {
    const debtErc20Service: IDebtERC20ServiceInterface = new DebtERC20Service(
      provider,
    );
    const user = '0x0000000000000000000000000000000000000001';
    const token = '0x0000000000000000000000000000000000000002';
    const delegatee = '0x0000000000000000000000000000000000000003';
    const amount = '1000000000000000000';

    it('Expects to get the approval txObj with correct params', async () => {
      const debtErc20Service: IDebtERC20ServiceInterface = new DebtERC20Service(
        provider,
      );
      const txObj: EthereumTransactionTypeExtended =
        debtErc20Service.approveDelegation({
          user,
          token,
          delegatee,
          amount,
        });

      expect(txObj.txType).toEqual(eEthereumTxType.ERC20_APPROVAL);

      const tx: transactionType = await txObj.tx();
      expect(tx.to).toEqual(token);
      expect(tx.from).toEqual(user);
      expect(tx.gasLimit).toEqual(BigNumber.from(1));

      const decoded = utils.defaultAbiCoder.decode(
        ['address', 'uint256'],
        utils.hexDataSlice(tx.data ?? '', 4),
      );

      expect(decoded[0]).toEqual(delegatee);
      expect(decoded[1]).toEqual(BigNumber.from(amount));

      // gas price
      const gasPrice: GasType | null = await txObj.gas();
      expect(gasPrice).not.toBeNull();
      expect(gasPrice?.gasLimit).toEqual('1');
      expect(gasPrice?.gasPrice).toEqual('1');
    });
    it('Expects to fail when user is not address', () => {
      const user = 'asdf';
      expect(() =>
        debtErc20Service.approveDelegation({
          user,
          token,
          delegatee,
          amount,
        }),
      ).toThrowError(
        new Error(`Address: ${user} is not a valid ethereum Address`),
      );
    });
    it('Expects to fail when token is not address', () => {
      const token = 'asdf';
      expect(() =>
        debtErc20Service.approveDelegation({
          user,
          token,
          delegatee,
          amount,
        }),
      ).toThrowError(
        new Error(`Address: ${token} is not a valid ethereum Address`),
      );
    });
    it('Expects to fail when delegatee is not address', () => {
      const delegatee = 'asdf';
      expect(() =>
        debtErc20Service.approveDelegation({
          user,
          token,
          delegatee,
          amount,
        }),
      ).toThrowError(
        new Error(`Address: ${delegatee} is not a valid ethereum Address`),
      );
    });
    it('Expects to fail when amount is not positive > 0', () => {
      const amount = '0';
      expect(() =>
        debtErc20Service.approveDelegation({
          user,
          token,
          delegatee,
          amount,
        }),
      ).toThrowError(new Error(`Amount: ${amount} needs to be greater than 0`));
    });
    it('Expects to fail when amount is not a number', () => {
      const amount = 'asdf';
      expect(() =>
        debtErc20Service.approveDelegation({
          user,
          token,
          delegatee,
          amount,
        }),
      ).toThrowError(new Error(`Amount: ${amount} needs to be greater than 0`));
    });
  });
  describe('isDelegated', () => {
    const user = '0x0000000000000000000000000000000000000001';
    const token = '0x0000000000000000000000000000000000000002';
    const delegatee = '0x0000000000000000000000000000000000000003';
    const amount = '123.3';

    // mock erc20 service decimalsOf method
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects to return true if token is eth mock address', async () => {
      const debtErc20Service: IDebtERC20ServiceInterface = new DebtERC20Service(
        provider,
      );
      const token = API_ETH_MOCK_ADDRESS;
      const isDelegated: boolean = await debtErc20Service.isDelegated({
        user,
        token,
        delegatee,
        amount,
      });
      expect(isDelegated).toEqual(true);
    });
    it('Expects to be approved with correct params', async () => {
      jest.spyOn(DebtERC20__factory, 'connect').mockReturnValue({
        borrowAllowance: async () =>
          Promise.resolve(BigNumber.from('100000000000000000')),
      } as unknown as DebtERC20);

      const debtErc20Service: IDebtERC20ServiceInterface = new DebtERC20Service(
        provider,
      );
      const decimalsSpy = jest
        .spyOn(debtErc20Service, 'decimalsOf')
        .mockImplementation(async () => Promise.resolve(6));

      const isDelegated: boolean = await debtErc20Service.isDelegated({
        user,
        token,
        delegatee,
        amount,
      });

      expect(decimalsSpy).toHaveBeenCalled();
      expect(isDelegated).toEqual(true);
    });
    it('Expects to not be approved with correct params', async () => {
      jest.spyOn(DebtERC20__factory, 'connect').mockReturnValue({
        borrowAllowance: async () => Promise.resolve(BigNumber.from('100000')),
      } as unknown as DebtERC20);

      const debtErc20Service: IDebtERC20ServiceInterface = new DebtERC20Service(
        provider,
      );
      const decimalsSpy = jest
        .spyOn(debtErc20Service, 'decimalsOf')
        .mockImplementation(async () => Promise.resolve(6));

      const isDelegated: boolean = await debtErc20Service.isDelegated({
        user,
        token,
        delegatee,
        amount,
      });
      expect(decimalsSpy).toHaveBeenCalled();
      expect(isDelegated).toEqual(false);
    });

    it('Expects to fail when user is not address', async () => {
      const debtErc20Service: IDebtERC20ServiceInterface = new DebtERC20Service(
        provider,
      );
      const user = 'asdf';
      await expect(async () =>
        debtErc20Service.isDelegated({
          user,
          token,
          delegatee,
          amount,
        }),
      ).rejects.toThrowError(
        new Error(`Address: ${user} is not a valid ethereum Address`),
      );
    });
    it('Expects to fail when token is not address', async () => {
      const debtErc20Service: IDebtERC20ServiceInterface = new DebtERC20Service(
        provider,
      );
      const token = 'asdf';
      await expect(async () =>
        debtErc20Service.isDelegated({
          user,
          token,
          delegatee,
          amount,
        }),
      ).rejects.toThrowError(
        new Error(`Address: ${token} is not a valid ethereum Address`),
      );
    });
    it('Expects to fail when delegatee is not address', async () => {
      const debtErc20Service: IDebtERC20ServiceInterface = new DebtERC20Service(
        provider,
      );
      const delegatee = 'asdf';
      await expect(async () =>
        debtErc20Service.isDelegated({
          user,
          token,
          delegatee,
          amount,
        }),
      ).rejects.toThrowError(
        new Error(`Address: ${delegatee} is not a valid ethereum Address`),
      );
    });
    it('Expects to fail when amount is not positive > 0', async () => {
      const debtErc20Service: IDebtERC20ServiceInterface = new DebtERC20Service(
        provider,
      );
      const amount = '0';
      await expect(async () =>
        debtErc20Service.isDelegated({
          user,
          token,
          delegatee,
          amount,
        }),
      ).rejects.toThrowError(
        new Error(`Amount: ${amount} needs to be greater than 0`),
      );
    });
    it('Expects to fail when amount is not number', async () => {
      const debtErc20Service: IDebtERC20ServiceInterface = new DebtERC20Service(
        provider,
      );
      const amount = 'asdf';
      await expect(async () =>
        debtErc20Service.isDelegated({
          user,
          token,
          delegatee,
          amount,
        }),
      ).rejects.toThrowError(
        new Error(`Amount: ${amount} needs to be greater than 0`),
      );
    });
  });
  describe('decimalsOf', () => {
    const debtErc20Service: IDebtERC20ServiceInterface = new DebtERC20Service(
      provider,
    );
    const address = '0x0000000000000000000000000000000000000001';
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('Expects 18 if mocked eth address', async () => {
      const decimals = await debtErc20Service.decimalsOf(API_ETH_MOCK_ADDRESS);
      expect(decimals).toEqual(18);
    });
    it('Expect to get the decimals from the contract if not eth mock and not called previously with same address', async () => {
      jest.spyOn(DebtERC20__factory, 'connect').mockReturnValue({
        decimals: async () => Promise.resolve(6),
      } as unknown as DebtERC20);

      const decimals = await debtErc20Service.decimalsOf(address);

      expect(decimals).toEqual(6);
    });
    it('Expects to return already saved decimals if not eth mock', async () => {
      const spy = jest.spyOn(DebtERC20__factory, 'connect').mockReturnValue({
        decimals: async () => Promise.resolve(6),
      } as unknown as DebtERC20);
      const debtErc20Service: IDebtERC20ServiceInterface = new DebtERC20Service(
        provider,
      );

      const decimals = await debtErc20Service.decimalsOf(address);
      const decimals2 = await debtErc20Service.decimalsOf(address);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(decimals).toEqual(6);
      expect(decimals2).toEqual(decimals);
    });
  });
});
