import { Collection } from 'mongodb';

import { ProtocolConfig, Token } from './configs';
import { EventLogAction, Transaction } from './domains';
import {
  AdapterParseLogOptions,
  ParseTransactionOptions,
  TransformTransactionOptions,
  WorkerRunOptions,
} from './options';

export interface IService {
  name: string;
}

export interface IMongodbService extends IService {
  connect: (url: string, name: string) => Promise<void>;
  getCollection: (name: string) => Promise<Collection>;
}

export interface ISentryService extends IService {
  capture: (e: Error) => void;
}

export interface ICachingService extends IService {
  getCachingData: (name: string) => Promise<any>;
  setCachingData: (name: string, data: any) => Promise<void>;
}

// this provider handle blockchain rpc & api query
export interface IBlockchainService extends ICachingService {
  getTransaction: (chain: string, hash: string) => Promise<any>;
  getTokenInfo: (chain: string, address: string) => Promise<Token | null>;

  // get latest block number from chain
  getBlockNumber: (chain: string) => Promise<number>;

  // transform helpers
  transformTransaction: (options: TransformTransactionOptions) => Promise<Transaction>;
}

export interface ContextServices {
  mongodb: IMongodbService;

  // sentry help tracking errors
  // can be ignored by initialize service with a blank DNS
  // it will not report to sentry even the capture function was called
  sentry: ISentryService;

  // every chain should have a blockchain service
  // wrap all rpc and api calls into this service
  blockchains: {
    [key: string]: IBlockchainService;
  };
}

export interface IModule extends IService {
  // the context services
  services: ContextServices;
}

// a protocol adapter implement all logic of a given protocol
// on their smart contracts and data structures
export interface IProtocolAdapter extends IModule {
  config: ProtocolConfig;

  // try parsing actions from transaction logs
  parseEventLog: (options: AdapterParseLogOptions) => Promise<EventLogAction | null>;

  // test the parser
  runTest: () => Promise<void>;
}

export interface IParserModule extends IModule {
  adapters: Array<IProtocolAdapter>;

  parseTransaction: (options: ParseTransactionOptions) => Promise<Array<Transaction>>;
}

export interface IWorkerModule extends IModule {
  chain: string;
  adapters: Array<IProtocolAdapter>;

  run: (options: WorkerRunOptions) => Promise<void>;
}
