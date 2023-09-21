import envConfig from '../configs/envConfig';
import { AptosBlockchainService } from '../services/chains/aptos';
import MongodbService from '../services/mongo';
import SentryService from '../services/sentry';
import { ContextServices } from '../types/namespaces';

export class BasicCommand {
  public readonly name: string = 'command';
  public readonly describe: string = 'Basic command';

  constructor() {}

  public async getServices(): Promise<ContextServices> {
    const mongodb = new MongodbService();

    const services: ContextServices = {
      mongodb: mongodb,
      sentry: new SentryService(process.env.RANTOM_SENTRY_DNS as string),
      blockchains: {
        aptos: new AptosBlockchainService(mongodb, null),
      },
    };

    await services.mongodb.connect(envConfig.mongodb.connectionUri, envConfig.mongodb.databaseName);

    return services;
  }

  public async execute(argv: any) {}
  public setOptions(yargs: any) {}
}
