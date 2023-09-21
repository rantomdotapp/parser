import { Token } from '../types/configs';
import AptosTokens from './tokens/aptos.json';

export const Tokens: { [key: string]: { [key: string]: Token } } = {
  aptos: AptosTokens,
};
