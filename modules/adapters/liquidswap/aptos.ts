import BigNumber from 'bignumber.js';

import { ProtocolConfig } from '../../../types/configs';
import { EventLogAction, KnownAction } from '../../../types/domains';
import { ContextServices } from '../../../types/namespaces';
import { AdapterParseLogOptions } from '../../../types/options';
import ProtocolAdapter from '../adapter';

const Signatures = {
  SwapEvent: '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::liquidity_pool::SwapEvent',
  AddLiquidityEvent:
    '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::liquidity_pool::LiquidityAddedEvent',
  RemoveLiquidityEvent:
    '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::liquidity_pool::LiquidityRemovedEvent',
};

export default class LiquidswapAdapterAptos extends ProtocolAdapter {
  public readonly name: string = 'adapter.liquidswap.aptos';

  constructor(config: ProtocolConfig, services: ContextServices) {
    super(config, services);
  }

  public async parseEventLog(options: AdapterParseLogOptions): Promise<EventLogAction | null> {
    const { chain, from, event } = options;

    const signature = event.type.split('<')[0];
    if (
      signature === Signatures.SwapEvent ||
      signature === Signatures.AddLiquidityEvent ||
      signature === Signatures.RemoveLiquidityEvent
    ) {
      const contract = event.guid && event.guid.account_address ? event.guid.account_address : '';

      if (this.config.contracts[chain] && this.config.contracts[chain].indexOf(contract) !== -1) {
        const tokenAddresses: Array<string> = event.type.split('<')[1].replace('>', '').split(', ');
        const token0 = await this.services.blockchains[chain].getTokenInfo(chain, tokenAddresses[0]);
        const token1 = await this.services.blockchains[chain].getTokenInfo(chain, tokenAddresses[1]);

        if (token0 && token1) {
          if (signature === Signatures.SwapEvent) {
            let tokenIn;
            let tokenOut;
            let amountIn = '0';
            let amountOut = '0';

            if (event.data.x_in !== '0') {
              // swap from token 0 -> token1
              tokenIn = token0;
              tokenOut = token1;
              amountIn = new BigNumber(event.data.x_in.toString())
                .dividedBy(new BigNumber(10).pow(tokenIn.decimals))
                .toString(10);
              amountOut = new BigNumber(event.data.y_out.toString())
                .dividedBy(new BigNumber(10).pow(tokenOut.decimals))
                .toString(10);
            } else {
              tokenIn = token1;
              tokenOut = token0;
              amountIn = new BigNumber(event.data.y_in.toString())
                .dividedBy(new BigNumber(10).pow(tokenIn.decimals))
                .toString(10);
              amountOut = new BigNumber(event.data.x_out.toString())
                .dividedBy(new BigNumber(10).pow(tokenOut.decimals))
                .toString(10);
            }

            return {
              protocol: this.config.protocol,
              action: 'swap',
              contract: event.guid.account_address,
              addresses: [from],
              tokens: [tokenIn, tokenOut],
              tokenAmounts: [amountIn, amountOut],
              readableString: `${from} swap ${amountIn} ${tokenIn.symbol} for ${amountOut} ${tokenOut.symbol} on ${this.config.protocol} chain ${chain}`,
            };
          } else {
            const amount0 = new BigNumber(
              signature === Signatures.AddLiquidityEvent ? event.data.added_x_val : event.data.returned_x_val,
            )
              .dividedBy(new BigNumber(10).pow(token0.decimals))
              .toString(10);
            const amount1 = new BigNumber(
              signature === Signatures.AddLiquidityEvent ? event.data.added_y_val : event.data.returned_y_val,
            )
              .dividedBy(new BigNumber(10).pow(token1.decimals))
              .toString(10);
            const action: KnownAction = signature === Signatures.AddLiquidityEvent ? 'deposit' : 'withdraw';

            return {
              protocol: this.config.protocol,
              action: action,
              contract: event.guid.account_address,
              addresses: [from],
              tokens: [token0, token1],
              tokenAmounts: [amount0, amount1],
              readableString: `${from} ${action} ${amount0} ${token0.symbol} and ${amount1} ${token1.symbol} on ${this.config.protocol} chain ${chain}`,
            };
          }
        }
      }
    }

    return null;
  }
}
