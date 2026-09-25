import {
  CHEST_COOLDOWN_HOURS,
  CHEST_REWARDED_CHARGE_LIMIT,
  CHEST_REWARDED_SKIP_MINUTES,
} from '../config/gameConstants';

const COOLDOWN_MS = CHEST_COOLDOWN_HOURS * 60 * 60 * 1000;
const SKIP_MS = CHEST_REWARDED_SKIP_MINUTES * 60 * 1000;

export function isChestReady(
  firstChestOpened: boolean,
  chestReadyAt: number | null,
  now: number,
): boolean {
  if (!firstChestOpened) return true;
  if (chestReadyAt == null) return true;
  return now >= chestReadyAt;
}

export function getChestCooldownRemainingMs(
  firstChestOpened: boolean,
  chestReadyAt: number | null,
  now: number,
): number {
  if (!firstChestOpened) return 0;
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

export interface ChestRewardedChargeState {
  charges: number;
  naturalRefillAt: number | null;
}

export function clampChestRewardedCharges(charges: number): number {
  if (!Number.isFinite(charges)) return CHEST_REWARDED_CHARGE_LIMIT;
  return Math.min(
    CHEST_REWARDED_CHARGE_LIMIT,
    Math.max(0, Math.trunc(charges)),
  );
}

/** Пополнение только когда заряды уже 0 и живые 3 часа метки прошли. */
export function syncChestRewardedCharges(
  state: ChestRewardedChargeState,
  now: number,
): ChestRewardedChargeState {
  if (
    state.charges === 0 &&
    state.naturalRefillAt != null &&
    now >= state.naturalRefillAt
  ) {
    return { charges: CHEST_REWARDED_CHARGE_LIMIT, naturalRefillAt: null };
  }
  return state;
}

export function applyChestRewardedChargeSkip(
  state: ChestRewardedChargeState,
  chestReadyAt: number | null,
  now: number,
): { charges: ChestRewardedChargeState; chestReadyAt: number } {
  return {
    charges: {
      charges: Math.max(0, state.charges - 1),
      naturalRefillAt: state.naturalRefillAt,
    },
    chestReadyAt: applyRewardedSkip(chestReadyAt, now),
  };
}

export function armChestRewardedNaturalRefill(
  state: ChestRewardedChargeState,
  nextChestReadyAt: number,
): ChestRewardedChargeState {
  if (state.charges > 0) {
    return { charges: state.charges, naturalRefillAt: null };
  }
  return { charges: state.charges, naturalRefillAt: nextChestReadyAt };
}

export function canSkipChestWithRewarded(charges: number): boolean {
  return charges > 0;
}
