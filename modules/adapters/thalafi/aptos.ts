import BigNumber from 'bignumber.js';

import { Tokens } from '../../../configs';
import { ProtocolConfig } from '../../../types/configs';
import { EventLogAction } from '../../../types/domains';
import { ContextServices } from '../../../types/namespaces';
import { AdapterParseLogOptions } from '../../../types/options';
import ProtocolAdapter from '../adapter';

const Signatures = {
  SwapEvent: '0x6970b4878c3aea96732be3f31c2dded12d94d9455ff0c76c67d84859dce35136::lbp::SwapEvent',

  PsmMint: '0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::psm::MODMintEvent',
  PsmRedeem: '0x6f986d146e4a90b828d8c12c14b6f4e003fdff11a8eecceceb63744363eaac01::psm::MODRedemptionEvent',
};

export default class ThalafiAdapterAptos extends ProtocolAdapter {
  public readonly name: string = 'adapter.thalafi.aptos';

  constructor(config: ProtocolConfig, services: ContextServices) {
    super(config, services);
  }

  public async parseEventLog(options: AdapterParseLogOptions): Promise<EventLogAction | null> {
    const { chain, event } = options;

    const signature = event.type.split('<')[0];
    if (signature === Signatures.SwapEvent || signature === Signatures.PsmMint || signature === Signatures.PsmRedeem) {
      const contract = event.guid && event.guid.account_address ? event.guid.account_address : '';

      if (this.config.contracts[chain] && this.config.contracts[chain].indexOf(contract) !== -1) {
        if (signature === Signatures.SwapEvent) {
          const tokenAddresses: Array<string> = event.type.split('<')[1].replace('>', '').split(', ');
          const token0 = await this.services.blockchains[chain].getTokenInfo(chain, tokenAddresses[0]);
          const token1 = await this.services.blockchains[chain].getTokenInfo(chain, tokenAddresses[1]);

          if (token0 && token1) {
            if (signature === Signatures.SwapEvent) {
              let tokenIn;
              let tokenOut;

              const isBuy = Boolean(event.data.is_buy);
              if (isBuy) {
                tokenIn = token0;
                tokenOut = token1;
              } else {
                tokenIn = token1;
                tokenOut = token0;
              }

              const amountIn = new BigNumber(event.data.amount_in.toString())
                .dividedBy(new BigNumber(10).pow(tokenIn.decimals))
                .toString(10);
              const amountOut = new BigNumber(event.data.amount_out.toString())
                .dividedBy(new BigNumber(10).pow(tokenOut.decimals))
                .toString(10);

              const user = event.data.creator_addr;

              return {
                protocol: this.config.protocol,
                action: 'swap',
                contract: event.guid.account_address,
                addresses: [user],
                tokens: [tokenIn, tokenOut],
                tokenAmounts: [amountIn, amountOut],
                readableString: `${user} swap ${amountIn} ${tokenIn.symbol} for ${amountOut} ${tokenOut.symbol} on ${this.config.protocol} chain ${chain}`,
              };
            }
          }
        } else if (signature === Signatures.PsmMint || signature === Signatures.PsmRedeem) {
          const tokenAddress: string = event.type.split('<')[1].replace('>', '');
          const token = await this.services.blockchains[chain].getTokenInfo(chain, tokenAddress);
          if (token) {
            const tokenAmount = new BigNumber(
              signature === Signatures.PsmMint ? event.data.coin_amount_in : event.data.coin_amount_out,
            )
              .dividedBy(new BigNumber(10).pow(token.decimals))
              .toString(10);
            const modAmount = new BigNumber(
              signature === Signatures.PsmMint ? event.data.mod_minted : event.data.mod_burned,
            )
              .dividedBy(1e8)
              .toString(10);

            return {
              protocol: this.config.protocol,
              action: signature === Signatures.PsmMint ? 'borrow' : 'repay',
              contract: event.guid.account_address,
              addresses: [options.from],
              tokens: [Tokens.aptos.MOD],
              tokenAmounts: [modAmount],
              readableString: `${options.from} ${
                signature === Signatures.PsmMint ? 'borrow' : 'repay'
              } ${modAmount} MOD on ${this.config.protocol} chain ${chain}`,
              subActions: [
                {
                  protocol: this.config.protocol,
                  action: signature === Signatures.PsmMint ? 'deposit' : 'withdraw',
                  contract: event.guid.account_address,
                  addresses: [options.from],
                  tokens: [token],
                  tokenAmounts: [tokenAmount],
                  readableString: `${options.from} ${
                    signature === Signatures.PsmMint ? 'deposit' : 'withdraw'
                  } ${tokenAmount} ${token.symbol} on ${this.config.protocol} chain ${chain}`,
                },
              ],
            };
          }
        }
      }
    }

    return null;
  }
}
