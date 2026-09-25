import { describe, expect, it } from 'vitest';

import { SAVE_VERSION } from '../config/gameConstants';
import { createDefaultSave } from './GameSave';
import { migrateSave } from './saveMigration';

describe('migrateSave', () => {
  it('adds landscape_yaga to owned skins when baba_yaga already defeated', () => {
    const save = {
      ...createDefaultSave(),
      version: 4,
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        baba_yaga: 'defeated' as const,
      },
      ownedSkinIds: ['cat_standart', 'brownie_standart', 'hut_standart', 'landscape_standart'],
    };

    const migrated = migrateSave(save);

    expect(migrated.version).toBe(SAVE_VERSION);
    expect(migrated.ownedSkinIds).toContain('landscape_yaga');
  });

  it('migrates v8 to v9 with yard and starter pack fields', () => {
    const migrated = migrateSave({
      ...createDefaultSave(),
      version: 8,
    });
    expect(migrated.version).toBe(SAVE_VERSION);
    expect(migrated.starterPackPurchased).toBe(false);
    expect(migrated.yardGrass).toBe(0);
    expect(migrated.yardOberegCraftedDayId).toBeNull();
    expect(migrated.yardGrassFieldSlots).toEqual([]);
    expect(migrated.yardGrassSpawnCheckedAt).toBeTypeOf('number');
  });

  it('does not add landscape_yaga when baba_yaga not defeated', () => {
    const save = {
      ...createDefaultSave(),
      version: 4,
      ownedSkinIds: ['cat_standart', 'brownie_standart', 'hut_standart', 'landscape_standart'],
    };

    const migrated = migrateSave(save);

    expect(migrated.ownedSkinIds).not.toContain('landscape_yaga');
  });

  it('adds hut_harmony to owned skins when lada already defeated', () => {
    const save = {
      ...createDefaultSave(),
      version: 5,
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        lada: 'defeated' as const,
      },
      ownedSkinIds: ['cat_standart', 'brownie_standart', 'hut_standart', 'landscape_standart'],
    };

    const migrated = migrateSave(save);

    expect(migrated.version).toBe(SAVE_VERSION);
    expect(migrated.ownedSkinIds).toContain('hut_harmony');
  });

  it('adds zhirdyayDefeatedCount default on migration to version 7', () => {
    const save = {
      ...createDefaultSave(),
      version: 6,
    };

    const migrated = migrateSave(save);

    expect(migrated.version).toBe(SAVE_VERSION);
    expect(migrated.zhirdyayDefeatedCount).toBe(0);
  });

  it('removes deleted hut_epic from owned skins and unequips it', () => {
    const save = {
      ...createDefaultSave(),
      version: 10,
      skins: { ...createDefaultSave().skins, izba: 'hut_epic' },
      ownedSkinIds: ['cat_standart', 'hut_standart', 'hut_epic'],
    };

    const migrated = migrateSave(save);

    expect(migrated.version).toBe(SAVE_VERSION);
    expect(migrated.ownedSkinIds).not.toContain('hut_epic');
    expect(migrated.skins.izba).toBe('hut_standart');
  });

  it('migrates v12 to v13 with meta fields and daily quest claim', () => {
    const migrated = migrateSave({
      ...createDefaultSave(),
      version: 12,
      dailyFindClaimedDayId: '2026-09-19',
    });
    expect(migrated.version).toBe(SAVE_VERSION);
    expect(migrated.candles).toBe(0);
    expect(migrated.truthCrumbs).toBe(0);
    expect(migrated.ownedPetIds).toEqual([]);
    expect(migrated.dailyQuestRewardClaimedDayId).toBeNull();
    expect(migrated.dailyQuestFragmentGrantedDayId).toBeNull();
  });

  it('should migrate a v14 save to full chest charges and unused mirror and daily resets when epic 17 fields are absent', () => {
    const migrated = migrateSave({
      ...createDefaultSave(),
      version: 14,
      candles: 2,
      chestReadyAt: 123_000,
      dailyQuestTaleSpiritId: 'brownie',
      dailyQuestClickProgress: 40,
      dailyQuestFragmentGrantedDayId: '2026-09-20',
    }) as ReturnType<typeof migrateSave> & Record<string, unknown>;

    expect(migrated.chestRewardedCharges).toBe(4);
    expect(migrated.chestRewardedNaturalRefillAt).toBeNull();
    expect(migrated.divinationRewardedDayId).toBeNull();
    expect(migrated.dailyQuestRewardedResetDayId).toBeNull();
    expect(migrated.candles).toBe(2);
    expect(migrated.chestReadyAt).toBe(123_000);
    expect(migrated.dailyQuestTaleSpiritId).toBe('brownie');
    expect(migrated.dailyQuestClickProgress).toBe(40);
    expect(migrated.dailyQuestFragmentGrantedDayId).toBe('2026-09-20');
  });

  it('migrates v13 phantom daily reward claim without fragment grant', () => {
    const migrated = migrateSave({
      ...createDefaultSave(),
      version: 13,
      dailyQuestRewardClaimedDayId: '2026-09-20',
      dailyQuestFragmentGrantedDayId: null,
      dailyQuestClickProgress: 100,
      dailyQuestTaleCorrect: true,
    });
    expect(migrated.version).toBe(SAVE_VERSION);
    expect(migrated.dailyQuestRewardClaimedDayId).toBeNull();
    expect(migrated.dailyQuestFragmentGrantedDayId).toBeNull();
  });
});
