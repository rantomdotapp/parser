import EnvConfig from '../../configs/envConfig';
import logger from '../../lib/logger';
import { AptosBlockchainService } from '../../services/chains/aptos';
import { Transaction } from '../../types/domains';
import { ContextServices, IBlockchainService, IParserModule, IProtocolAdapter } from '../../types/namespaces';
import { ParseTransactionOptions } from '../../types/options';
import { getAdapters } from '../adapters';

export class ParserModule implements IParserModule {
  public readonly name: string = 'parser';

  public services: ContextServices;
  public adapters: Array<IProtocolAdapter>;

  constructor(services: ContextServices) {
    this.services = services;
    this.adapters = getAdapters(this.services);
  }

  public async parseTransaction(options: ParseTransactionOptions): Promise<Array<Transaction>> {
    const transactions: Array<Transaction> = [];

    for (const [, blockchain] of Object.entries(EnvConfig.blockchains)) {
      let blockchainProvider: IBlockchainService | null | undefined;
      if (this.services) {
        blockchainProvider = this.services.blockchains[blockchain.name];
      } else {
        if (blockchain.family === 'aptos') {
          blockchainProvider = new AptosBlockchainService(null, null);
        }
      }

      if (!blockchainProvider) continue;

      const txnData: any = await blockchainProvider.getTransaction(blockchain.name, options.hash);

      if (txnData) {
        try {
          const transaction: Transaction = await blockchainProvider.transformTransaction({
            chain: blockchain.name,
            family: blockchain.family,
            transaction: txnData,
          });

          for (const event of txnData.events) {
            for (const adapter of this.adapters) {
              const action = await adapter.parseEventLog({
                chain: blockchain.name,
                family: blockchain.name,
                hash: options.hash,
                blockNumber: transaction.blockNumber,
                from: transaction.from,
                to: transaction.to,
                input: txnData.payload,
                event: event,
              });
              if (action) {
                transaction.actions.push(action);
              }
            }
          }

          transactions.push(transaction);
        } catch (e: any) {
          logger.error(' failed to parse transaction', {
            service: this.name,
            chain: blockchain.name,
            rpc: blockchain.nodeRpc,
            hash: options.hash,
            error: e.message,
          });

          if (this.services.sentry) {
            this.services.sentry.capture(e);
          }
        }
      }
    }

    return transactions;
  }
}
