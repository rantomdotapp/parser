import EnvConfig from '../configs/envConfig';
import { ICachingService, IMongodbService } from '../types/namespaces';

export class CachingService implements ICachingService {
  public readonly name: string = 'caching';

  private readonly _memories: { [key: string]: any } = {};
  private readonly _mongodb: IMongodbService | null;

  constructor(mongodb: IMongodbService | null) {
    this._mongodb = mongodb;
  }

  public async getCachingData(name: string): Promise<any> {
    // get data from memory
    if (this._memories[name]) {
      return this._memories[name];
    }

    if (this._mongodb) {
      const cachingCollection = await this._mongodb.getCollection(EnvConfig.mongodb.collections.caching);
      const documents = await cachingCollection.find({ name }).limit(1).toArray();
      if (documents.length > 0) {
        const data = documents[0] as any;
        delete data._id;

        // next time we get data from memory
        this._memories[name] = data;

        return data;
      }
    }

    return null;
  }

  public async setCachingData(name: string, data: any): Promise<void> {
    this._memories[name] = data;

    if (this._mongodb) {
      const cachingCollection = await this._mongodb.getCollection(EnvConfig.mongodb.collections.caching);
      await cachingCollection.updateOne(
        {
          name: name,
        },
        {
          $set: {
            name,
            ...data,
          },
        },
        {
          upsert: true,
        },
      );
    }
  }
}
