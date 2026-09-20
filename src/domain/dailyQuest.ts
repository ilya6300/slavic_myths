/**
 * Ежедневные задания (два пункта) — доменная логика.
 * Канон: instruction/plans/draft.md §2.
 */

import type { SpiritId } from '../config/assetRegistry';
import { SPIRIT_ORDER } from '../data/spirits';
import { DAILY_QUEST_CLICK_GOAL } from '../config/gameConstants';
import { getCalendarDayId } from './calendarDay';
import type { SpiritStatus } from './GameSave';
import { isFragmentChainComplete } from './fragmentDrop';

export interface DailyQuestDayState {
  dayId: string;
  taleSpiritId: SpiritId | null;
  clickProgress: number;
  taleQuizCorrect: boolean;
  rewardClaimed: boolean;
}

export function isDailyQuestUnlocked(
  spiritStatuses: Record<string, SpiritStatus>,
): boolean {
  return spiritStatuses.bannik === 'defeated';
}

export function shouldShowDailyQuestPanel(
  spiritStatuses: Record<string, SpiritStatus>,
  fragmentCounts: Record<string, number>,
): boolean {
  if (!isDailyQuestUnlocked(spiritStatuses)) return false;
  return !isFragmentChainComplete(spiritStatuses, fragmentCounts);
}

export function listDefeatedSpiritIds(
  spiritStatuses: Record<string, SpiritStatus>,
): SpiritId[] {
  return SPIRIT_ORDER.filter((id) => spiritStatuses[id] === 'defeated');
}

/** Случайный дух сказа на день; без повтора подряд при ≥2 победах. */
export function pickDailyTaleSpiritId(
  defeatedIds: SpiritId[],
  previousDaySpiritId: SpiritId | null,
  rng: () => number = Math.random,
): SpiritId | null {
  if (defeatedIds.length === 0) return null;
  if (defeatedIds.length === 1) return defeatedIds[0]!;
  const pool = defeatedIds.filter((id) => id !== previousDaySpiritId);
  const candidates = pool.length > 0 ? pool : defeatedIds;
  const index = Math.floor(rng() * candidates.length);
  return candidates[index]!;
}

export function syncDailyQuestForCalendarDay(
  state: DailyQuestDayState | null,
  spiritStatuses: Record<string, SpiritStatus>,
  now: Date = new Date(),
  rng: () => number = Math.random,
): DailyQuestDayState {
  const dayId = getCalendarDayId(now);
  if (state?.dayId === dayId) return state;

  const defeated = listDefeatedSpiritIds(spiritStatuses);
  const previousSpirit =
    state?.dayId && state.taleSpiritId ? state.taleSpiritId : null;

  return {
    dayId,
    taleSpiritId: pickDailyTaleSpiritId(defeated, previousSpirit, rng),
    clickProgress: 0,
    taleQuizCorrect: false,
    rewardClaimed: false,
  };
}

export function isDailyClickTaskComplete(clickProgress: number): boolean {
  return clickProgress >= DAILY_QUEST_CLICK_GOAL;
}

export function isDailyDayComplete(state: DailyQuestDayState): boolean {
  return (
    isDailyClickTaskComplete(state.clickProgress) && state.taleQuizCorrect
  );
}

export function canClaimDailyFragmentReward(state: DailyQuestDayState): boolean {
  return isDailyDayComplete(state) && !state.rewardClaimed;
}

/** Случайный индекс вопроса; не повторять сразу тот же индекс при ошибке. */
export function pickDailyQuizQuestionIndex(
  questionCount: number,
  excludeIndex: number | null,
  rng: () => number = Math.random,
): number {
  if (questionCount <= 0) return 0;
  if (questionCount === 1) return 0;
  if (excludeIndex == null) {
    return Math.floor(rng() * questionCount);
  }
  const candidates = Array.from({ length: questionCount }, (_, i) => i).filter(
    (i) => i !== excludeIndex,
  );
  const pick = Math.floor(rng() * candidates.length);
  return candidates[pick] ?? 0;
}

