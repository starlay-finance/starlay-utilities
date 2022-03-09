/* Autogenerated file. Do not edit manually. */
/* eslint-disable */

import { Signer, Contract, ContractFactory } from 'ethers';
import { Provider } from '@ethersproject/providers';
import type { Leverager } from './Leverager';

const _abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'pool',
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
    name: 'lendingPool',
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
        name: 'asset',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'interestRateMode',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'onBehalfOf',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'borrowRatio',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loopCount',
        type: 'uint256',
      },
    ],
    name: 'loop',
    outputs: [],
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

export class Leverager__factory extends ContractFactory {
  static connect(
    address: string,
    signerOrProvider: Signer | Provider,
  ): Leverager {
    return new Contract(address, _abi, signerOrProvider) as Leverager;
  }
}
