/**
 * API реплик питомца при клике.
 */

import { pickLocalizedLineExcluding } from '../i18n/resolve';
import type { Locale } from '../i18n/types';
import { petClickDialogContent } from './petDialogContent';
import type { PetId } from './pets';

export function pickPetClickLine(
  petId: PetId,
  locale: Locale,
  lastLine: string | undefined,
  rng: () => number = Math.random,
): string | undefined {
  const bank = petClickDialogContent[petId];
  if (!bank?.length) return undefined;
  return pickLocalizedLineExcluding(bank, locale, lastLine, rng);
}

/** Время показа сноски — с запасом на длинные реплики. */
export function petBubbleVisibleMs(text: string): number {
  const baseMs = 5500;
  const perCharMs = 70;
  return Math.min(12_000, Math.max(baseMs, baseMs + text.length * perCharMs));
}
