import { CSL, Cardano } from '@cardano-sdk/core';
import { TxInternals } from '../Transaction';

/** Internal = change address & External = receipt address */
export enum AddressType {
  /**
   * Change address
   */
  Internal = 1,
  /**
   * Receipt address
   */
  External = 0
}

export enum KeyType {
  External = 0,
  Internal = 1,
  Stake = 2
}

export interface GroupedAddress {
  networkId: Cardano.NetworkId;
  type: AddressType;
  accountIndex: number;
  addressIndex: number;
  address: Cardano.Address;
  rewardAccount: Cardano.RewardAccount;
}

export interface KeyManager {
  // TODO: do not expose CSL objects publicly
  // Reconsider which keys should be exposed, if any.
  extendedAccountPublicKey: CSL.Bip32PublicKey;
  derivePublicKey: (type: KeyType, index: number) => CSL.PublicKey;
  // See https://github.com/cardano-foundation/CIPs/tree/master/CIP-1852#specification
  deriveAddress: (type: AddressType, index: number) => GroupedAddress;
  signMessage: (
    addressType: AddressType,
    signingIndex: number,
    message: string
  ) => Promise<{ publicKey: string; signature: string }>;
  signTransaction: (tx: TxInternals) => Promise<Cardano.Witness['signatures']>;
}
