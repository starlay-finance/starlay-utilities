/* Autogenerated file. Do not edit manually. */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from 'ethers';
import { FunctionFragment, Result, EventFragment } from '@ethersproject/abi';
import { Provider } from '@ethersproject/providers';

export interface VoterInterface extends utils.Interface {
  contractName: 'Voter';
  functions: {
    '_ve()': FunctionFragment;
    'addPool(address,address)': FunctionFragment;
    'checkpointToken()': FunctionFragment;
    'claim()': FunctionFragment;
    'claimable()': FunctionFragment;
    'currentTermIndex()': FunctionFragment;
    'currentTermTimestamp()': FunctionFragment;
    'initialize(address)': FunctionFragment;
    'isWhitelisted(address)': FunctionFragment;
    'lastClaimTime(uint256)': FunctionFragment;
    'lastTokenTime()': FunctionFragment;
    'lastVoteTime(uint256)': FunctionFragment;
    'minter()': FunctionFragment;
    'poke()': FunctionFragment;
    'poolWeights(address,uint256)': FunctionFragment;
    'pools(address)': FunctionFragment;
    'reset()': FunctionFragment;
    'startTime()': FunctionFragment;
    'termIndexAt(uint256)': FunctionFragment;
    'termTimestampAtDeployed()': FunctionFragment;
    'termTimestampByIndex(uint256)': FunctionFragment;
    'timestampAtDeployed()': FunctionFragment;
    'tokenIndex(address)': FunctionFragment;
    'tokenLastBalance(uint256)': FunctionFragment;
    'tokenList()': FunctionFragment;
    'tokens(uint256)': FunctionFragment;
    'tokensPerWeek(uint256,uint256)': FunctionFragment;
    'totalWeight(uint256)': FunctionFragment;
    'updatePool(address,address)': FunctionFragment;
    'vote(uint256[])': FunctionFragment;
    'voteEndTime(uint256)': FunctionFragment;
    'voteUntil(uint256[],uint256)': FunctionFragment;
    'votedTotalVotingWeights(uint256,uint256)': FunctionFragment;
    'votes(uint256,address,uint256)': FunctionFragment;
    'weights(uint256,address)': FunctionFragment;
  };

  encodeFunctionData(functionFragment: '_ve', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'addPool',
    values: [string, string],
  ): string;
  encodeFunctionData(
    functionFragment: 'checkpointToken',
    values?: undefined,
  ): string;
  encodeFunctionData(functionFragment: 'claim', values?: undefined): string;
  encodeFunctionData(functionFragment: 'claimable', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'currentTermIndex',
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: 'currentTermTimestamp',
    values?: undefined,
  ): string;
  encodeFunctionData(functionFragment: 'initialize', values: [string]): string;
  encodeFunctionData(
    functionFragment: 'isWhitelisted',
    values: [string],
  ): string;
  encodeFunctionData(
    functionFragment: 'lastClaimTime',
    values: [BigNumberish],
  ): string;
  encodeFunctionData(
    functionFragment: 'lastTokenTime',
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: 'lastVoteTime',
    values: [BigNumberish],
  ): string;
  encodeFunctionData(functionFragment: 'minter', values?: undefined): string;
  encodeFunctionData(functionFragment: 'poke', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'poolWeights',
    values: [string, BigNumberish],
  ): string;
  encodeFunctionData(functionFragment: 'pools', values: [string]): string;
  encodeFunctionData(functionFragment: 'reset', values?: undefined): string;
  encodeFunctionData(functionFragment: 'startTime', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'termIndexAt',
    values: [BigNumberish],
  ): string;
  encodeFunctionData(
    functionFragment: 'termTimestampAtDeployed',
    values?: undefined,
  ): string;
  encodeFunctionData(
    functionFragment: 'termTimestampByIndex',
    values: [BigNumberish],
  ): string;
  encodeFunctionData(
    functionFragment: 'timestampAtDeployed',
    values?: undefined,
  ): string;
  encodeFunctionData(functionFragment: 'tokenIndex', values: [string]): string;
  encodeFunctionData(
    functionFragment: 'tokenLastBalance',
    values: [BigNumberish],
  ): string;
  encodeFunctionData(functionFragment: 'tokenList', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'tokens',
    values: [BigNumberish],
  ): string;
  encodeFunctionData(
    functionFragment: 'tokensPerWeek',
    values: [BigNumberish, BigNumberish],
  ): string;
  encodeFunctionData(
    functionFragment: 'totalWeight',
    values: [BigNumberish],
  ): string;
  encodeFunctionData(
    functionFragment: 'updatePool',
    values: [string, string],
  ): string;
  encodeFunctionData(
    functionFragment: 'vote',
    values: [BigNumberish[]],
  ): string;
  encodeFunctionData(
    functionFragment: 'voteEndTime',
    values: [BigNumberish],
  ): string;
  encodeFunctionData(
    functionFragment: 'voteUntil',
    values: [BigNumberish[], BigNumberish],
  ): string;
  encodeFunctionData(
    functionFragment: 'votedTotalVotingWeights',
    values: [BigNumberish, BigNumberish],
  ): string;
  encodeFunctionData(
    functionFragment: 'votes',
    values: [BigNumberish, string, BigNumberish],
  ): string;
  encodeFunctionData(
    functionFragment: 'weights',
    values: [BigNumberish, string],
  ): string;

  decodeFunctionResult(functionFragment: '_ve', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'addPool', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'checkpointToken',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: 'claim', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'claimable', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'currentTermIndex',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'currentTermTimestamp',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: 'initialize', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'isWhitelisted',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'lastClaimTime',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'lastTokenTime',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'lastVoteTime',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: 'minter', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'poke', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'poolWeights',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: 'pools', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'reset', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'startTime', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'termIndexAt',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'termTimestampAtDeployed',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'termTimestampByIndex',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'timestampAtDeployed',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: 'tokenIndex', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'tokenLastBalance',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: 'tokenList', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'tokens', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'tokensPerWeek',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(
    functionFragment: 'totalWeight',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: 'updatePool', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'vote', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'voteEndTime',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: 'voteUntil', data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: 'votedTotalVotingWeights',
    data: BytesLike,
  ): Result;
  decodeFunctionResult(functionFragment: 'votes', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'weights', data: BytesLike): Result;

  events: {
    'Abstained(uint256,address,uint256)': EventFragment;
    'Claimed(uint256,uint256[])': EventFragment;
    'Initialized(uint8)': EventFragment;
    'PoolAdded(address,address)': EventFragment;
    'PoolUpdated(address,address)': EventFragment;
    'Voted(address,uint256,address,uint256)': EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: 'Abstained'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Claimed'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Initialized'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'PoolAdded'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'PoolUpdated'): EventFragment;
  getEvent(nameOrSignatureOrTopic: 'Voted'): EventFragment;
}
export interface Voter extends BaseContract {
  contractName: 'Voter';
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: VoterInterface;

  functions: {
    _ve(overrides?: CallOverrides): Promise<[string]>;

    addPool(
      _token: string,
      _pool: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    checkpointToken(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    claim(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    claimable(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    currentTermIndex(overrides?: CallOverrides): Promise<[BigNumber]>;

    currentTermTimestamp(overrides?: CallOverrides): Promise<[BigNumber]>;

    initialize(
      _votingEscrow: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    isWhitelisted(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;

    lastClaimTime(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    lastTokenTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    lastVoteTime(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    minter(overrides?: CallOverrides): Promise<[string]>;

    poke(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    poolWeights(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    pools(arg0: string, overrides?: CallOverrides): Promise<[string]>;

    reset(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    startTime(overrides?: CallOverrides): Promise<[BigNumber]>;

    termIndexAt(
      _t: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    termTimestampAtDeployed(overrides?: CallOverrides): Promise<[BigNumber]>;

    termTimestampByIndex(
      _index: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    timestampAtDeployed(overrides?: CallOverrides): Promise<[BigNumber]>;

    tokenIndex(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    tokenLastBalance(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    tokenList(overrides?: CallOverrides): Promise<[string[]]>;

    tokens(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;

    tokensPerWeek(
      arg0: BigNumberish,
      arg1: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    totalWeight(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    updatePool(
      _token: string,
      _pool: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    vote(
      _weights: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    voteEndTime(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    voteUntil(
      _weights: BigNumberish[],
      _VoteEndTimestamp: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<ContractTransaction>;

    votedTotalVotingWeights(
      arg0: BigNumberish,
      arg1: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    votes(
      arg0: BigNumberish,
      arg1: string,
      arg2: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;

    weights(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides,
    ): Promise<[BigNumber]>;
  };

  _ve(overrides?: CallOverrides): Promise<string>;

  addPool(
    _token: string,
    _pool: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  checkpointToken(
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  claim(
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  claimable(
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  currentTermIndex(overrides?: CallOverrides): Promise<BigNumber>;

  currentTermTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

  initialize(
    _votingEscrow: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  isWhitelisted(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  lastClaimTime(
    arg0: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  lastTokenTime(overrides?: CallOverrides): Promise<BigNumber>;

  lastVoteTime(
    arg0: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  minter(overrides?: CallOverrides): Promise<string>;

  poke(
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  poolWeights(
    arg0: string,
    arg1: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  pools(arg0: string, overrides?: CallOverrides): Promise<string>;

  reset(
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  startTime(overrides?: CallOverrides): Promise<BigNumber>;

  termIndexAt(_t: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  termTimestampAtDeployed(overrides?: CallOverrides): Promise<BigNumber>;

  termTimestampByIndex(
    _index: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  timestampAtDeployed(overrides?: CallOverrides): Promise<BigNumber>;

  tokenIndex(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  tokenLastBalance(
    arg0: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  tokenList(overrides?: CallOverrides): Promise<string[]>;

  tokens(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  tokensPerWeek(
    arg0: BigNumberish,
    arg1: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  totalWeight(
    arg0: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  updatePool(
    _token: string,
    _pool: string,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  vote(
    _weights: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  voteEndTime(
    arg0: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  voteUntil(
    _weights: BigNumberish[],
    _VoteEndTimestamp: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<ContractTransaction>;

  votedTotalVotingWeights(
    arg0: BigNumberish,
    arg1: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  votes(
    arg0: BigNumberish,
    arg1: string,
    arg2: BigNumberish,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  weights(
    arg0: BigNumberish,
    arg1: string,
    overrides?: CallOverrides,
  ): Promise<BigNumber>;

  callStatic: {
    _ve(overrides?: CallOverrides): Promise<string>;

    addPool(
      _token: string,
      _pool: string,
      overrides?: CallOverrides,
    ): Promise<void>;

    checkpointToken(overrides?: CallOverrides): Promise<void>;

    claim(overrides?: CallOverrides): Promise<BigNumber[]>;

    claimable(overrides?: CallOverrides): Promise<BigNumber[]>;

    currentTermIndex(overrides?: CallOverrides): Promise<BigNumber>;

    currentTermTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(_votingEscrow: string, overrides?: CallOverrides): Promise<void>;

    isWhitelisted(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    lastClaimTime(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    lastTokenTime(overrides?: CallOverrides): Promise<BigNumber>;

    lastVoteTime(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    minter(overrides?: CallOverrides): Promise<string>;

    poke(overrides?: CallOverrides): Promise<void>;

    poolWeights(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    pools(arg0: string, overrides?: CallOverrides): Promise<string>;

    reset(overrides?: CallOverrides): Promise<void>;

    startTime(overrides?: CallOverrides): Promise<BigNumber>;

    termIndexAt(
      _t: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    termTimestampAtDeployed(overrides?: CallOverrides): Promise<BigNumber>;

    termTimestampByIndex(
      _index: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    timestampAtDeployed(overrides?: CallOverrides): Promise<BigNumber>;

    tokenIndex(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    tokenLastBalance(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    tokenList(overrides?: CallOverrides): Promise<string[]>;

    tokens(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    tokensPerWeek(
      arg0: BigNumberish,
      arg1: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    totalWeight(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    updatePool(
      _token: string,
      _pool: string,
      overrides?: CallOverrides,
    ): Promise<void>;

    vote(_weights: BigNumberish[], overrides?: CallOverrides): Promise<void>;

    voteEndTime(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    voteUntil(
      _weights: BigNumberish[],
      _VoteEndTimestamp: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<void>;

    votedTotalVotingWeights(
      arg0: BigNumberish,
      arg1: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    votes(
      arg0: BigNumberish,
      arg1: string,
      arg2: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    weights(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
  };

  estimateGas: {
    _ve(overrides?: CallOverrides): Promise<BigNumber>;

    addPool(
      _token: string,
      _pool: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    checkpointToken(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    claim(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    claimable(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    currentTermIndex(overrides?: CallOverrides): Promise<BigNumber>;

    currentTermTimestamp(overrides?: CallOverrides): Promise<BigNumber>;

    initialize(
      _votingEscrow: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    isWhitelisted(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    lastClaimTime(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    lastTokenTime(overrides?: CallOverrides): Promise<BigNumber>;

    lastVoteTime(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    minter(overrides?: CallOverrides): Promise<BigNumber>;

    poke(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    poolWeights(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    pools(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    reset(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    startTime(overrides?: CallOverrides): Promise<BigNumber>;

    termIndexAt(
      _t: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    termTimestampAtDeployed(overrides?: CallOverrides): Promise<BigNumber>;

    termTimestampByIndex(
      _index: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    timestampAtDeployed(overrides?: CallOverrides): Promise<BigNumber>;

    tokenIndex(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    tokenLastBalance(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    tokenList(overrides?: CallOverrides): Promise<BigNumber>;

    tokens(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    tokensPerWeek(
      arg0: BigNumberish,
      arg1: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    totalWeight(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    updatePool(
      _token: string,
      _pool: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    vote(
      _weights: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    voteEndTime(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    voteUntil(
      _weights: BigNumberish[],
      _VoteEndTimestamp: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<BigNumber>;

    votedTotalVotingWeights(
      arg0: BigNumberish,
      arg1: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    votes(
      arg0: BigNumberish,
      arg1: string,
      arg2: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;

    weights(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides,
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    _ve(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    addPool(
      _token: string,
      _pool: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    checkpointToken(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    claim(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    claimable(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    currentTermIndex(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    currentTermTimestamp(
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    initialize(
      _votingEscrow: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    isWhitelisted(
      arg0: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    lastClaimTime(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    lastTokenTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    lastVoteTime(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    minter(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    poke(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    poolWeights(
      arg0: string,
      arg1: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    pools(
      arg0: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    reset(
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    startTime(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    termIndexAt(
      _t: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    termTimestampAtDeployed(
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    termTimestampByIndex(
      _index: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    timestampAtDeployed(
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    tokenIndex(
      arg0: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    tokenLastBalance(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    tokenList(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokens(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    tokensPerWeek(
      arg0: BigNumberish,
      arg1: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    totalWeight(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    updatePool(
      _token: string,
      _pool: string,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    vote(
      _weights: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    voteEndTime(
      arg0: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    voteUntil(
      _weights: BigNumberish[],
      _VoteEndTimestamp: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> },
    ): Promise<PopulatedTransaction>;

    votedTotalVotingWeights(
      arg0: BigNumberish,
      arg1: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    votes(
      arg0: BigNumberish,
      arg1: string,
      arg2: BigNumberish,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;

    weights(
      arg0: BigNumberish,
      arg1: string,
      overrides?: CallOverrides,
    ): Promise<PopulatedTransaction>;
  };
}
