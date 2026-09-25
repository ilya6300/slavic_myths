/**
 * Ежедневные задания (два пункта) — доменная логика.
 * Канон: instruction/plans/draft.md §2.
 */

import type { SpiritId } from '../config/assetRegistry';
import { getDailyQuestTalePageCount } from '../data/folktales';
import { getQuizBySpiritId } from '../data/quiz';
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

/** Ежедневка: сказ (страницы или miniTale) + хотя бы один вопрос викторины. */
export function isDailyQuestTaleSpiritEligible(spiritId: SpiritId): boolean {
  if (getDailyQuestTalePageCount(spiritId) <= 0) return false;
  const quiz = getQuizBySpiritId(spiritId);
  return (quiz?.questions.length ?? 0) > 0;
}

export function listDailyQuestTaleSpiritCandidates(
  spiritStatuses: Record<string, SpiritStatus>,
): SpiritId[] {
  return listDefeatedSpiritIds(spiritStatuses).filter(
    isDailyQuestTaleSpiritEligible,
  );
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
  const candidates = listDailyQuestTaleSpiritCandidates(spiritStatuses);
  const previousSpirit =
    state?.dayId && state.taleSpiritId ? state.taleSpiritId : null;

  if (state?.dayId === dayId) {
    const taleSpiritId =
      state.taleSpiritId && candidates.includes(state.taleSpiritId)
        ? state.taleSpiritId
        : pickDailyTaleSpiritId(candidates, state.taleSpiritId, rng);
    if (taleSpiritId === state.taleSpiritId) return state;
    return { ...state, taleSpiritId };
  }

  return {
    dayId,
    taleSpiritId: pickDailyTaleSpiritId(candidates, previousSpirit, rng),
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

export interface DailyQuestRewardedResetState {
  dayId: string;
  taleSpiritId: string | null;
  clickProgress: number;
  taleQuizCorrect: boolean;
  fragmentGrantedDayId: string | null;
  rewardClaimedDayId: string | null;
  rewardedResetDayId: string | null;
}

export function canResetDailyQuestWithRewarded(
  unlocked: boolean,
  fragmentGrantedDayId: string | null,
  rewardedResetDayId: string | null,
  now: Date,
): boolean {
  if (!unlocked) return false;
  const today = getCalendarDayId(now);
  return fragmentGrantedDayId === today && rewardedResetDayId !== today;
}

export function resetDailyQuestAfterRewarded(
  state: DailyQuestRewardedResetState,
  now: Date,
): DailyQuestRewardedResetState {
  return {
    dayId: state.dayId,
    taleSpiritId: state.taleSpiritId,
    clickProgress: 0,
    taleQuizCorrect: false,
    fragmentGrantedDayId: null,
    rewardClaimedDayId: null,
    rewardedResetDayId: getCalendarDayId(now),
  };
}

export function syncDailyQuestRewardedResetDayId(
  rewardedResetDayId: string | null,
  previousDayId: string | null,
  now: Date,
): string | null {
  if (previousDayId !== getCalendarDayId(now)) return null;
  return rewardedResetDayId;
}

/** Сброс ошибочного «награда получена» без закрытого дня (старый баг с daily-find). */
export function shouldClearStaleDailyQuestRewardClaim(
  rewardClaimedDayId: string | null,
  dayId: string,
  clickProgress: number,
  taleQuizCorrect: boolean,
): boolean {
  if (rewardClaimedDayId !== dayId) return false;
  return !isDailyDayComplete({
    dayId,
    taleSpiritId: null,
    clickProgress,
    taleQuizCorrect,
    rewardClaimed: false,
  });
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

