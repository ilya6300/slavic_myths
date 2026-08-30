import { describe, expect, it } from 'vitest';
import { miracleChest } from '../config/lootTables';
import { createDefaultSave } from './GameSave';
import { rollMiracleChestLoot } from './miracleChestLoot';

function baseState() {
  const save = createDefaultSave();
  return {
    ownedSkinIds: [...save.ownedSkinIds],
    ownedTitleIds: [...save.ownedTitleIds],
    spiritStatuses: {
      ...save.spiritStatuses,
      susedko: 'defeated' as const,
      leshiy: 'defeated' as const,
      lada: 'locked' as const,
    },
    fragmentCounts: { ...save.fragmentCounts },
    selectedFragmentSpiritId: 'lada' as const,
    domovoySkinId: save.skins.domovoy,
  };
}

describe('miracleChestLoot', () => {
  it('should guarantee fragment on pity threshold', () => {
    const state = baseState();
    const pity = miracleChest.fragmentPityEvery - 1;
    const { loot, gotFragment, nextPityCounter } = rollMiracleChestLoot(
      state,
      pity,
      () => 0.99,
    );
    expect(gotFragment).toBe(true);
    expect(loot.kind).toBe('fragment');
    expect(loot.itemId).toBe('lada');
    expect(nextPityCounter).toBe(0);
  });

  it('should reset pity after fragment drop', () => {
    const state = baseState();
    const { gotFragment, nextPityCounter } = rollMiracleChestLoot(
      state,
      0,
      () => 0,
    );
    expect(gotFragment).toBe(true);
    expect(nextPityCounter).toBe(0);
  });

  it('should increment pity on consolation', () => {
    const state = baseState();
    const { gotFragment, nextPityCounter } = rollMiracleChestLoot(
      state,
      2,
      () => 0.99,
    );
    expect(gotFragment).toBe(false);
    expect(nextPityCounter).toBe(3);
  });
});
