/**
 * Логика клика по коту: сноска над головой каждые 5 кликов.
 */

import { CAT_CLICK_FOOTNOTE_EVERY } from '../config/gameConstants';
import type { Locale } from '../i18n/types';
import { getClickFootnoteLine, pickCatLine } from '../data/catDialogs';

export type CatClickBubbleKind = 'footnote' | 'bubble' | 'none';

export interface CatClickDialogResult {
  kind: CatClickBubbleKind;
  text?: string;
}

export function shouldShowClickFootnote(clickCount: number): boolean {
  return clickCount > 0 && clickCount % CAT_CLICK_FOOTNOTE_EVERY === 0;
}

/**
 * После инкремента счётчика кликов — какую реплику показать над котом.
 * Каждый 5-й клик — сноска (footnote); иначе без обязательной реплики.
 */
export function resolveCatClickDialog(
  clickCount: number,
  locale: Locale,
  rng: () => number = Math.random,
): CatClickDialogResult {
  if (shouldShowClickFootnote(clickCount)) {
    const text = getClickFootnoteLine(clickCount, locale);
    if (text) {
      return { kind: 'footnote', text };
    }
  }

  // ~15% шанс короткого облачка между «пятёрками»
  if (rng() < 0.15) {
    const text = pickCatLine('click', locale, rng);
    if (text) {
      return { kind: 'bubble', text };
    }
  }

  return { kind: 'none' };
}
