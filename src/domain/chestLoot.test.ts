import { describe, expect, it } from 'vitest';

import { CHEST_ENERGY_BONUS } from '../config/gameConstants';

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



  it('should add energy directly from chest energy loot', () => {

    const state = baseRollState();

    const patch = applyChestLoot(

      { kind: 'energy', energyAmount: CHEST_ENERGY_BONUS },

      {

        ...state,

        energy: 90,

        maxEnergy: 100,

        talismans: 2,

        skins: createDefaultSave().skins,

      },

    );

    expect(patch.energy).toBe(140);

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

        skins: createDefaultSave().skins,

      },

    );

    expect(patch.fragmentCounts?.lada).toBe(1);

  });



  it('should unlock skin without auto-equipping', () => {

    const state = baseRollState();

    const skins = createDefaultSave().skins;

    const patch = applyChestLoot(

      { kind: 'cat_skin', itemId: 'vulkan' },

      {

        ...state,

        energy: 100,

        maxEnergy: 100,

        talismans: 3,

        skins,

      },

    );

    expect(patch.ownedSkinIds).toContain('vulkan');

    expect(patch.skins).toBeUndefined();

  });



  it('should treat default skins as owned when rolling', () => {

    const state = baseRollState({ ownedSkinIds: ['cat_standart'] });

    for (let i = 0; i < 30; i++) {

      const loot = rollRegularChestLoot(state, () => Math.random());

      if (loot.kind === 'brownie_skin') {

        expect(loot.itemId).not.toBe('brownie_standart');

      }

    }

  });

});

