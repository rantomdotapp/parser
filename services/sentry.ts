import * as Sentry from '@sentry/node';

import logger from '../lib/logger';
import { ISentryService } from '../types/namespaces';

export default class SentryService implements ISentryService {
  public readonly name: string = 'sentry';
  protected readonly _dns: string;

  constructor(dns: string) {
    this._dns = dns;

    // load sentry now
    Sentry.init({
      dsn: this._dns,

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    });
  }

  public capture(e: any) {
    logger.debug('captured exception', {
      service: this.name,
      error: e.message,
    });
    Sentry.captureException(e);
  }

  public captureMessage(message: string) {
    logger.debug('captured message', {
      service: this.name,
      message: message,
    });
    Sentry.captureMessage(message);
  }
}
