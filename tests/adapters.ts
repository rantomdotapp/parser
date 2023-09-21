import { describe } from 'mocha';

import { getAdapters } from '../modules/adapters';
import { AptosBlockchainService } from '../services/chains/aptos';
import MongodbService from '../services/mongo';
import SentryService from '../services/sentry';
import { IBlockchainService } from '../types/namespaces';

const mongodb = new MongodbService();
const sentry = new SentryService('');
const blockchains: {
  [key: string]: IBlockchainService;
} = {
  aptos: new AptosBlockchainService(mongodb, sentry),
};

const adapters = getAdapters({
  mongodb: mongodb,
  sentry: sentry,
  blockchains: blockchains,
});

describe('adapters', async function () {
  adapters.map((adapter) =>
    it(`the ${adapter.name} should work properly`, async function () {
      await adapter.runTest();
    }),
  );
});
