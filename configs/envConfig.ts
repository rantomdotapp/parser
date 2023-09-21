import dotenv from 'dotenv';

import { EnvConfig } from '../types/configs';
import { MongodbPrefix } from './constants';

// global env and configurations
dotenv.config();

const envConfig: EnvConfig = {
  mongodb: {
    databaseName: String(process.env.RANTOM_MONGODB_NAME),
    connectionUri: String(process.env.RANTOM_MONGODB_URI),
    collections: {
      states: `${MongodbPrefix}.states`,
      caching: `${MongodbPrefix}.caching`,
      apiLogs: `${MongodbPrefix}.apiLogs`,
      logs: `${MongodbPrefix}.logs`,
    },
  },
  sentry: {
    dns: String(process.env.RANTOM_SENTRY_DNS),
  },
  blockchains: {
    aptos: {
      name: 'aptos',
      family: 'aptos',
      nodeRpc: String(process.env.RANTOM_APTOS_NODE),
    },
  },
};

export default envConfig;
