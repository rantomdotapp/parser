import { PancakeConfigs, ThalafiConfigs } from '../../configs/protocols';
import { ContextServices, IProtocolAdapter } from '../../types/namespaces';
import PancakeAdapter from './pancake';
import ThalafiAdapter from './thalafi';

export function getAdapters(services: ContextServices): Array<IProtocolAdapter> {
  const mapping = getAdapterMapping(services);
  return [...Object.keys(mapping).map((key) => mapping[key])];
}

export function getAdapterMapping(services: ContextServices): { [key: string]: IProtocolAdapter } {
  return {
    pancake: new PancakeAdapter(PancakeConfigs, services),
    thalafi: new ThalafiAdapter(ThalafiConfigs, services),
  };
}
