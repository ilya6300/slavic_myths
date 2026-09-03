import {
  SUSEDKO_STEAL_COIN_INTERVAL_MS,
  SUSEDKO_STEAL_COOLDOWN_MS,
  SUSEDKO_STEAL_START_DELAY_MS,
  SUSEDKO_STEAL_STOP_LOSS_COINS,
  SUSEDKO_STEAL_WARNING_MS,
} from '../config/gameConstants';

export type SusedkoStealPhase = 'idle' | 'warning' | 'stealing';

export function canStartSusedkoSteal(input: {
  onboardingCompleted: boolean;
  firstChestOpened: boolean;
  catSleeping: boolean;
  activeRoom: 1 | 2;
  zhirdyayActive: boolean;
}): boolean {
  if (!input.onboardingCompleted) return false;
  if (!input.firstChestOpened) return false;
  if (!input.catSleeping) return false;
  if (input.activeRoom !== 1) return false;
  if (input.zhirdyayActive) return false;
  return true;
}

export function canStealCoins(luckCoins: number): boolean {
  return luckCoins >= SUSEDKO_STEAL_STOP_LOSS_COINS;
}

export function shouldStopStealing(luckCoins: number): boolean {
  return luckCoins < SUSEDKO_STEAL_STOP_LOSS_COINS;
}

export function advanceStealPhase(
  phase: SusedkoStealPhase,
  catSleepedAt: number,
  now: number,
): SusedkoStealPhase {
  const elapsed = now - catSleepedAt;

  if (phase === 'idle') {
    if (elapsed >= SUSEDKO_STEAL_WARNING_MS + SUSEDKO_STEAL_START_DELAY_MS) {
      return 'stealing';
    }
    if (elapsed >= SUSEDKO_STEAL_WARNING_MS) {
      return 'warning';
    }
    return 'idle';
  }

  if (phase === 'warning') {
    if (elapsed >= SUSEDKO_STEAL_WARNING_MS + SUSEDKO_STEAL_START_DELAY_MS) {
      return 'stealing';
    }
    return 'warning';
  }

  return phase;
}

export function warningRemainingMs(catSleepedAt: number, now: number): number {
  return Math.max(0, SUSEDKO_STEAL_WARNING_MS - (now - catSleepedAt));
}

export function isStealingPhase(phase: SusedkoStealPhase): boolean {
  return phase === 'stealing';
}

export function stealPhaseStartElapsedMs(): number {
  return SUSEDKO_STEAL_WARNING_MS + SUSEDKO_STEAL_START_DELAY_MS;
}

export function isSusedkoStealCooldownElapsed(
  now: number,
  lastStealAt: number | null,
): boolean {
  if (lastStealAt == null) return true;
  return now - lastStealAt >= SUSEDKO_STEAL_COOLDOWN_MS;
}

/** Сколько монет списано за серию тиков при активной краже (для тестов и guard). */
export function countCoinsStolenOverTicks(
  startCoins: number,
  stealStartedAt: number,
  tickTimesMs: number[],
  coinIntervalMs: number = SUSEDKO_STEAL_COIN_INTERVAL_MS,
): number {
  let coins = startCoins;
  let nextStealAt = stealStartedAt + coinIntervalMs;

  for (const now of tickTimesMs) {
    if (now < stealStartedAt) continue;
    if (shouldStopStealing(coins)) break;
    if (now >= nextStealAt) {
      nextStealAt = now + coinIntervalMs;
      coins = Math.max(0, coins - 1);
    }
  }

  return startCoins - coins;
}
