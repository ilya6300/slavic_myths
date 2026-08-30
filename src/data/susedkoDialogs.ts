/**
 * Реплики Суседко — тексты в dialogContent.ts
 * Канон: instruction/susedko_dialogs.md
 */

import type { Locale } from '../i18n/types';
import {
  pickLocalizedLineExcluding,
  resolveLines,
  resolveText,
} from '../i18n/resolve';
import { SUSEDKO_CLICKS_TO_FLEE } from '../config/gameConstants';
import { susedkoDialogContent } from './dialogContent';

export { SUSEDKO_CLICKS_TO_FLEE };

export function getSusedkoCatWarning(locale: Locale): string {
  return resolveText(susedkoDialogContent.catWarning, locale);
}

export function getSusedkoTauntLines(locale: Locale): string[] {
  return resolveLines(susedkoDialogContent.taunts, locale);
}

export function getSusedkoFleeLine(locale: Locale): string {
  return resolveText(susedkoDialogContent.fleeLine, locale);
}

export function pickSusedkoTaunt(
  locale: Locale,
  exclude?: string,
  rng: () => number = Math.random,
): string | undefined {
  return pickLocalizedLineExcluding(
    susedkoDialogContent.taunts,
    locale,
    exclude,
    rng,
  );
}
