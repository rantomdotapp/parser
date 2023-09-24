import { ChainGetlogGenesis } from '../../configs';
import EnvConfig from '../../configs/envConfig';
import { EventLogActionDocument } from '../../types/domains';
import { ContextServices, IProtocolAdapter, IWorkerModule } from '../../types/namespaces';
import { WorkerRunOptions } from '../../types/options';
import { getAdapters } from '../adapters';

export default class WorkerModule implements IWorkerModule {
  public readonly name: string = 'worker';
  public readonly chain: string;
  public readonly services: ContextServices;
  public readonly adapters: Array<IProtocolAdapter>;

  constructor(chain: string, services: ContextServices) {
    this.chain = chain;
    this.services = services;
    this.adapters = getAdapters(services);
  }

  public async run(options: WorkerRunOptions) {
    let startBlock = options.fromBlock;
    if (options.fromBlock === 0) {
      startBlock = ChainGetlogGenesis[this.chain];
    }

    const statesCollection = await this.services.mongodb.getCollection(EnvConfig.mongodb.collections.states);

    const stateKey: string = `logs-index-${this.chain}`;
    const state: any = await statesCollection.findOne({
      name: stateKey,
    });
    if (state && state.blockNumber) {
      const statBlockNumber = Number(state.blockNumber);
      if (startBlock < statBlockNumber) {
        startBlock = statBlockNumber;
      }
    }

    const latestBlock = await this.services.blockchains[this.chain].getBlockNumber(this.chain);

    await this.startGetlog(startBlock, latestBlock);
  }

  protected async saveEventLogs(events: Array<EventLogActionDocument>): Promise<void> {
    const logsCollection = await this.services.mongodb.getCollection(EnvConfig.mongodb.collections.logs);
    const operations: Array<any> = [];
    for (const event of events) {
      operations.push({
        updateOne: {
          filter: {
            chain: event.chain,
            contract: event.contract,
            transactionHash: event.transactionHash,
            logIndex: event.logIndex,
          },
          update: {
            $set: {
              chain: event.chain,
              contract: event.contract,
              transactionHash: event.transactionHash,
              logIndex: event.logIndex,
              blockNumber: event.blockNumber,
              timestamp: event.timestamp,

              protocol: event.protocol,
              action: event.action,
              addresses: event.addresses,
              tokens: event.tokens,
              amounts: event.tokenAmounts,
              usdAmounts: event.usdAmounts,
              addition: event.addition,
            },
          },
          upsert: true,
        },
      });
    }

    if (operations.length > 0) {
      await logsCollection.bulkWrite(operations);
    }
  }

  protected async saveState(blockNumber: number): Promise<void> {
    const statesCollection = await this.services.mongodb.getCollection(EnvConfig.mongodb.collections.states);
    const stateKey: string = `logs-index-${this.chain}`;
    await statesCollection.updateOne(
      {
        name: stateKey,
      },
      {
        $set: {
          name: stateKey,
          blockNumber: blockNumber,
        },
      },
      {
        upsert: true,
      },
    );
  }

  // should implement this function match with blockchain family indexing strategy
  protected async startGetlog(fromBlock: number, latestBlock: number): Promise<void> {
    // every children class should implement this function
    // based blockchain logs indexing strategy
  }
}
