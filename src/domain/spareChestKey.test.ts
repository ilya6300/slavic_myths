import { describe, expect, it } from 'vitest';
import { CHEST_COOLDOWN_HOURS } from '../config/gameConstants';
import {
  applyChestKeyReward,
  canReceiveSpareChestKey,
  isChestOpenable,
  shouldConsumeSpareKeyOnOpen,
  SPARE_CHEST_KEYS_CAP,
} from './spareChestKey';

const COOLDOWN_MS = CHEST_COOLDOWN_HOURS * 60 * 60 * 1000;

describe('spareChestKey', () => {
  it('makes chest ready when on cooldown', () => {
    const now = 1_000_000;
    const result = applyChestKeyReward(true, now + COOLDOWN_MS, 0, now);
    expect(result.chestReadyAt).toBe(now);
    expect(result.spareChestKeys).toBe(0);
  });

  it('adds spare key when chest already ready', () => {
    const now = 1_000_000;
    const result = applyChestKeyReward(true, now - 1, 1, now);
    expect(result.chestReadyAt).toBe(now - 1);
    expect(result.spareChestKeys).toBe(2);
  });

  it('caps spare keys at SPARE_CHEST_KEYS_CAP', () => {
    const now = 1_000_000;
    const result = applyChestKeyReward(true, now - 1, SPARE_CHEST_KEYS_CAP, now);
    expect(result.spareChestKeys).toBe(SPARE_CHEST_KEYS_CAP);
  });

  it('allows open with spare key while on cooldown', () => {
    const now = 1_000_000;
    expect(
      isChestOpenable(true, now + COOLDOWN_MS, 1, now),
    ).toBe(true);
    expect(
      shouldConsumeSpareKeyOnOpen(true, now + COOLDOWN_MS, 1, now),
    ).toBe(true);
  });

  it('cannot receive spare key at cap when chest ready', () => {
    const now = 1_000_000;
    expect(
      canReceiveSpareChestKey(true, now - 1, SPARE_CHEST_KEYS_CAP, now),
    ).toBe(false);
  });
});
