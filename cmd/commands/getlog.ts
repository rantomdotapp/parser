import EnvConfig from '../../configs/envConfig';
import { sleep } from '../../lib/helper';
import { getWorker } from '../../modules/worker';
import { ContextServices, IWorkerModule } from '../../types/namespaces';
import { BasicCommand } from '../basic';

export class GetlogCommand extends BasicCommand {
  public readonly name: string = 'getlog';
  public readonly describe: string = 'Query logs, parse them to actions and save to database';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    const services: ContextServices = await super.getServices();

    const worker: IWorkerModule | null = getWorker(EnvConfig.blockchains[argv.chain], services);

    while (true) {
      if (worker) {
        await worker.run({
          fromBlock: argv.fromBlock,
        });
      }

      if (argv.exit) {
        process.exit(0);
      }

      await sleep(60);
    }
  }

  public setOptions(yargs: any) {
    return yargs.option({
      chain: {
        type: 'string',
        default: 'ethereum',
        describe: 'Index logs from given blockchain',
      },
      fromBlock: {
        type: 'number',
        default: 0,
        describe: 'Index logs from given block number',
      },
      exit: {
        type: 'boolean',
        default: false,
        describe: 'Do not run worker in loop',
      },
    });
  }
}
