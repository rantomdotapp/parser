export type ChainName = 'aptos';
export type ChainFamily = 'aptos';

export interface Blockchain {
  name: ChainName;
  family: ChainFamily;
  nodeRpc: string;
}

export interface Token {
  chain: string;
  symbol: string;
  decimals: number;
  address: string;
}

export interface EnvConfig {
  mongodb: {
    databaseName: string;
    connectionUri: string;
    collections: {
      states: string;
      caching: string;
      apiLogs: string;
      logs: string;
    };
  };
  sentry: {
    dns: string;
  };
  blockchains: {
    [key: string]: Blockchain;
  };
}

export interface ProtocolConfig {
  protocol: string; // protocol id, ex: uniswap, lido, ...
  contracts: {
    [key: string]: Array<string>;
  };
}
