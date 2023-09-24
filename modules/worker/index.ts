import { Blockchain } from '../../types/configs';
import { ContextServices, IWorkerModule } from '../../types/namespaces';
import AptosWorkerModule from './aptos';

export function getWorker(config: Blockchain, services: ContextServices): IWorkerModule | null {
  switch (config.family) {
    case 'aptos': {
      return new AptosWorkerModule(config.name, services);
    }
    default: {
      return null;
    }
  }
}
