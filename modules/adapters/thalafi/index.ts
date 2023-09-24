import { Tokens } from '../../../configs';
import { ProtocolConfig } from '../../../types/configs';
import { EventLogAction } from '../../../types/domains';
import { ContextServices } from '../../../types/namespaces';
import { AdapterParseLogOptions, AdapterParseLogTestCase } from '../../../types/options';
import ProtocolAdapter from '../adapter';
import ThalafiAdapterAptos from './aptos';

const AptosTestCases: Array<AdapterParseLogTestCase> = [
  {
    options: {
      chain: 'aptos',
      family: 'aptos',
      hash: '0x68a2599ff910c99113ae02c9fff6e62881eb14c94c3f6a47dbc704f1b2e4ae24',
      blockNumber: 114810485,
      from: '0xbef0f6f38cdf921739e907b50985de393991601fd8d56e82c87cc286891397fa',
      to: '0x6970b4878c3aea96732be3f31c2dded12d94d9455ff0c76c67d84859dce35136',
      input: {
        function: '0x6970b4878c3aea96732be3f31c2dded12d94d9455ff0c76c67d84859dce35136::lbp_scripts::swap_exact_in',
        type_arguments: [
          '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC',
          '0x7fd500c11216f0fe3095d0c4b8aa4d64a4e2e04f83758462f2b127255643615::thl_coin::THL',
          '0x7fd500c11216f0fe3095d0c4b8aa4d64a4e2e04f83758462f2b127255643615::thl_coin::THL',
          '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC',
        ],
        arguments: ['0x4dcae85fc5559071906cd5c76b7420fcbb4b0a92f00ab40ffc394aadbbff5ee9', '4000000000', '24493858'],
        type: 'entry_function_payload',
      },
      event: {
        guid: {
          creation_number: '7',
          account_address: '0x6970b4878c3aea96732be3f31c2dded12d94d9455ff0c76c67d84859dce35136',
        },
        sequence_number: '3888',
        type: '0x6970b4878c3aea96732be3f31c2dded12d94d9455ff0c76c67d84859dce35136::lbp::SwapEvent<0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC, 0x7fd500c11216f0fe3095d0c4b8aa4d64a4e2e04f83758462f2b127255643615::thl_coin::THL>',
        data: {
          amount_in: '4000000000',
          amount_out: '24610948',
          balance_0: '3555928684245',
          balance_1: '245193377299518',
          creator_addr: '0x4dcae85fc5559071906cd5c76b7420fcbb4b0a92f00ab40ffc394aadbbff5ee9',
          fee_amount: '40000000',
          is_buy: false,
          weight_0: {
            v: '12912430486180711072',
          },
          weight_1: {
            v: '5534313587528840544',
          },
        },
      },
    },
    expected: {
      action: 'swap',
      addresses: ['0x4dcae85fc5559071906cd5c76b7420fcbb4b0a92f00ab40ffc394aadbbff5ee9'],
      tokens: [Tokens.aptos.THL, Tokens.aptos.lzUSDC],
      tokenAmounts: ['40', '24.610948'],
    },
  },
  {
    options: {
      chain: 'aptos',
      family: 'aptos',
      hash: '0xef5db16c8e6363dc925e99e7c5e57dafe302be7cf1e371852ac208b7eecf9d75',
      blockNumber: 269437293,
      from: '0xb2139aca8b2997ad45589418cae4791e60abd5677c99c6e6a20053b32c9ae513',
      to: '0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01',
      input: {
        function: '0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::psm_scripts::redeem',
        type_arguments: ['0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T'],
        arguments: ['752010553'],
        type: 'entry_function_payload',
      },
      event: {
        guid: {
          creation_number: '98',
          account_address: '0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01',
        },
        sequence_number: '19',
        type: '0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::psm::MODRedemptionEvent<0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T>',
        data: {
          coin_amount_out: '7501305',
          coin_fee_amount: '18800',
          mod_burned: '752010553',
        },
      },
    },
    expected: {
      action: 'repay',
      addresses: ['0xb2139aca8b2997ad45589418cae4791e60abd5677c99c6e6a20053b32c9ae513'],
      tokens: [Tokens.aptos.MOD],
      tokenAmounts: ['7.52010553'],
    },
  },
  {
    options: {
      chain: 'aptos',
      family: 'aptos',
      hash: '0x215ae765eac81679e71f41ae1a01a21b080ed568b7356e7ed168ada2221d07c8',
      blockNumber: 269379632,
      from: '0x66c58a88956c49bd76f8548729611d0dd13d0a24812ec602d4a0037b15a89efd',
      to: '0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01',
      input: {
        function: '0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::psm_scripts::mint',
        type_arguments: ['0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC'],
        arguments: ['1'],
        type: 'entry_function_payload',
      },
      event: {
        guid: {
          creation_number: '93',
          account_address: '0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01',
        },
        sequence_number: '1207',
        type: '0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::psm::MODMintEvent\u003C0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC\u003E',
        data: {
          coin_amount_in: '1',
          coin_fee_amount: '0',
          mod_minted: '100',
        },
      },
    },
    expected: {
      action: 'borrow',
      addresses: ['0x66c58a88956c49bd76f8548729611d0dd13d0a24812ec602d4a0037b15a89efd'],
      tokens: [Tokens.aptos.MOD],
      tokenAmounts: ['0.000001'],
    },
  },
];

export default class ThalafiAdapter extends ProtocolAdapter {
  public readonly name: string = 'adapter.thalafi';

  constructor(config: ProtocolConfig, services: ContextServices) {
    super(config, services);

    this.testcases = AptosTestCases;
  }

  public async parseEventLog(options: AdapterParseLogOptions): Promise<EventLogAction | null> {
    const { chain } = options;

    if (chain === 'aptos') {
      const aptosAdapter = new ThalafiAdapterAptos(this.config, this.services);
      return await aptosAdapter.parseEventLog(options);
    }

    return null;
  }
}
