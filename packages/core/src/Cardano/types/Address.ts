import * as util from '../util';

/**
 * mainnet or testnet address as bech32 string, consisting of
 * network tag, payment credential and optional stake credential
 */
export type Address = util.OpaqueString<'Address'>;

/**
 * @param {string} value mainnet or testnet address as bech32 string
 * @throws InvalidStringError
 */
export const Address = (value: string): Address => util.typedBech32(value, ['addr', 'addr_test'], [47, 92]);
