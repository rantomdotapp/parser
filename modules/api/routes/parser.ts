import { HttpStatusCode } from 'axios';
import { Router } from 'express';

import EnvConfig from '../../../configs/envConfig';
import { getTimestamp } from '../../../lib/helper';
import { ContextServices } from '../../../types/namespaces';
import { ParserModule } from '../../parser';
import { getRequestIp } from '../helpers';
import { writeResponse } from '../middleware';

export function getRouter(services: ContextServices): Router {
  const router = Router({ mergeParams: true });

  router.get('/parse/:hash', async (request, response) => {
    const { hash } = request.params;

    if (!hash) {
      writeResponse(request, response, HttpStatusCode.BadRequest, {
        error: 'invalid transaction hash',
      });
    } else {
      const parser = new ParserModule(services);
      const transactions = await parser.parseTransaction({ hash });

      writeResponse(request, response, HttpStatusCode.Ok, transactions);

      // log the request into database for analytic later
      const remoteAddress = getRequestIp(request);
      const uerAgent = request.header('User-Agent');

      const collection = await services.mongodb.getCollection(EnvConfig.mongodb.collections.apiLogs);
      await collection.insertOne({
        hash: hash,
        timestamp: getTimestamp(),
        remoteAddress: remoteAddress,
        userAgent: uerAgent,
      });
    }
  });

  return router;
}
