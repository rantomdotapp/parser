import { Tokens } from '../../../configs';
import { ProtocolConfig } from '../../../types/configs';
import { EventLogAction } from '../../../types/domains';
import { ContextServices } from '../../../types/namespaces';
import { AdapterParseLogOptions, AdapterParseLogTestCase } from '../../../types/options';
import ProtocolAdapter from '../adapter';
import LiquidswapAdapterAptos from './aptos';

const AptosTestCases: Array<AdapterParseLogTestCase> = [
  {
    options: {
      chain: 'aptos',
      family: 'aptos',
      hash: '0x90713f48310b2fcd612d9c1219dd48c16998d2546b701ec203a4d6705ec6c9d9',
      blockNumber: 270037700,
      from: '0xd871df2675ffa780253880936095ea1b37ab66f68e4c13a76fd29165ffd95de1',
      to: '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12',
      input: {
        function: '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::scripts_v2::swap',
        type_arguments: [
          '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT',
          '0x1::aptos_coin::AptosCoin',
          '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated',
        ],
        arguments: ['30420000', '583451507'],
        type: 'entry_function_payload',
      },
      event: {
        guid: {
          creation_number: '338',
          account_address: '0x5a97986a9d031c4567e15b797be516910cfcb4156312482efc6a19c0a30c948',
        },
        sequence_number: '742652',
        type: '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::liquidity_pool::SwapEvent\u003C0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDT, 0x1::aptos_coin::AptosCoin, 0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::curves::Uncorrelated\u003E',
        data: {
          x_in: '30420000',
          x_out: '0',
          y_in: '0',
          y_out: '586378197',
        },
      },
    },
    expected: {
      action: 'swap',
      addresses: ['0xd871df2675ffa780253880936095ea1b37ab66f68e4c13a76fd29165ffd95de1'],
      tokens: [Tokens.aptos.lzUSDT, Tokens.aptos.APT],
      tokenAmounts: ['30.42', '5.86378197'],
    },
  },
];

export default class LiquidswapAdapter extends ProtocolAdapter {
  public readonly name: string = 'adapter.liquidswap';

  constructor(config: ProtocolConfig, services: ContextServices) {
    super(config, services);

    this.testcases = AptosTestCases;
  }

  public async parseEventLog(options: AdapterParseLogOptions): Promise<EventLogAction | null> {
    const { chain } = options;

    if (chain === 'aptos') {
      const aptosAdapter = new LiquidswapAdapterAptos(this.config, this.services);
      return await aptosAdapter.parseEventLog(options);
    }

    return null;
  }
}
