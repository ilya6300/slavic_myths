/**
 * Единый алгоритм цели фрагментного дропа (ежедневка, сундук, loot).
 * Канон: draft.md §8 — очередь locked-духов; selectedFragmentSpiritId только для подсветки книги.
 */

import type { SpiritId } from '../config/assetRegistry';
import { fragmentRequirements } from '../config/lootTables';
import { FRAGMENT_SPIRIT_ORDER } from '../config/fragmentSpiritOrder';
import type { SpiritStatus } from './GameSave';

export function fragmentNeedCount(spiritId: SpiritId): number {
  return fragmentRequirements[spiritId] ?? 0;
}

export function fragmentHaveCount(
  spiritId: SpiritId,
  fragmentCounts: Record<string, number>,
): number {
  return fragmentCounts[spiritId] ?? 0;
}

/** Первый дух в канонической очереди, которому ещё нужны фрагменты. */
export function pickFragmentDropTarget(
  statuses: Record<string, SpiritStatus>,
  fragmentCounts: Record<string, number>,
): SpiritId | null {
  for (const id of FRAGMENT_SPIRIT_ORDER) {
    const need = fragmentNeedCount(id);
    if (need <= 0) continue;
    const have = fragmentHaveCount(id, fragmentCounts);
    if (have >= need) continue;
    const status = statuses[id];
    if (status === 'defeated') continue;
    return id;
  }
  return null;
}

/** Все фрагменты по очереди собраны (43/43) — ежедневка скрывается. */
export function isFragmentChainComplete(
  statuses: Record<string, SpiritStatus>,
  fragmentCounts: Record<string, number>,
): boolean {
  return pickFragmentDropTarget(statuses, fragmentCounts) === null;
}

export function applyFragmentDrop(
  spiritId: SpiritId,
  fragmentCounts: Record<string, number>,
): Record<string, number> {
  const next = { ...fragmentCounts };
  next[spiritId] = (next[spiritId] ?? 0) + 1;
  return next;
}
