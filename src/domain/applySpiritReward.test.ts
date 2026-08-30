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
    expect(patch.maxEnergy).toBe(105);
    expect(patch.energy).toBe(105);
  });

  it('adds obereg for kikimora reward', () => {
    const state = getDefaultRewardState();
    const patch = applySpiritReward({ kind: 'obereg', amount: 1 }, state);
    expect(patch.talismans).toBe(4);
  });

  it('restores full energy for smetana', () => {
    const state = { ...getDefaultRewardState(), energy: 30, maxEnergy: 110 };
    const patch = applySpiritReward({ kind: 'smetana' }, state);
    expect(patch.energy).toBe(110);
  });

  it('adds title and energy for polevoy reward', () => {
    const state = { ...getDefaultRewardState(), energy: 90 };
    const patch = applySpiritReward(
      { kind: 'title_and_energy', titleId: 'polevoy_kot', amount: 10 },
      state,
    );
    expect(patch.ownedTitleIds).toContain('polevoy_kot');
    expect(patch.energy).toBe(100);
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
});
