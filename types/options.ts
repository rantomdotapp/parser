import {Token} from "./configs";
import {KnownAction} from "./domains";

export interface ParseTransactionOptions {
  hash: string;
}

export interface AdapterParseLogOptions {
  // chain detail
  chain: string;

  // the blockchain family: evm | aptos
  family: string;

  // the transaction hash
  hash: string;

  // the block number
  blockNumber: number;

  // the transaction from address
  from: string;

  // the transaction to address
  to: string;

  // the transaction call data or payload if any
  input: any;

  // the event log object which is different
  // depend on the blockchain family
  event: any;
}

export interface TransformTransactionOptions {
  chain: string;
  family: string;
  transaction: any;
}

export interface AdapterParseLogTestCase {
  options: AdapterParseLogOptions;
  expected: {
    action: KnownAction;
    addresses: Array<string>;
    tokens: Array<Token>;
    tokenAmounts: Array<string>;
    subActions?: Array<any>;
  };
}

export interface WorkerRunOptions {
  chain: string;
  fromLedgerVersion: string;
}
