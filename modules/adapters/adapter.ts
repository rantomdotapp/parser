import { expect } from 'chai';

import { ProtocolConfig } from '../../types/configs';
import { EventLogAction } from '../../types/domains';
import { ContextServices, IProtocolAdapter } from '../../types/namespaces';
import { AdapterParseLogOptions, AdapterParseLogTestCase } from '../../types/options';

export default class ProtocolAdapter implements IProtocolAdapter {
  public readonly name: string = 'adapter';

  public config: ProtocolConfig;
  public services: ContextServices;

  protected testcases: Array<AdapterParseLogTestCase> = [];

  constructor(config: ProtocolConfig, services: ContextServices) {
    this.config = config;
    this.services = services;
  }

  public async parseEventLog(options: AdapterParseLogOptions): Promise<EventLogAction | null> {
    return null;
  }

  public async runTest(): Promise<void> {
    for (const testCase of this.testcases) {
      const eventLogAction = await this.parseEventLog(testCase.options);
      if (eventLogAction) {
        expect(eventLogAction.action).equal(testCase.expected.action);
        expect(JSON.stringify(eventLogAction.tokens)).equal(JSON.stringify(testCase.expected.tokens));
        expect(JSON.stringify(eventLogAction.tokenAmounts)).equal(JSON.stringify(testCase.expected.tokenAmounts));
        expect(JSON.stringify(eventLogAction.addresses)).equal(JSON.stringify(testCase.expected.addresses));
      }
    }
  }
}
