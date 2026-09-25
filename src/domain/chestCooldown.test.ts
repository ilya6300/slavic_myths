import { describe, expect, it } from 'vitest';

import {

  applyRewardedSkip,

  chestReadyAtAfterOpen,

  getChestCooldownRemainingMs,

  isChestReady,

} from './chestCooldown';



describe('chestCooldown', () => {

  const now = 1_000_000;



  it('should be ready before first open', () => {

    expect(isChestReady(false, null, now)).toBe(true);

  });



  it('should not be ready during cooldown', () => {

    const readyAt = now + 60_000;

    expect(isChestReady(true, readyAt, now)).toBe(false);

  });



  it('should be ready when cooldown elapsed', () => {

    const readyAt = now - 1;

    expect(isChestReady(true, readyAt, now)).toBe(true);

  });



  it('should set cooldown 3h after open', () => {

    expect(chestReadyAtAfterOpen(now)).toBe(now + 3 * 60 * 60 * 1000);

  });



  it('should skip 90 minutes with rewarded', () => {

    const readyAt = now + 3 * 60 * 60 * 1000;

    const next = applyRewardedSkip(readyAt, now);

    expect(next).toBe(readyAt - 90 * 60 * 1000);

  });



  it('should return remaining ms during cooldown', () => {

    const readyAt = now + 90_000;

    expect(getChestCooldownRemainingMs(true, readyAt, now)).toBe(90_000);

  });

});

