/* Autogenerated file. Do not edit manually. */
/* eslint-disable */
import { Signer, Contract, ContractFactory } from 'ethers';
import { Provider } from '@ethersproject/providers';
import type { Claimer } from './Claimer';

const _abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_starlayTokenSale',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_arthSwapTokenSale',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_incentivesController',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'arthSwapTokenSale',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'incentivesController',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
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
        internalType: 'address[]',
        name: 'assets',
        type: 'address[]',
      },
    ],
    name: 'releasable',
    outputs: [
      {
        internalType: 'uint256',
        name: '_starlayTokenSale',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_arthswapTokenSale',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_liquidityMining',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'assets',
        type: 'address[]',
      },
    ],
    name: 'release',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'starlayTokenSale',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export class Claimer__factory extends ContractFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): Claimer {
    return new Contract(address, _abi, signerOrProvider) as Claimer;
  }
}
