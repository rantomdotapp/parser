import BigNumber from 'bignumber.js';

import { ProtocolConfig } from '../../../types/configs';
import { EventLogAction, KnownAction } from '../../../types/domains';
import { ContextServices } from '../../../types/namespaces';
import { AdapterParseLogOptions } from '../../../types/options';
import ProtocolAdapter from '../adapter';

const Signatures = {
  Swap: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::SwapEvent',
  AddLiquidity: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::AddLiquidityEvent',
  RemoveLiquidity: '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa::swap::RemoveLiquidityEvent',
};

export default class PancakeAdapterAptos extends ProtocolAdapter {
  public readonly name: string = 'adapter.pancake.aptos';

  constructor(config: ProtocolConfig, services: ContextServices) {
    super(config, services);
  }

  public async parseEventLog(options: AdapterParseLogOptions): Promise<EventLogAction | null> {
    const { chain, event } = options;

    const signature = event.type.split('<')[0];
    if (
      signature === Signatures.Swap ||
      signature === Signatures.AddLiquidity ||
      signature === Signatures.RemoveLiquidity
    ) {
      if (event.guid && event.guid.account_address) {
        if (this.config.contracts[chain] && this.config.contracts[chain].indexOf(event.guid.account_address) !== -1) {
          const tokenAddresses: Array<string> = event.type.split('<')[1].replace('>', '').split(', ');
          const token0 = await this.services.blockchains[chain].getTokenInfo(chain, tokenAddresses[0]);
          const token1 = await this.services.blockchains[chain].getTokenInfo(chain, tokenAddresses[1]);

          if (token0 && token1) {
            if (signature === Signatures.Swap) {
              const tokenIn = event.data.amount_x_in !== '0' ? token0 : token1;
              const tokenOut = event.data.amount_x_in !== '0' ? token1 : token0;
              const amountIn =
                event.data.amount_x_in !== '0'
                  ? new BigNumber(event.data.amount_x_in.toString())
                      .dividedBy(new BigNumber(10).pow(tokenIn.decimals))
                      .toString(10)
                  : new BigNumber(event.data.amount_y_in.toString())
                      .dividedBy(new BigNumber(10).pow(tokenIn.decimals))
                      .toString(10);
              const amountOut =
                event.data.amount_x_out !== '0'
                  ? new BigNumber(event.data.amount_x_out.toString())
                      .dividedBy(new BigNumber(10).pow(tokenOut.decimals))
                      .toString(10)
                  : new BigNumber(event.data.amount_y_out.toString())
                      .dividedBy(new BigNumber(10).pow(tokenOut.decimals))
                      .toString(10);
              const user = event.data.user;

              return {
                protocol: this.config.protocol,
                action: 'swap',
                contract: event.guid.account_address,
                addresses: [user],
                tokens: [tokenIn, tokenOut],
                tokenAmounts: [amountIn, amountOut],
                readableString: `${user} swap ${amountIn} ${tokenIn.symbol} for ${amountOut} ${tokenOut.symbol} on ${this.config.protocol} chain ${chain}`,
              };
            } else {
              const amount0 = new BigNumber(event.data.amount_x.toString())
                .dividedBy(new BigNumber(10).pow(token0.decimals))
                .toString(10);
              const amount1 = new BigNumber(event.data.amount_y.toString())
                .dividedBy(new BigNumber(10).pow(token1.decimals))
                .toString(10);
              const user = event.data.user;
              const action: KnownAction = signature === Signatures.AddLiquidity ? 'deposit' : 'withdraw';

              return {
                protocol: this.config.protocol,
                action: action,
                contract: event.guid.account_address,
                addresses: [user],
                tokens: [token0, token1],
                tokenAmounts: [amount0, amount1],
                readableString: `${user} ${action} ${amount0} ${token0.symbol} and ${amount1} ${token1.symbol} on ${this.config.protocol} chain ${chain}`,
              };
            }
          }
        }
      }
    }

    return null;
  }
}
