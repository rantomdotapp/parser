import cors from 'cors';
import express from 'express';
import path from 'path';

import logger from '../../lib/logger';
import getRouter from '../../modules/api';
import { ContextServices } from '../../types/namespaces';
import { BasicCommand } from '../basic';

export class ServeCommand extends BasicCommand {
  public readonly name: string = 'serve';
  public readonly describe: string = 'Serve restful API server';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    const services: ContextServices = await super.getServices();

    const router = getRouter(services);

    const port = argv.port || process.env.PORT || '8080';

    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use('/api/v1', router);

    app.use('/', express.static(path.join('.', 'public')));

    app.listen(port, () => {
      logger.info('started rest API service', {
        service: 'api',
        address: `0.0.0.0:${port}`,
      });
    });
  }

  public setOptions(yargs: any) {
    return yargs.option({
      port: {
        type: 'number',
        default: 0,
        describe: 'The port number to listen',
      },
    });
  }
}
