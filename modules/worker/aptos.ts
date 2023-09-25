import axios from 'axios';

import EnvConfig from '../../configs/envConfig';
import { formatTime, getTimestamp } from '../../lib/helper';
import logger from '../../lib/logger';
import { EventLogActionDocument, Transaction } from '../../types/domains';
import { ContextServices } from '../../types/namespaces';
import WorkerModule from './worker';

export default class AptosWorkerModule extends WorkerModule {
  public readonly name: string = 'worker.aptos';

  constructor(chain: string, services: ContextServices) {
    super(chain, services);
  }

  protected async startGetlog(fromBlock: number, latestBlock: number): Promise<void> {
    logger.info('start to index blockchain logs', {
      service: this.name,
      chain: this.chain,
      family: EnvConfig.blockchains[this.chain].family,
      fromBlock: fromBlock,
      toBlock: latestBlock,
    });

    let startBlock = fromBlock;
    while (startBlock < latestBlock) {
      try {
        const startExeTime = getTimestamp();
        const eventDocuments: Array<EventLogActionDocument> = [];

        const rawTransactions: Array<any> = (
          await axios.get(`${EnvConfig.blockchains[this.chain].nodeRpc}/transactions?start=${startBlock}`)
        ).data;

        for (const rawTransaction of rawTransactions) {
          if (rawTransaction.events) {
            const transaction: Transaction = await this.services.blockchains[this.chain].transformTransaction({
              chain: this.chain,
              family: EnvConfig.blockchains[this.chain].family,
              transaction: rawTransaction,
            });

            for (const event of rawTransaction.events) {
              for (const adapter of this.adapters) {
                const action = await adapter.parseEventLog({
                  chain: this.chain,
                  family: EnvConfig.blockchains[this.chain].family,
                  hash: transaction.hash,
                  blockNumber: transaction.blockNumber,
                  from: transaction.from,
                  to: transaction.to,
                  input: rawTransaction.payload,
                  event: event,
                });

                if (action) {
                  eventDocuments.push({
                    chain: transaction.chain,
                    family: transaction.family,
                    from: transaction.from,
                    to: transaction.to,
                    transactionHash: transaction.hash,
                    blockNumber: transaction.blockNumber,
                    timestamp: transaction.timestamp,
                    logIndex: Number(event.sequence_number),

                    protocol: action.protocol,
                    action: action.action,
                    contract: action.contract,
                    addresses: action.addresses,
                    tokens: action.tokens,
                    tokenAmounts: action.tokenAmounts,
                    usdAmounts: action.usdAmounts,
                    addition: action.addition,
                  });
                }
              }
            }
          }
        }

        // the next version
        const syncToBlock =
          rawTransactions.length > 0 ? Number(rawTransactions[rawTransactions.length - 1].version) : startBlock;

        await super.saveEventLogs(eventDocuments, syncToBlock);

        const elapsed = getTimestamp() - startExeTime;

        logger.info('success to index blockchain logs', {
          service: this.name,
          chain: this.chain,
          family: EnvConfig.blockchains[this.chain].family,
          toBlock: syncToBlock,
          age: `${
            rawTransactions.length > 0
              ? formatTime(Math.floor(rawTransactions[rawTransactions.length - 1].timestamp) / 1000000)
              : 'unknown'
          }`,
          events: eventDocuments.length,
          elapsed: `${elapsed}s`,
        });

        startBlock = syncToBlock + 1;
      } catch (e: any) {
        logger.error('failed to index blockchain logs', {
          service: this.name,
          chain: this.chain,
          startBlock: startBlock,
          error: e.message,
        });
        return;
      }
    }
  }
}
