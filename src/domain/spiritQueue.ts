/**
 * Очередь духов: unlock после победы, мягкая прогрессия §5.3 scenario.md
 */

import type { SpiritId } from '../config/assetRegistry';
import {
  SPIRIT_ORDER,
  spirits,
  type SpiritDefinition,
} from '../data/spirits';
import type { SpiritStatus } from './GameSave';

export function isSpiritUnlockMet(
  spirit: SpiritDefinition,
  statuses: Record<string, SpiritStatus>,
  fragmentCounts: Record<string, number>,
): boolean {
  switch (spirit.unlock.kind) {
    case 'start':
      return true;
    case 'after_spirit':
      const target = spirit.unlock.targetId;
      return target != null && statuses[target] === 'defeated';
    case 'chest_key':
      return false;
    case 'fragments':
      const needed = spirit.unlock.fragmentCount ?? 0;
      const have = fragmentCounts[spirit.id] ?? 0;
      return have >= needed;
    default:
      return false;
  }
}

/** Духи, которых можно сделать available после победы defeatedId */
export function spiritsToUnlockAfterDefeat(
  defeatedId: SpiritId,
  statuses: Record<string, SpiritStatus>,
  fragmentCounts: Record<string, number>,
): SpiritId[] {
  const result: SpiritId[] = [];

  for (const spirit of spirits) {
    if (statuses[spirit.id] !== 'locked') continue;

    if (spirit.unlock.kind === 'after_spirit' && spirit.unlock.targetId === defeatedId) {
      result.push(spirit.id);
      continue;
    }

    if (isSpiritUnlockMet(spirit, statuses, fragmentCounts)) {
      result.push(spirit.id);
    }
  }

  return result;
}

export function applyDefeatAndUnlock(
  defeatedId: SpiritId,
  statuses: Record<string, SpiritStatus>,
  fragmentCounts: Record<string, number>,
): Record<string, SpiritStatus> {
  const next = { ...statuses, [defeatedId]: 'defeated' as SpiritStatus };

  for (const id of spiritsToUnlockAfterDefeat(defeatedId, next, fragmentCounts)) {
    next[id] = 'available';
  }

  return next;
}

export function countDefeatedSpirits(
  statuses: Record<string, SpiritStatus>,
): number {
  return SPIRIT_ORDER.filter((id) => statuses[id] === 'defeated').length;
}

export function findNextAvailableSpirit(
  statuses: Record<string, SpiritStatus>,
): SpiritId | null {
  for (const id of SPIRIT_ORDER) {
    if (statuses[id] === 'available') return id;
  }
  return null;
}

export function findSpiritIndex(spiritId: SpiritId): number {
  return SPIRIT_ORDER.indexOf(spiritId);
}

/** После сбора фрагментов — открыть духов с unlock.kind === fragments */
export function applyFragmentUnlocks(
  statuses: Record<string, SpiritStatus>,
  fragmentCounts: Record<string, number>,
): Record<string, SpiritStatus> {
  const next = { ...statuses };

  for (const spirit of spirits) {
    if (next[spirit.id] !== 'locked') continue;
    if (isSpiritUnlockMet(spirit, next, fragmentCounts)) {
      next[spirit.id] = 'available';
    }
  }

  return next;
}

export function isFragmentSpirit(spiritId: SpiritId): boolean {
  const spirit = spirits.find((s) => s.id === spiritId);
  return spirit?.unlock.kind === 'fragments';
}
