/* Autogenerated file. Do not edit manually. */
/* eslint-disable */

import { Signer } from 'ethers';
import { Provider } from '@ethersproject/providers';
import { Contract } from '@ethersproject/contracts';

import type { LeveragerLdot } from './LeveragerLdot';

const _abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'pool',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'dot',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'ldot',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'homa',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'oracle',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'target',
        type: 'address',
      },
    ],
    name: 'AddressEmptyCode',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'AddressInsufficientBalance',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FailedInnerCall',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'SafeERC20FailedOperation',
    type: 'error',
  },
  {
    inputs: [],
    name: 'DOT',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'HOMA',
    outputs: [
      {
        internalType: 'contract IHoma',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'LDOT',
    outputs: [
      {
        internalType: 'contract IERC20',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'LENDING_POOL',
    outputs: [
      {
        internalType: 'contract ILendingPool',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ORACLE',
    outputs: [
      {
        internalType: 'contract IPriceOracleGetter',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'closeLeverageDOT',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'assets',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'premiums',
        type: 'uint256[]',
      },
      {
        internalType: 'address',
        name: 'initiator',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'params',
        type: 'bytes',
      },
    ],
    name: 'executeOperation',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'getConfiguration',
    outputs: [
      {
        internalType: 'uint256',
        name: 'data',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getExchangeRateDOT2LDOT',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getExchangeRateLDOT2DOT',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'getReserveData',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'uint256',
                name: 'data',
                type: 'uint256',
              },
            ],
            internalType: 'struct DataTypes.ReserveConfigurationMap',
            name: 'configuration',
            type: 'tuple',
          },
          {
            internalType: 'uint128',
            name: 'liquidityIndex',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'variableBorrowIndex',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'currentLiquidityRate',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'currentVariableBorrowRate',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'currentStableBorrowRate',
            type: 'uint128',
          },
          {
            internalType: 'uint40',
            name: 'lastUpdateTimestamp',
            type: 'uint40',
          },
          {
            internalType: 'address',
            name: 'lTokenAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'stableDebtTokenAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'variableDebtTokenAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'interestRateStrategyAddress',
            type: 'address',
          },
          {
            internalType: 'uint8',
            name: 'id',
            type: 'uint8',
          },
        ],
        internalType: 'struct DataTypes.ReserveData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'borrowAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'supplyAmount',
        type: 'uint256',
      },
    ],
    name: 'getStatusAfterLeverageDotFromPositionTransaction',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalCollateralAfterTx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalDebtAfterTx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalCollateralInDotAfterTx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalDebtInDotAfterTx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'healthFactorAfterTx',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'borrowAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'repayAmount',
        type: 'uint256',
      },
    ],
    name: 'getStatusAfterLeverageDotTransaction',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalCollateralAfterTx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalDebtAfterTx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalCollateralInDotAfterTx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalDebtInDotAfterTx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'healthFactorAfterTx',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'borrowAmountInLdot',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'supplyAmountInLdot',
        type: 'uint256',
      },
    ],
    name: 'getStatusAfterLeverageLdotFromPositionTransaction',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalCollateralAfterTx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalDebtAfterTx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalCollateralInDotAfterTx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalDebtInDotAfterTx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'healthFactorAfterTx',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'borrowAmountInLdot',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'repayAmountInLdot',
        type: 'uint256',
      },
    ],
    name: 'getStatusAfterLeverageLdotTransaction',
    outputs: [
      {
        internalType: 'uint256',
        name: 'totalCollateralAfterTx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalDebtAfterTx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalCollateralInDotAfterTx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'totalDebtInDotAfterTx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'healthFactorAfterTx',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'borrow_dot_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'repay_dot_amount',
        type: 'uint256',
      },
    ],
    name: 'leverageDot',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'borrow_dot_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'supply_dot_amount',
        type: 'uint256',
      },
    ],
    name: 'leverageDotFromPosition',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'borrowAmountInLdot',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'repayAmountInLdot',
        type: 'uint256',
      },
    ],
    name: 'leverageLdot',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'borrowAmountInLdot',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'supplyAmountInLdot',
        type: 'uint256',
      },
    ],
    name: 'leverageLdotFromPosition',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'lt',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'ltv',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export class LeveragerLdot__factory {
  static readonly abi = _abi;

  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): LeveragerLdot {
    return new Contract(address, _abi, signerOrProvider) as LeveragerLdot;
  }
}
