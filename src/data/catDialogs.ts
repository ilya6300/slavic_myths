/**
 * API реплик кота — тексты в dialogContent.ts, локаль из настроек.
 * Канон: instruction/cat_dialogs.md; scenario.md §4.3, §8; cat_dialog_layout.md
 */

import type { SpiritId } from '../config/assetRegistry';
import type { Locale } from '../i18n/types';
import {
  formatLocalizedTemplate,
  pickLocalizedLine,
  resolveLines,
  resolveText,
} from '../i18n/resolve';
import {
  catDialogBanksContent,
  onboardingLines,
  zhirdyayWinLine,
  type CatDialogBankKey,
} from './dialogContent';
import { spiritCatDialogContent } from './spiritCatDialogContent';

export function getQuestHook(spiritId: SpiritId, locale: Locale): string {
  return resolveText(spiritCatDialogContent[spiritId].questHook, locale);
}

export function getSpiritLoseLine(spiritId: SpiritId, locale: Locale): string {
  return resolveText(spiritCatDialogContent[spiritId].loseLine, locale);
}

export function getSpiritLockedHint(spiritId: SpiritId, locale: Locale): string {
  return resolveText(spiritCatDialogContent[spiritId].lockedHint, locale);
}

export type CatDialogTag = CatDialogBankKey;

export type CatDialogMode = 'footnote' | 'novel';

export interface CatDialogLine {
  text: string;
  mode: CatDialogMode;
  tag?: CatDialogTag;
  blocking?: boolean;
}

export function getOnboardingLine(step: number, locale: Locale): string | undefined {
  const entry = onboardingLines[step];
  return entry ? resolveText(entry, locale) : undefined;
}

export function getCatBankLines(tag: CatDialogTag, locale: Locale): string[] {
  const bank = catDialogBanksContent[tag];
  if (tag === 'miracle_chest_progress') {
    return [resolveText(bank as typeof catDialogBanksContent.miracle_chest_progress, locale)];
  }
  return resolveLines(bank as readonly { ru: string; en: string; tr: string }[], locale);
}

export function pickCatLine(
  tag: CatDialogTag,
  locale: Locale,
  rng: () => number = Math.random,
): string | undefined {
  if (tag === 'miracle_chest_progress') {
    return resolveText(catDialogBanksContent.miracle_chest_progress, locale);
  }
  const bank = catDialogBanksContent[tag];
  return pickLocalizedLine(bank, locale, rng);
}

export function getClickFootnoteLine(
  clickCount: number,
  locale: Locale,
): string | undefined {
  const lines = getCatBankLines('click_footnote', locale);
  if (lines.length === 0) return undefined;
  const index = Math.floor(clickCount / 5) - 1;
  return lines[index % lines.length];
}

export function getZhirdyayWinLine(locale: Locale): string {
  return resolveText(zhirdyayWinLine, locale);
}

export function formatMiracleProgressLine(
  progress: number,
  total: number,
  locale: Locale,
): string {
  return formatLocalizedTemplate(
    catDialogBanksContent.miracle_chest_progress,
    locale,
    { progress, total },
  );
}
