import { CSL, Cardano, SerializationError, coreToCsl } from '../../src';

describe('coreToCsl.certificate', () => {
  let stakeKey: Cardano.RewardAccount;
  let poolId: Cardano.PoolId;

  beforeAll(async () => {
    stakeKey = Cardano.RewardAccount('stake1u89sasnfyjtmgk8ydqfv3fdl52f36x3djedfnzfc9rkgzrcss5vgr');
    poolId = Cardano.PoolId('pool1mpgg03jxj52qwxvvy7cmj58a96vl9pvxcqqvuw0kumheygxmn34');
  });

  it('throws SerializationError with invalid stake key', () => {
    expect(() => coreToCsl.certificate.stakeKeyRegistration(poolId as unknown as Cardano.RewardAccount)).toThrowError(
      SerializationError
    );
  });

  it('stakeKeyRegistration', () =>
    expect(
      CSL.RewardAddress.new(
        1,
        coreToCsl.certificate.stakeKeyRegistration(stakeKey).as_stake_registration()!.stake_credential()
      )
        ?.to_address()
        .to_bech32()
    ).toBe(stakeKey));

  it('stakeKeyDeregistration', () =>
    expect(
      CSL.RewardAddress.new(
        1,
        coreToCsl.certificate.stakeKeyDeregistration(stakeKey).as_stake_deregistration()!.stake_credential()
      )
        ?.to_address()
        .to_bech32()
    ).toBe(stakeKey));

  it('stakeDelegation', () => {
    const delegation = coreToCsl.certificate.stakeDelegation(stakeKey, poolId).as_stake_delegation()!;
    expect(CSL.RewardAddress.new(1, delegation.stake_credential()).to_address().to_bech32()).toBe(stakeKey);
    expect(delegation.pool_keyhash().to_bech32('pool')).toBe(poolId);
  });

  it('poolRegistration', () => {
    const owner = Cardano.RewardAccount('stake1u89sasnfyjtmgk8ydqfv3fdl52f36x3djedfnzfc9rkgzrcss5vgr');
    const vrf = Cardano.VrfVkHex('8dd154228946bd12967c12bedb1cb6038b78f8b84a1760b1a788fa72a4af3db0');
    const rewardAccount = stakeKey;
    const metadataJson = {
      hash: Cardano.Hash32ByteBase16('0f3abbc8fc19c2e61bab6059bf8a466e6e754833a08a62a6c56fe0e78f19d9d5'),
      url: 'https://example.com'
    };
    const params = coreToCsl.certificate
      .poolRegistration({
        cost: 1000n,
        id: poolId,
        margin: { denominator: 5, numerator: 1 },
        metadataJson,
        owners: [owner],
        pledge: 10_000n,
        relays: [
          { __typename: 'RelayByName', hostname: 'example.com', port: 5000 },
          {
            __typename: 'RelayByAddress',
            ipv4: '127.0.0.1',
            port: 6000
          },
          { __typename: 'RelayByNameMultihost', dnsName: 'example.com' }
        ],
        rewardAccount,
        vrf
      })
      .as_pool_registration()!
      .pool_params();
    expect(params.cost().to_str()).toBe('1000');
    expect(params.pledge().to_str()).toBe('10000');
    const margin = params.margin();
    expect(margin.numerator().to_str()).toBe('1');
    expect(margin.denominator().to_str()).toBe('5');
    const owners = params.pool_owners();
    expect(owners.len()).toBe(1);
    expect(
      CSL.RewardAddress.new(1, CSL.StakeCredential.from_keyhash(owners.get(0)))
        .to_address()
        .to_bech32()
    ).toBe(owner);
    expect(params.operator().to_bech32('pool')).toBe(poolId);
    const relays = params.relays();
    expect(relays.len()).toBe(3);
    expect(Buffer.from(params.vrf_keyhash().to_bytes()).toString('hex')).toBe(vrf);
    expect(params.reward_account().to_address().to_bech32('stake')).toBe(rewardAccount);
    const metadata = params.pool_metadata()!;
    expect(metadata.url().url()).toBe(metadataJson.url);
    expect(Buffer.from(metadata.pool_metadata_hash().to_bytes()).toString('hex')).toBe(metadataJson.hash);
  });

  it('poolRetirement', () => {
    const retirement = coreToCsl.certificate.poolRetirement(poolId, 1000).as_pool_retirement()!;
    expect(retirement.pool_keyhash().to_bech32('pool')).toEqual(poolId);
    expect(retirement.epoch()).toEqual(1000);
  });
});
