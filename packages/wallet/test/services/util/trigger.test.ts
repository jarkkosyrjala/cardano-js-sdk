import { Cardano, NetworkInfo } from '@cardano-sdk/core';
import { block$, epoch$ } from '../../../src/services/util';
import { createTestScheduler } from '../../testScheduler';

describe('trigger', () => {
  it('block$ emits when tip$ has new blockNo', () => {
    createTestScheduler().run(({ cold, expectObservable }) => {
      const tip$ = cold('a--b--c', {
        a: { blockNo: 100 } as Cardano.Tip,
        b: { blockNo: 100 } as Cardano.Tip,
        c: { blockNo: 101 } as Cardano.Tip
      });
      expectObservable(block$(tip$)).toBe('a-----b', {
        a: 100,
        b: 101
      });
    });
  });

  it('epoch$ emits when networkInfo$ has new currentEpoch.number', () => {
    createTestScheduler().run(({ cold, expectObservable }) => {
      const networkInfo = cold('a--b--c', {
        a: { currentEpoch: { number: 100 } } as NetworkInfo,
        b: { currentEpoch: { number: 100 } } as NetworkInfo,
        c: { currentEpoch: { number: 101 } } as NetworkInfo
      });
      expectObservable(epoch$(networkInfo)).toBe('a-----b', {
        a: 100,
        b: 101
      });
    });
  });
});
