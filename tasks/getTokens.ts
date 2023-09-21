import axios from 'axios';
import * as fs from 'fs';

import { Token } from '../types/configs';

const PancakeSwapList = 'https://raw.githubusercontent.com/pancakeswap/token-list/main/lists/pancakeswap-aptos.json';

(async function () {
  const tokens: { [key: string]: Token } = {};

  const response = await axios.get(PancakeSwapList);
  for (const token of response.data.tokens) {
    tokens[token.symbol] = {
      chain: 'aptos',
      symbol: token.symbol,
      decimals: token.decimals,
      address: token.address,
    };
  }

  fs.writeFileSync('./configs/tokens/aptos.json', JSON.stringify(tokens));
})();
