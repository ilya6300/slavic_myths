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
    expect(isChestReady(false, null, 0, now)).toBe(true);
  });

  it('should not be ready during cooldown', () => {
    const readyAt = now + 60_000;
    expect(isChestReady(true, readyAt, 0, now)).toBe(false);
  });

  it('should be ready when cooldown elapsed', () => {
    const readyAt = now - 1;
    expect(isChestReady(true, readyAt, 0, now)).toBe(true);
  });

  it('should be ready with spare key on cooldown', () => {
    const readyAt = now + 60_000;
    expect(isChestReady(true, readyAt, 1, now)).toBe(true);
  });

  it('should set cooldown 3h after open', () => {
    expect(chestReadyAtAfterOpen(now)).toBe(now + 3 * 60 * 60 * 1000);
  });

  it('should skip 30 minutes with rewarded', () => {
    const readyAt = now + 60 * 60 * 1000;
    const next = applyRewardedSkip(readyAt, now);
    expect(next).toBe(readyAt - 30 * 60 * 1000);
  });

  it('should return remaining ms during cooldown', () => {
    const readyAt = now + 90_000;
    expect(getChestCooldownRemainingMs(true, readyAt, 0, now)).toBe(90_000);
  });
});
