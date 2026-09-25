import { describe, expect, it } from 'vitest';

import * as constants from '../config/gameConstants';
import * as chestCooldown from './chestCooldown';
import { createDefaultSave } from './GameSave';

const MIN = 60 * 1000;
const HOUR = 60 * MIN;

function callFn(mod: object, name: string, ...args: unknown[]): unknown {
  const fn = (mod as Record<string, unknown>)[name];
  if (typeof fn !== 'function') {
    throw new Error(`missing behavior: ${name}`);
  }
  return (fn as (...a: unknown[]) => unknown)(...args);
}

describe('chest rewarded charges (TASK-056)', () => {
  const bag = constants as Record<string, unknown>;

  it('should use save v15, a 90 minute skip, and 4 charges when epic 17 constants are read', () => {
    expect(constants.SAVE_VERSION).toBe(15);
    expect(constants.CHEST_REWARDED_SKIP_MINUTES).toBe(90);
    expect(bag.CHEST_REWARDED_CHARGE_LIMIT).toBe(4);
    expect(constants.CHEST_COOLDOWN_HOURS).toBe(3);
  });

  it('should start a new save with 4 charges and no refill mark when createDefaultSave runs', () => {
    const save = createDefaultSave() as ReturnType<typeof createDefaultSave> &
      Record<string, unknown>;
    expect(save.chestRewardedCharges).toBe(4);
    expect(save.chestRewardedNaturalRefillAt).toBeNull();
    expect(save.divinationRewardedDayId).toBeNull();
    expect(save.dailyQuestRewardedResetDayId).toBeNull();
  });

  it('should allow a rewarded skip when charges remain', () => {
    expect(callFn(chestCooldown, 'canSkipChestWithRewarded', 1)).toBe(true);
    expect(callFn(chestCooldown, 'canSkipChestWithRewarded', 4)).toBe(true);
  });

  it('should refuse a rewarded skip when charges are 0', () => {
    expect(callFn(chestCooldown, 'canSkipChestWithRewarded', 0)).toBe(false);
  });

  it('should spend one charge and 90 minutes when a rewarded skip succeeds', () => {
    const now = 1_000_000;
    const readyAt = now + 3 * HOUR;
    const next = callFn(
      chestCooldown,
      'applyChestRewardedChargeSkip',
      { charges: 4, naturalRefillAt: null },
      readyAt,
      now,
    ) as { charges: { charges: number; naturalRefillAt: number | null }; chestReadyAt: number };

    expect(next.chestReadyAt).toBe(readyAt - 90 * MIN);
    expect(next.charges.charges).toBe(3);
    expect(next.charges.naturalRefillAt).toBeNull();
  });

  it('should reach ready and still spend one charge when less than 90 minutes remain', () => {
    const now = 1_000_000;
    const readyAt = now + 20 * MIN;
    const next = callFn(
      chestCooldown,
      'applyChestRewardedChargeSkip',
      { charges: 2, naturalRefillAt: null },
      readyAt,
      now,
    ) as { charges: { charges: number; naturalRefillAt: number | null }; chestReadyAt: number };

    expect(next.chestReadyAt).toBe(now);
    expect(next.charges.charges).toBe(1);
    expect(next.charges.naturalRefillAt).toBeNull();
  });

  it('should not refill charges when the timer ends while charges remain', () => {
    const now = 5_000_000;
    const synced = callFn(
      chestCooldown,
      'syncChestRewardedCharges',
      { charges: 2, naturalRefillAt: null },
      now,
    ) as { charges: number; naturalRefillAt: number | null };

    expect(synced.charges).toBe(2);
    expect(synced.naturalRefillAt).toBeNull();
  });

  it('should restore 4 charges when the natural 3 hour refill time is reached', () => {
    const refillAt = 5_000_000;
    const synced = callFn(
      chestCooldown,
      'syncChestRewardedCharges',
      { charges: 0, naturalRefillAt: refillAt },
      refillAt,
    ) as { charges: number; naturalRefillAt: number | null };

    expect(synced.charges).toBe(4);
    expect(synced.naturalRefillAt).toBeNull();
  });

  it('should keep 0 charges before the natural refill time', () => {
    const refillAt = 5_000_000;
    const synced = callFn(
      chestCooldown,
      'syncChestRewardedCharges',
      { charges: 0, naturalRefillAt: refillAt },
      refillAt - 1,
    ) as { charges: number; naturalRefillAt: number | null };

    expect(synced.charges).toBe(0);
    expect(synced.naturalRefillAt).toBe(refillAt);
  });

  it('should arm the next chest ready time as refill only when charges are already 0', () => {
    const nextReady = 9_000_000;
    const armed = callFn(
      chestCooldown,
      'armChestRewardedNaturalRefill',
      { charges: 0, naturalRefillAt: null },
      nextReady,
    ) as { charges: number; naturalRefillAt: number | null };
    const kept = callFn(
      chestCooldown,
      'armChestRewardedNaturalRefill',
      { charges: 2, naturalRefillAt: 1 },
      nextReady,
    ) as { charges: number; naturalRefillAt: number | null };

    expect(armed.charges).toBe(0);
    expect(armed.naturalRefillAt).toBe(nextReady);
    expect(kept.charges).toBe(2);
    expect(kept.naturalRefillAt).toBeNull();
  });
});
