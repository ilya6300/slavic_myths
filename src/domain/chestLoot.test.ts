import { describe, expect, it } from 'vitest';
import { getBrownieLuckBonusPercent, getBrownieLuckMultiplier } from './brownieLuck';
import {
  applyChestLoot,
  chestTitlePoolExcludesMiracleEpoch,
  chestTypePoolsExcludeEpochTitles,
  rollRegularChestLoot,
  type ChestRollState,
} from './chestLoot';
import { createDefaultSave } from './GameSave';

function baseRollState(
  partial?: Partial<ChestRollState>,
): ChestRollState {
  const save = createDefaultSave();
  return {
    ownedSkinIds: [...save.ownedSkinIds],
    ownedTitleIds: [...save.ownedTitleIds],
    spiritStatuses: { ...save.spiritStatuses },
    fragmentCounts: { ...save.fragmentCounts },
    selectedFragmentSpiritId: save.selectedFragmentSpiritId,
    domovoySkinId: save.skins.domovoy,
    ...partial,
  };
}

describe('brownieLuck', () => {
  it('should return +1% for standard brownie skin', () => {
    expect(getBrownieLuckBonusPercent('brownie_standart')).toBe(1);
    expect(getBrownieLuckMultiplier('brownie_standart')).toBe(0.01);
  });

  it('should return +5% for epoch brownie skin', () => {
    expect(getBrownieLuckBonusPercent('the_age_of_miracles_brownie')).toBe(5);
  });
});

describe('chestLoot', () => {
  it('should exclude miracle epoch titles from chest pool', () => {
    expect(chestTitlePoolExcludesMiracleEpoch()).toBe(true);
    expect(chestTypePoolsExcludeEpochTitles()).toBe(true);
  });

  it('should roll obereg from deterministic rng', () => {
    const loot = rollRegularChestLoot(baseRollState(), () => 0.9999);
    expect(loot.kind).toBeTruthy();
  });

  it('should apply smetana as full energy', () => {
    const state = baseRollState();
    const patch = applyChestLoot(
      { kind: 'smetana' },
      {
        ...state,
        energy: 10,
        maxEnergy: 120,
        talismans: 2,
        spareChestKeys: 0,
        skins: createDefaultSave().skins,
      },
    );
    expect(patch.energy).toBe(120);
  });

  it('should unlock spirit on spirit_key loot', () => {
    const state = baseRollState();
    const patch = applyChestLoot(
      { kind: 'spirit_key', itemId: 'poludnica' },
      {
        ...state,
        energy: 100,
        maxEnergy: 100,
        talismans: 3,
        spareChestKeys: 0,
        skins: createDefaultSave().skins,
      },
    );
    expect(patch.spiritStatuses?.poludnica).toBe('available');
  });

  it('should add fragment on duplicate resolution', () => {
    const state = baseRollState({ selectedFragmentSpiritId: 'lada' });
    const patch = applyChestLoot(
      { kind: 'fragment', itemId: 'lada', wasDuplicate: true },
      {
        ...state,
        energy: 100,
        maxEnergy: 100,
        talismans: 3,
        spareChestKeys: 0,
        skins: createDefaultSave().skins,
      },
    );
    expect(patch.fragmentCounts?.lada).toBe(1);
  });

  it('should increment spare chest keys', () => {
    const state = baseRollState();
    const patch = applyChestLoot(
      { kind: 'spare_chest_key' },
      {
        ...state,
        energy: 100,
        maxEnergy: 100,
        talismans: 3,
        spareChestKeys: 1,
        skins: createDefaultSave().skins,
      },
    );
    expect(patch.spareChestKeys).toBe(2);
  });
});
