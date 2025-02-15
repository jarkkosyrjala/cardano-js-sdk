import { Hash32ByteBase16 } from '../../util';
import { Lovelace } from '../Value';
import { PoolId } from './primitives';
import { Relay } from './Relay';
import { RewardAccount } from '../RewardAccount';
import { VrfVkHex } from '.';

export interface Fraction {
  numerator: number;
  denominator: number;
}
export interface PoolMetadataJson {
  hash: Hash32ByteBase16;
  url: string;
}

export interface PoolParameters {
  id: PoolId;
  rewardAccount: RewardAccount;
  /**
   * Declared pledge quantity.
   */
  pledge: Lovelace;
  /**
   * Fixed stake pool running cost
   */
  cost: Lovelace;
  /**
   * Stake pool margin percentage
   */
  margin: Fraction;
  /**
   * Metadata location and hash
   */
  metadataJson?: PoolMetadataJson;
  /**
   * Stake pool relays
   */
  relays: Relay[];

  owners: RewardAccount[];
  vrf: VrfVkHex;
}
