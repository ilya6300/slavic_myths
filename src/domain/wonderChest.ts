/**
 * Сундук чудес: неделя, условия появления, стоимость открытия.
 * Канон: loot_tables.md §«Сундук чудес», scenario.md §5.4
 */

import { miracleChest } from '../config/lootTables';
import { spirits } from '../data/spirits';
import type { SpiritStatus } from './GameSave';
import type { Grade } from './grade';

const RARE_PLUS_GRADES: Grade[] = ['rare', 'epic', 'epoch'];

/** Локальный понедельник 00:00 — идентификатор недели */
export function getWonderChestWeekId(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMonday);
  d.setHours(0, 0, 0, 0);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export interface WonderWeekSyncResult {
  wonderChestWeekId: string;
  wonderChestWeekSlotUsed: boolean;
  isNewWeek: boolean;
}

export function syncWonderChestWeekState(
  weekId: string | null,
  weekSlotUsed: boolean,
  now: Date = new Date(),
): WonderWeekSyncResult {
  const current = getWonderChestWeekId(now);
  if (weekId === current) {
    return {
      wonderChestWeekId: current,
      wonderChestWeekSlotUsed: weekSlotUsed,
      isNewWeek: false,
    };
  }
  return {
    wonderChestWeekId: current,
    wonderChestWeekSlotUsed: false,
    isNewWeek: true,
  };
}

/** Суседко побеждён + хотя бы один rare+ дух defeated */
export function isWonderChestEligible(
  spiritStatuses: Record<string, SpiritStatus>,
): boolean {
  if (spiritStatuses.susedko !== 'defeated') return false;
  return spirits.some(
    (spirit) =>
      RARE_PLUS_GRADES.includes(spirit.grade) &&
      spiritStatuses[spirit.id] === 'defeated',
  );
}

export function canOpenWonderChest(
  weekSlotUsed: boolean,
  clickProgress: number,
): boolean {
  if (!weekSlotUsed) return true;
  return clickProgress >= miracleChest.clicksToOpen;
}

export function wonderChestClicksRequired(): number {
  return miracleChest.clicksToOpen;
}

export function shouldIncrementWonderClickProgress(
  eligible: boolean,
  weekSlotUsed: boolean,
  clickProgress: number,
): boolean {
  if (!eligible || !weekSlotUsed) return false;
  return clickProgress < miracleChest.clicksToOpen;
}

/** Бар на полу. Скрыт на бесплатном слоте недели — даже если clicks > 0 после sync понедельника. */
export function shouldShowWonderChestProgress(
  weekSlotUsed: boolean,
  _clicks: number,
  _required: number,
): boolean {
  return weekSlotUsed;
}

/** Источник `--chest-progress` (clamp 0…1). 0/required → 0; required/required → 1. */
export function wonderChestFillRatio(clicks: number, required: number): number {
  if (required <= 0) return 0;
  const ratio = clicks / required;
  if (ratio < 0) return 0;
  if (ratio > 1) return 1;
  return ratio;
}
