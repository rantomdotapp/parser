import { NextFunction, Request, Response } from 'express';

import logger from '../../lib/logger';
import { getRequestIp } from './helpers';

export function middleware(request: Request, response: Response, next: NextFunction) {
  (request as any).requestTimestamp = new Date().getTime();

  next();
}

export function writeResponse(request: Request, response: Response, status: number, data: any) {
  const elapsed = new Date().getTime() - (request as any).requestTimestamp;

  logger.info('served api request', {
    service: 'api',
    method: request.method,
    path: `${request.baseUrl}${request.path}`,
    status: status,
    elapsed: `${elapsed}ms`,
    ip: getRequestIp(request),
  });

  response.status(status).json(data);
}
