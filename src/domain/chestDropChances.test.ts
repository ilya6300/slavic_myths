import { describe, expect, it } from 'vitest';

import {
  applyChestGradeWeights,
  applyLuckCoinsToGradeWeights,
  regularChest,
  regularChestGradeWeights,
} from '../config/lootTables';
import { createDefaultSave } from './GameSave';
import {
  getMiracleChestDropPreview,
  getRegularChestDropPreview,
  sumDropChancePercents,
} from './chestDropChances';
import type { ChestRollState } from './chestLoot';
import { rollRegularChestLoot } from './chestLoot';
import { migrateSave } from './saveMigration';
import { SAVE_VERSION } from '../config/gameConstants';

function baseRollState(partial?: Partial<ChestRollState>): ChestRollState {
  const save = createDefaultSave();
  return {
    ownedSkinIds: [...save.ownedSkinIds],
    ownedTitleIds: [...save.ownedTitleIds],
    spiritStatuses: { ...save.spiritStatuses },
    fragmentCounts: { ...save.fragmentCounts },
    selectedFragmentSpiritId: save.selectedFragmentSpiritId,
    domovoySkinId: 'brownie_standart',
    luckCoins: 200,
    ...partial,
  };
}

const TARGET_PERCENTS: Record<string, number> = {
  fragment: 3.5,
  'common:cat_skin': 28,
  'common:title_common': 7,
  'common:energy_bonus': 2.5,
  'common:obereg': 2,
  'common:window_skin': 4.5,
  'rare:cat_skin': 14,
  'rare:title_rare': 5.5,
  'rare:brownie_skin': 5.5,
  'rare:izba_skin': 5,
  'rare:spirit_key': 1.5,
  'epic:title_epic': 4.33,
  'epic:brownie_skin': 8.67,
  'epic:spirit_key': 2.89,
  'epoch:izba_skin': 2.05,
  'epoch:window_skin': 1.37,
  'epoch:brownie_skin': 1.54,
};

function rowKey(
  rewardType: string,
  grade?: string,
): string {
  return grade ? `${grade}:${rewardType}` : rewardType;
}

describe('chestDropChances', () => {
  it('should sum regular drop chances to approximately 100%', () => {
    const preview = getRegularChestDropPreview(baseRollState());
    expect(sumDropChancePercents(preview.rows)).toBeGreaterThan(99);
    expect(sumDropChancePercents(preview.rows)).toBeLessThanOrEqual(100.5);
  });

  it('should match target snapshot at brownie_standart + 200 coins within ±0.20', () => {
    const preview = getRegularChestDropPreview(baseRollState());
    for (const [key, target] of Object.entries(TARGET_PERCENTS)) {
      const row = preview.rows.find((r) => {
        const k = r.rewardType === 'fragment'
          ? 'fragment'
          : rowKey(r.rewardType, r.grade);
        return k === key;
      });
      expect(row, `missing row ${key}`).toBeDefined();
      expect(row!.percent).toBeGreaterThanOrEqual(target - 0.2);
      expect(row!.percent).toBeLessThanOrEqual(target + 0.2);
    }
    const brownieCommon = preview.rows.find(
      (r) => r.rewardType === 'brownie_skin' && r.grade === 'common',
    );
    expect(brownieCommon?.exhausted).toBe(true);
  });

  it('should increase rare weight with luck coins', () => {
    const zero = applyChestGradeWeights(regularChestGradeWeights, {
      domovoySkinId: 'brownie_standart',
      luckCoins: 0,
    });
    const hundred = applyChestGradeWeights(regularChestGradeWeights, {
      domovoySkinId: 'brownie_standart',
      luckCoins: 100,
    });
    expect(hundred.rare).toBeGreaterThan(zero.rare);
    expect(hundred.epic).toBeGreaterThan(zero.epic);
    expect(hundred.epoch).toBeGreaterThan(zero.epoch);
    expect(zero.common).toBe(hundred.common);
  });

  it('should reach rare weight 3468 at 200 coins with common domovoy', () => {
    const withDomovoi = applyChestGradeWeights(regularChestGradeWeights, {
      domovoySkinId: 'brownie_standart',
      luckCoins: 0,
    });
    const withCoins = applyLuckCoinsToGradeWeights(withDomovoi, 200);
    expect(withCoins.rare).toBe(3468);
  });

  it('should show higher rare+ share with more luck coins', () => {
    const low = getRegularChestDropPreview(
      baseRollState({ luckCoins: 0, domovoySkinId: 'brownie_standart' }),
    );
    const high = getRegularChestDropPreview(baseRollState());

    const rarePlusShare = (rows: typeof low.rows) =>
      rows
        .filter(
          (row) =>
            row.grade === 'rare' ||
            row.grade === 'epic' ||
            row.grade === 'epoch',
        )
        .reduce((sum, row) => sum + row.percent, 0);

    expect(rarePlusShare(high.rows)).toBeGreaterThan(rarePlusShare(low.rows));
  });

  it('should show 100% epoch rows on regular pity threshold', () => {
    const pityPreview = getRegularChestDropPreview(
      baseRollState(),
      regularChest.epochPityEvery - 1,
    );
    const fragmentRow = pityPreview.rows.find((row) => row.rewardType === 'fragment');
    expect(fragmentRow).toBeUndefined();
    expect(sumDropChancePercents(pityPreview.rows)).toBeCloseTo(100, 1);
    expect(
      pityPreview.rows.every((row) => row.grade === 'epoch'),
    ).toBe(true);
  });

  it('should show 100% fragment on miracle pity threshold', () => {
    const pityPreview = getMiracleChestDropPreview(baseRollState(), 7);
    const fragmentRow = pityPreview.rows.find((row) => row.rewardType === 'fragment');
    expect(fragmentRow?.percent).toBe(100);
  });

  it('should include miracle cat skin rows in consolation preview', () => {
    const preview = getMiracleChestDropPreview(baseRollState(), 0);
    const epicCat = preview.rows.find((r) => r.rewardType === 'cat_skin_epic');
    const epochCat = preview.rows.find((r) => r.rewardType === 'cat_skin_epoch');
    expect(epicCat?.percent).toBeGreaterThan(0);
    expect(epochCat?.percent).toBeGreaterThan(0);
  });
});

describe('regular chest epoch pity roll', () => {
  it('should guarantee epoch skin on pity threshold', () => {
    const pity = regularChest.epochPityEvery - 1;
    const { loot, nextEpochPityCounter } = rollRegularChestLoot(
      baseRollState(),
      pity,
      () => 0.99,
    );
    expect(loot.grade).toBe('epoch');
    expect(
      loot.kind === 'cat_skin' ||
        loot.kind === 'brownie_skin' ||
        loot.kind === 'izba_skin' ||
        loot.kind === 'window_skin',
    ).toBe(true);
    expect(nextEpochPityCounter).toBe(0);
  });

  it('should not use epoch pity when only epoch cat skins remain locked', () => {
    const ownedNonCatEpoch = [
      'hut_the_age_of_miracles',
      'hut_cyberpank',
      'landscape_omut',
      'landscape_cyber_city',
      'the_age_of_miracles_brownie',
    ];
    const pity = regularChest.epochPityEvery - 1;
    const { loot } = rollRegularChestLoot(
      baseRollState({ ownedSkinIds: ownedNonCatEpoch }),
      pity,
      () => 0.99,
    );
    expect(loot.kind).not.toBe('cat_skin');
  });

  it('should never roll epic or epoch cat skin from regular chest', () => {
    const epicEpochCatIds = [
      'blue_mage',
      'epic_hero',
      'red_gunner',
      'vulkan',
      'flying_carpet',
      'purple_mage',
      'smook',
    ];
    for (let i = 0; i < 200; i += 1) {
      const { loot } = rollRegularChestLoot(baseRollState(), 0, () => Math.random());
      if (loot.kind === 'cat_skin' && loot.itemId) {
        expect(epicEpochCatIds).not.toContain(loot.itemId);
      }
    }
  });

  it('should reset pity after fragment drop', () => {
    const { loot, nextEpochPityCounter } = rollRegularChestLoot(
      baseRollState({ selectedFragmentSpiritId: 'lada' }),
      3,
      () => 0.999,
    );
    expect(loot.kind).toBe('fragment');
    expect(nextEpochPityCounter).toBe(0);
  });

  it('should increment pity on non-epoch consolation', () => {
    const { nextEpochPityCounter } = rollRegularChestLoot(
      baseRollState(),
      2,
      () => 0.5,
    );
    expect(nextEpochPityCounter).toBe(3);
  });
});

describe('migrateSave regularChestEpochPityCounter', () => {
  it('adds regularChestEpochPityCounter default on migration to version 8', () => {
    const save = {
      ...createDefaultSave(),
      version: 7,
    };
    delete (save as { regularChestEpochPityCounter?: number }).regularChestEpochPityCounter;

    const migrated = migrateSave(save);

    expect(migrated.version).toBe(SAVE_VERSION);
    expect(migrated.regularChestEpochPityCounter).toBe(0);
  });
});
