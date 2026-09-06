/**
 * Запасной ключ к обычному сундуку (3 ч).
 * Канон: scenario.md §5.4 — сундук сразу готов; если уже готов — +1 запасной (cap).
 */

import { SPARE_CHEST_KEYS_CAP } from '../config/gameConstants';
import { isChestReady } from './chestCooldown';

export { SPARE_CHEST_KEYS_CAP };

export function canReceiveSpareChestKey(
  firstChestOpened: boolean,
  chestReadyAt: number | null,
  spareChestKeys: number,
  now: number,
): boolean {
  if (!isChestReady(firstChestOpened, chestReadyAt, now)) return true;
  return spareChestKeys < SPARE_CHEST_KEYS_CAP;
}

export function applyChestKeyReward(
  firstChestOpened: boolean,
  chestReadyAt: number | null,
  spareChestKeys: number,
  now: number,
): { chestReadyAt: number | null; spareChestKeys: number } {
  if (!isChestReady(firstChestOpened, chestReadyAt, now)) {
    return { chestReadyAt: now, spareChestKeys };
  }
  return {
    chestReadyAt,
    spareChestKeys: Math.min(spareChestKeys + 1, SPARE_CHEST_KEYS_CAP),
  };
}

export function shouldConsumeSpareKeyOnOpen(
  firstChestOpened: boolean,
  chestReadyAt: number | null,
  spareChestKeys: number,
  now: number,
): boolean {
  return (
    spareChestKeys > 0 &&
    !isChestReady(firstChestOpened, chestReadyAt, now)
  );
}

export function isChestOpenable(
  firstChestOpened: boolean,
  chestReadyAt: number | null,
  spareChestKeys: number,
  now: number,
): boolean {
  return (
    isChestReady(firstChestOpened, chestReadyAt, now) || spareChestKeys > 0
  );
}
