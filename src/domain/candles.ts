/**
 * Свечи и вещие крупицы — доменные правила.
 * Канон: instruction/plans/draft.md §1.
 */

import type { SpiritId } from '../config/assetRegistry';
import {
  DIVINATION_CRUMBS_CORRECT,
  DIVINATION_CRUMBS_WRONG,
} from '../config/gameConstants';

export function grantFirstVictoryCandle(
  spiritId: SpiritId,
  alreadyGranted: string[],
): { candlesDelta: number; nextGranted: string[] } {
  if (alreadyGranted.includes(spiritId)) {
    return { candlesDelta: 0, nextGranted: alreadyGranted };
  }
  return {
    candlesDelta: 1,
    nextGranted: [...alreadyGranted, spiritId],
  };
}

export function divinationCrumbsReward(guessedCorrectly: boolean): number {
  return guessedCorrectly ? DIVINATION_CRUMBS_CORRECT : DIVINATION_CRUMBS_WRONG;
}

export function canSpendCandle(candles: number): boolean {
  return candles > 0;
}

export function spendCandle(candles: number): number {
  if (candles <= 0) return candles;
  return candles - 1;
}

export function addCandles(candles: number, amount: number): number {
  if (amount <= 0) return candles;
  return candles + amount;
}

export function addTruthCrumbs(crumbs: number, amount: number): number {
  if (amount <= 0) return crumbs;
  return crumbs + amount;
}
