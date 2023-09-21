import { ProtocolConfig } from '../types/configs';

export const PancakeConfigs: ProtocolConfig = {
  protocol: 'pancakeswap',
  contracts: {
    aptos: [
      '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa', // pancakeswap main contract
    ],
  },
};

export const ThalafiConfigs: ProtocolConfig = {
  protocol: 'thalafi',
  contracts: {
    aptos: [
      '0x6970b4878c3aea96732be3f31c2dded12d94d9455ff0c76c67d84859dce35136', // ThalaLaunch
      '0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01', // ThalaProtocol
    ],
  },
};
