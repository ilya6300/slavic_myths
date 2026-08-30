import {
  CHEST_COOLDOWN_HOURS,
  CHEST_REWARDED_SKIP_MINUTES,
} from '../config/gameConstants';

const COOLDOWN_MS = CHEST_COOLDOWN_HOURS * 60 * 60 * 1000;
const SKIP_MS = CHEST_REWARDED_SKIP_MINUTES * 60 * 1000;

export function isChestReady(
  firstChestOpened: boolean,
  chestReadyAt: number | null,
  spareChestKeys: number,
  now: number,
): boolean {
  if (spareChestKeys > 0) return true;
  if (!firstChestOpened) return true;
  if (chestReadyAt == null) return true;
  return now >= chestReadyAt;
}

export function getChestCooldownRemainingMs(
  firstChestOpened: boolean,
  chestReadyAt: number | null,
  spareChestKeys: number,
  now: number,
): number {
  if (!firstChestOpened || spareChestKeys > 0) return 0;
  if (chestReadyAt == null) return 0;
  return Math.max(0, chestReadyAt - now);
}

export function chestReadyAtAfterOpen(now: number): number {
  return now + COOLDOWN_MS;
}

export function applyRewardedSkip(
  chestReadyAt: number | null,
  now: number,
): number {
  const base = chestReadyAt ?? now;
  return Math.max(now, base - SKIP_MS);
}
