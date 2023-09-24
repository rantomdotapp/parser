import { Token } from './configs';

export const Actions = [
  'swap',
  'collect',
  'deposit',
  'withdraw',
  'borrow',
  'repay',
  'flashloan',
  'liquidate',
  'bridge',
  'register',
  'renew',
  'list',
  'buy',
  'offer',
  'trade',
  'sow',
  'createLiquidityPool',
  'lock',
  'unlock',
  'update',

  'useContract', // for calls to smart contracts: DSProxy, Instadapp account, ...
  'executeRecipe', // execute recipe on DeFi Saver
  'executeTask', // execute task on gelato.network

  // these actions used for leveraged functional
  'leverage',
  'increaseShort',
  'increaseLong',
  'decreaseShort',
  'decreaseLong',
  'liquidateShort',
  'liquidateLong',

  'openAccount',
  'closeAccount',
] as const;
export type KnownAction = (typeof Actions)[number];

export interface EventLogBase {
  protocol: string;
  action: KnownAction;
  contract: string;
  addresses: Array<string>;
  readableString: string;

  tokens: Array<Token>;

  // should match with tokens
  tokenAmounts: Array<string>;

  // some protocol return amount in USD
  usdAmounts?: Array<string>;
}

export interface EventLogAction extends EventLogBase {
  logIndex?: number;
  addition?: any;
  subActions?: Array<EventLogBase>;
}

export interface Transaction {
  // the blockchain name
  chain: string;

  // the blockchain family
  family: string;

  // the transaction hash
  hash: string;

  // the transaction sender
  from: string;

  // the transaction recipient or contract
  to: string;

  // the transaction status
  status: boolean;

  // timestamp where transaction was executed
  // on evm chains, we can not timestamp directly from the transaction
  // we must get it from block data
  timestamp: number;

  // block number where the transaction was included
  // some blockchain like Aptos does not have block
  // so, this value is the ledger version
  // for more detail about blocks on Aptos, please check: https://aptos.dev/concepts/blocks
  blockNumber: number;

  actions: Array<EventLogAction>;
}

// this interface will be exactly saved in database
export interface EventLogActionDocument {
  // the blockchain name
  chain: string;

  // the blockchain family
  family: string;

  // the transaction sender
  from: string;

  // the transaction recipient or contract
  to: string;

  // the transaction hash
  transactionHash: string;

  timestamp: number;

  blockNumber: number;

  logIndex: number;

  // action info
  protocol: string;
  action: KnownAction;
  contract: string;
  addresses: Array<string>;
  tokens: Array<Token>;

  // should match with tokens
  tokenAmounts: Array<string>;

  // some protocol return amount in USD
  usdAmounts?: Array<string>;

  addition?: any;
}
