import axios from 'axios';

import { Tokens } from '../../configs';
import { AptosCoin } from '../../configs/constants';
import EnvConfig from '../../configs/envConfig';
import { normalizeAddress } from '../../lib/helper';
import logger from '../../lib/logger';
import { Token } from '../../types/configs';
import { Transaction } from '../../types/domains';
import { IBlockchainService, IMongodbService, ISentryService } from '../../types/namespaces';
import { TransformTransactionOptions } from '../../types/options';
import { CachingService } from '../caching';

export class AptosBlockchainService extends CachingService implements IBlockchainService {
  public readonly name: string = 'blockchain';

  protected readonly sentryService: ISentryService | null;

  constructor(mongodb: IMongodbService | null, sentryService: ISentryService | null) {
    super(mongodb);

    this.sentryService = sentryService;
  }

  public async getTransaction(chain: string, hash: string): Promise<any> {
    try {
      const response = await axios.get(`${EnvConfig.blockchains[chain].nodeRpc}/transactions/by_hash/${hash}`);
      return response.data;
    } catch (e: any) {
      logger.error('failed to get blockchain transaction', {
        service: this.name,
        chain: chain,
        hash: hash,
        error: e.message,
      });
    }

    return null;
  }

  public async getTokenInfo(chain: string, address: string): Promise<Token | null> {
    if (address === AptosCoin) {
      return {
        chain,
        symbol: 'APT',
        decimals: 8,
        address: normalizeAddress(address),
      };
    } else {
      for (const [, token] of Object.entries(Tokens.aptos)) {
        if (normalizeAddress(token.address) === normalizeAddress(address)) {
          return token;
        }
      }
    }

    return null;
  }

  public async getBlockNumber(chain: string): Promise<number> {
    try {
      const response = await axios.get(EnvConfig.blockchains[chain].nodeRpc);
      return Number(response.data.ledger_version);
    } catch (e: any) {
      logger.error('failed to get blockchain latest block number', {
        service: this.name,
        chain: chain,
        error: e.message,
      });
    }

    return 0;
  }

  public async transformTransaction(options: TransformTransactionOptions): Promise<Transaction> {
    let to = '';
    if (options.transaction.payload && options.transaction.payload.function) {
      to = options.transaction.payload.function.split('::')[0];
    }

    return {
      chain: options.chain,
      family: options.family,
      hash: options.transaction.hash,
      blockNumber: Number(options.transaction.version),
      timestamp: Math.floor(Number(options.transaction.timestamp) / 1000000),
      status: Boolean(options.transaction.success),
      from: options.transaction.sender,
      to: to,
      actions: [],
    };
  }
}
