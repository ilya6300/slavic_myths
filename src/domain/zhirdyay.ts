import {
  ZHIRDYAY_CLICKS_MAX,
  ZHIRDYAY_CLICKS_MIN,
} from '../config/gameConstants';
import { isNightTime } from './nightTime';

export function rollZhirdyayClicksRequired(
  rng: () => number = Math.random,
): number {
  const range = ZHIRDYAY_CLICKS_MAX - ZHIRDYAY_CLICKS_MIN + 1;
  return ZHIRDYAY_CLICKS_MIN + Math.floor(rng() * range);
}

export function shouldSpawnZhirdyay(input: {
  isNight: boolean;
  activeRoom: 1 | 2;
  zhirdyaySeenThisNight: boolean;
  onboardingCompleted: boolean;
  zhirdyayActive: boolean;
  rusalkaZhirdyayReductionPercent: number;
  rng?: () => number;
}): boolean {
  if (!input.onboardingCompleted) return false;
  if (!input.isNight) return false;
  if (input.activeRoom !== 1) return false;
  if (input.zhirdyaySeenThisNight) return false;
  if (input.zhirdyayActive) return false;

  const rng = input.rng ?? Math.random;
  const reduction = input.rusalkaZhirdyayReductionPercent / 100;
  const spawnChance = Math.max(0.05, 1 - reduction);
  return rng() < spawnChance;
}

export function isZhirdyayDefeated(
  clickProgress: number,
  clicksRequired: number,
): boolean {
  return clicksRequired > 0 && clickProgress >= clicksRequired;
}

export function shouldBlockGameplay(zhirdyayActive: boolean): boolean {
  return zhirdyayActive;
}

export { isNightTime };
