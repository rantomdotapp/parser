import { expect } from 'chai';

import { Tokens } from '../../../configs';
import { ProtocolConfig } from '../../../types/configs';
import { EventLogAction } from '../../../types/domains';
import { ContextServices } from '../../../types/namespaces';
import {AdapterParseLogOptions, AdapterParseLogTestCase} from '../../../types/options';
import ProtocolAdapter from '../adapter';
import PancakeAdapterAptos from './aptos';

const AptosTestCases: Array<AdapterParseLogTestCase> = [
  {
    options: {
      chain: 'aptos',
      family: 'aptos',
      hash: '0xa468b58bf97dc0185f2225aad03921bc05ec3f4bfc14ed06c3424bd41f1f252d',
      blockNumber: 269931635,
      from: '0xd6d65c2d9d2503b896269b2a2c2829fdc8ba8eea9f0021c722a499ac35220a36',
      to: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa',
      input: {
        function: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::router::swap_exact_input',
        type_arguments: [
          '0x1::aptos_coin::AptosCoin',
          '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC',
        ],
        arguments: ['30965660', '0'],
        type: 'entry_function_payload',
      },
      event: {
        guid: {
          creation_number: '12',
          account_address: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa',
        },
        sequence_number: '1060551',
        type: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::SwapEvent<0x1::aptos_coin::AptosCoin, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>',
        data: {
          amount_x_in: '30965660',
          amount_x_out: '0',
          amount_y_in: '0',
          amount_y_out: '1597226',
          user: '0xd6d65c2d9d2503b896269b2a2c2829fdc8ba8eea9f0021c722a499ac35220a36',
        },
      },
    },
    expected: {
      action: 'swap',
      addresses: ['0xd6d65c2d9d2503b896269b2a2c2829fdc8ba8eea9f0021c722a499ac35220a36'],
      tokens: [Tokens.aptos.APT, Tokens.aptos.lzUSDC],
      tokenAmounts: ['0.3096566', '1.597226'],
    },
  },
  {
    options: {
      chain: 'aptos',
      family: 'aptos',
      hash: '0x519b0251312629fc413fedabe06edefdeecbaa00145354a7a2a19aa5feefce31',
      blockNumber: 269945097,
      from: '0xd0576e3fd255faafeb59e0546a3c5648a88a127f8e5af83646bd86ec5a225469',
      to: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa',
      input: {
        function: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::router::remove_liquidity',
        type_arguments: [
          '0x1::aptos_coin::AptosCoin',
          '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC',
        ],
        arguments: ['56710', '276225', '14262'],
        type: 'entry_function_payload',
      },
      event: {
        guid: {
          creation_number: '11',
          account_address: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa',
        },
        sequence_number: '7661',
        type: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::RemoveLiquidityEvent<0x1::aptos_coin::AptosCoin, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>',
        data: {
          amount_x: '277613',
          amount_y: '14334',
          fee_amount: '21222',
          liquidity: '56710',
          user: '0xd0576e3fd255faafeb59e0546a3c5648a88a127f8e5af83646bd86ec5a225469',
        },
      },
    },
    expected: {
      action: 'withdraw',
      addresses: ['0xd0576e3fd255faafeb59e0546a3c5648a88a127f8e5af83646bd86ec5a225469'],
      tokens: [Tokens.aptos.APT, Tokens.aptos.lzUSDC],
      tokenAmounts: ['0.00277613', '0.014334'],
    },
  },
  {
    options: {
      chain: 'aptos',
      family: 'aptos',
      hash: '0x9d54098d4ea361e3c5c4901ea63d244724c02ac7f4fb1f2c23994efc923c7a98',
      blockNumber: 269944316,
      from: '0xd0576e3fd255faafeb59e0546a3c5648a88a127f8e5af83646bd86ec5a225469',
      to: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa',
      input: {
        function: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::router::add_liquidity',
        type_arguments: [
          '0x1::aptos_coin::AptosCoin',
          '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC',
        ],
        arguments: ['277625', '14335', '276236', '14263'],
        type: 'entry_function_payload',
      },
      event: {
        guid: {
          creation_number: '10',
          account_address: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa',
        },
        sequence_number: '20567',
        type: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::AddLiquidityEvent<0x1::aptos_coin::AptosCoin, 0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC>',
        data: {
          amount_x: '277625',
          amount_y: '14335',
          fee_amount: '54394',
          liquidity: '56710',
          user: '0xd0576e3fd255faafeb59e0546a3c5648a88a127f8e5af83646bd86ec5a225469',
        },
      },
    },
    expected: {
      action: 'deposit',
      addresses: ['0xd0576e3fd255faafeb59e0546a3c5648a88a127f8e5af83646bd86ec5a225469'],
      tokens: [Tokens.aptos.APT, Tokens.aptos.lzUSDC],
      tokenAmounts: ['0.00277625', '0.014335'],
    },
  },
];

export default class PancakeAdapter extends ProtocolAdapter {
  public readonly name: string = 'adapter.pancake';

  constructor(config: ProtocolConfig, services: ContextServices) {
    super(config, services);

    this.testcases = AptosTestCases;
  }

  public async parseEventLog(options: AdapterParseLogOptions): Promise<EventLogAction | null> {
    const { chain } = options;

    if (chain === 'aptos') {
      const aptosAdapter = new PancakeAdapterAptos(this.config, this.services);
      return await aptosAdapter.parseEventLog(options);
    }

    return null;
  }
}
