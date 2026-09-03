import { describe, expect, it } from 'vitest';

import {

  createDefaultSave,

  createDefaultSpiritStatuses,

  getNightId,

  onboardingEnergyFloor,

} from './GameSave';

import { SAVE_VERSION } from '../config/gameConstants';



describe('GameSave', () => {

  it('should create default save with brownie available when new game', () => {

    const save = createDefaultSave(1_000);

    expect(save.version).toBe(SAVE_VERSION);

    expect(save.onboardingStep).toBe(0);

    expect(save.onboardingCompleted).toBe(false);

    expect(save.spiritStatuses.brownie).toBe('available');

    expect(save.spiritStatuses.susedko).toBe('locked');

    expect(save.titleId).toBe('novenkiy');

    expect(save.lastEnergyAt).toBe(1_000);

    expect(save.ownedSkinIds).toContain('brownie_standart');

    expect(save.ownedSkinIds).toContain('hut_standart');

    expect(save.language).toBe('ru');

    expect(save.catClickCount).toBe(0);

    expect(save.illustrationRevealed).toEqual([]);

  });



  it('should return energy floor 20 when onboarding not completed', () => {

    expect(onboardingEnergyFloor(false)).toBe(20);

    expect(onboardingEnergyFloor(true)).toBe(0);

  });



  it('should assign night id before 06:00 to previous calendar day', () => {

    const beforeDawn = new Date('2026-08-28T05:30:00');

    expect(getNightId(beforeDawn)).toBe('2026-08-27');

    const afterDawn = new Date('2026-08-28T07:00:00');

    expect(getNightId(afterDawn)).toBe('2026-08-28');

  });



  it('should lock all spirits except brownie in default statuses', () => {

    const statuses = createDefaultSpiritStatuses();

    const locked = Object.entries(statuses).filter(([, s]) => s === 'locked');

    expect(locked).toHaveLength(15);

  });

});

