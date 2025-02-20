import { Balance, BehaviorObservable, DelegationTracker, TransactionalTracker, TransactionsTracker } from './services';
import { Cardano, NetworkInfo, ProtocolParametersRequiredByWallet } from '@cardano-sdk/core';
import { GroupedAddress } from './KeyManagement';
import { TxInternals } from './Transaction';

export type InitializeTxProps = {
  outputs?: Set<Cardano.TxOut>;
  certificates?: Cardano.Certificate[];
  withdrawals?: Cardano.Withdrawal[];
  options?: {
    validityInterval?: Cardano.ValidityInterval;
  };
};

export interface FinalizeTxProps {
  readonly body: Cardano.TxBodyAlonzo;
}

export type Assets = Map<Cardano.AssetId, Cardano.Asset>;

export interface Wallet {
  name: string;
  readonly balance: TransactionalTracker<Balance>;
  readonly delegation: DelegationTracker;
  readonly utxo: TransactionalTracker<Cardano.Utxo[]>;
  readonly transactions: TransactionsTracker;
  readonly tip$: BehaviorObservable<Cardano.Tip>;
  readonly genesisParameters$: BehaviorObservable<Cardano.CompactGenesis>;
  readonly networkInfo$: BehaviorObservable<NetworkInfo>;
  readonly protocolParameters$: BehaviorObservable<ProtocolParametersRequiredByWallet>;
  readonly addresses$: BehaviorObservable<GroupedAddress[]>;
  readonly assets$: BehaviorObservable<Assets>;
  initializeTx(props: InitializeTxProps): Promise<TxInternals>;
  finalizeTx(props: TxInternals): Promise<Cardano.NewTxAlonzo>;
  /**
   * @throws {Cardano.TxSubmissionError}
   */
  submitTx(tx: Cardano.NewTxAlonzo): Promise<void>;
  sync(): void;
  shutdown(): void;
}
