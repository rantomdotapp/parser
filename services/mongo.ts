import { Collection, MongoClient } from 'mongodb';

import envConfig from '../configs/envConfig';
import { sleep } from '../lib/helper';
import logger from '../lib/logger';
import { IMongodbService } from '../types/namespaces';

export default class MongodbService implements IMongodbService {
  public readonly name: string = 'mongodb';

  private _connected: boolean = false;
  private _client: MongoClient | null = null;
  private _db: any = null;

  constructor() {}

  public async connect(url: string, name: string): Promise<void> {
    if (!this._connected) {
      this._client = new MongoClient(url);

      while (!this._connected) {
        try {
          await this._client?.connect();
          this._db = this._client?.db(name);
          this._connected = true;

          await this.setupIndies();

          logger.info('database connected', {
            service: this.name,
            name: name,
          });
        } catch (e: any) {
          logger.error('failed to connect database', {
            service: this.name,
            name: name,
            error: e.message,
          });
          await sleep(5);
        }
      }

      if (!this._connected) {
        this.onError(Error('failed to connect to database'));
      }
    }
  }

  public async getCollection(name: string): Promise<Collection> {
    let collection: Collection | null = null;
    if (this._connected) {
      collection = this._db ? this._db.collection(name) : null;
    } else {
      this.onError(Error('failed to get collection'));
    }

    if (!collection) {
      this.onError(Error('failed to get collection'));
      process.exit(1);
    }

    return collection;
  }

  public onError(error: Error): void {
    console.error(error);
    process.exit(1);
  }

  private async setupIndies(): Promise<void> {
    const statesCollection = await this.getCollection(envConfig.mongodb.collections.states);
    const cachingCollection = await this.getCollection(envConfig.mongodb.collections.caching);
    const logsCollection = await this.getCollection(envConfig.mongodb.collections.logs);

    statesCollection.createIndex({ name: 1 }, { background: true });
    cachingCollection.createIndex({ name: 1 }, { background: true });

    // for insert and update logs
    logsCollection.createIndex({ chain: 1, contract: 1, transactionHash: 1, logIndex: 1 }, { background: true });

    // for query all activities and order by timestamp
    logsCollection.createIndex({ timestamp: 1 }, { background: true });

    // for query given action like: deposit or swap
    logsCollection.createIndex({ action: 1, timestamp: 1 }, { background: true });

    // for query given token
    logsCollection.createIndex({ 'tokens.address': 1, timestamp: 1 }, { background: true });

    // for query given addresses
    logsCollection.createIndex({ addresses: 1, timestamp: 1 }, { background: true });

    // for query protocol
    logsCollection.createIndex({ protocol: 1, action: 1, timestamp: 1 }, { background: true });

    // for overall query
    logsCollection.createIndex({ protocol: 1, action: 1, addresses: 1, timestamp: 1 }, { background: true });
    logsCollection.createIndex({ protocol: 1, action: 1, 'tokens.address': 1, timestamp: 1 }, { background: true });
  }
}
