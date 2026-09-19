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
});
