/**
 * Чистая логика сеанса гадания — draft §1.
 */

import type { SpiritId } from '../config/assetRegistry';
import { SPIRIT_ORDER } from '../data/spirits';
import type { SpiritStatus } from './GameSave';

export const DIVINATION_NAME_BUTTON_COUNT = 8;

export function listDefeatedForDivination(
  statuses: Record<string, SpiritStatus>,
): SpiritId[] {
  return SPIRIT_ORDER.filter((id) => statuses[id] === 'defeated');
}

export function pickDivinationSpiritId(
  defeated: SpiritId[],
  rng: () => number = Math.random,
): SpiritId | null {
  if (!defeated.length) return null;
  const i = Math.floor(rng() * defeated.length);
  return defeated[i] ?? null;
}

export function buildDivinationNamePool(
  correctId: SpiritId,
  defeated: SpiritId[],
  rng: () => number = Math.random,
): SpiritId[] {
  if (defeated.length <= DIVINATION_NAME_BUTTON_COUNT) {
    return [...defeated].sort(() => rng() - 0.5);
  }
  const others = defeated.filter((id) => id !== correctId);
  const picked: SpiritId[] = [correctId];
  const pool = [...others];
  while (picked.length < DIVINATION_NAME_BUTTON_COUNT && pool.length) {
    const j = Math.floor(rng() * pool.length);
    picked.push(pool.splice(j, 1)[0]!);
  }
  return picked.sort(() => rng() - 0.5);
}

export function isDivinationUnlocked(
  statuses: Record<string, SpiritStatus>,
): boolean {
  return statuses.baba_yaga === 'defeated';
}
