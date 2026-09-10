import { describe, expect, it } from 'vitest';

import {

  applySpiritReward,

  getDefaultRewardState,

} from './applySpiritReward';

import { LUCK_COINS_CAP } from '../config/gameConstants';



describe('applySpiritReward', () => {

  it('adds max energy for bannik reward', () => {

    const state = getDefaultRewardState();

    const patch = applySpiritReward({ kind: 'max_energy', amount: 5 }, state);

    expect(patch.maxEnergy).toBe(125);

    expect(patch.energy).toBe(125);

  });



  it('adds obereg for kikimora reward', () => {

    const state = getDefaultRewardState();

    const patch = applySpiritReward({ kind: 'obereg', amount: 1 }, state);

    expect(patch.talismans).toBe(4);

  });



  it('adds reward energy for ovinnik reward without cap', () => {

    const state = { ...getDefaultRewardState(), energy: 90, maxEnergy: 120 };

    const patch = applySpiritReward({ kind: 'reward_energy', amount: 50 }, state);

    expect(patch.energy).toBe(140);

  });



  it('adds title and energy for polevoy reward over max cap', () => {

    const state = { ...getDefaultRewardState(), energy: 95 };

    const patch = applySpiritReward(

      { kind: 'title_and_energy', titleId: 'polevoy_kot', amount: 10 },

      state,

    );

    expect(patch.ownedTitleIds).toContain('polevoy_kot');

    expect(patch.energy).toBe(105);

  });



  it('increases luck cap and adds title for koschei reward', () => {

    const state = { ...getDefaultRewardState(), luckCoins: 200 };

    const patch = applySpiritReward(

      {

        kind: 'luck_cap_and_title',

        titleId: 'razgadchik_smerti',

        amount: 20,

      },

      state,

    );

    expect(patch.luckCoinsCapBonus).toBe(20);

    expect(patch.luckCoins).toBe(LUCK_COINS_CAP);

    expect(patch.ownedTitleIds).toContain('razgadchik_smerti');

  });



  it('stores regen percent bonus', () => {

    const state = getDefaultRewardState();

    const patch = applySpiritReward({ kind: 'regen_percent', percent: 5 }, state);

    expect(patch.energyRegenBonusPercent).toBe(5);

  });



  it('adds lada quest hut_harmony skin without title or equipping', () => {
    const state = getDefaultRewardState();
    const patch = applySpiritReward(
      { kind: 'skin_only', skinId: 'hut_harmony' },
      state,
    );
    expect(patch.ownedSkinIds).toContain('hut_harmony');
    expect(patch.ownedTitleIds).toBeUndefined();
    expect(patch.skins).toBeUndefined();
  });

  it('adds yaga quest title and window skin without equipping', () => {
    const state = getDefaultRewardState();
    const patch = applySpiritReward(
      {
        kind: 'title_and_skin',
        titleId: 'kogot_yagi',
        skinId: 'landscape_yaga',
      },
      state,
    );
    expect(patch.ownedTitleIds).toContain('kogot_yagi');
    expect(patch.ownedSkinIds).toContain('landscape_yaga');
    expect(patch.skins).toBeUndefined();
  });

  it('adds max energy for poludnica reward', () => {
    const state = getDefaultRewardState();
    const patch = applySpiritReward({ kind: 'max_energy', amount: 15 }, state);
    expect(patch.maxEnergy).toBe(135);
    expect(patch.energy).toBe(135);
  });

  it('adds rusalka title and energy reward', () => {
    const state = { ...getDefaultRewardState(), energy: 95 };
    const patch = applySpiritReward(
      { kind: 'title_and_energy', titleId: 'kot_u_berega', amount: 10 },
      state,
    );
    expect(patch.ownedTitleIds).toContain('kot_u_berega');
    expect(patch.energy).toBe(105);
  });
});

