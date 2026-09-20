/**
 * Таблица правды гадания (draft §1) — для тестов и подсказок; игроку не показывается.
 */

import type { SpiritId } from '../config/assetRegistry';

/** Индексы 0–7: добрый, изба, стихия, вода, лес, зверь, поле, хитрить */
export type DivinationQuestionIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const DIVINATION_TRUTH: Record<SpiritId, boolean[]> = {
  brownie: [true, true, false, false, false, false, false, false],
  susedko: [true, true, false, false, false, true, false, true],
  bannik: [false, false, false, false, false, false, false, false],
  kikimora: [false, true, false, false, false, false, false, false],
  poludnik: [true, false, false, false, false, false, true, false],
  ovinnik: [true, false, false, false, false, false, false, false],
  leshiy: [false, false, false, false, true, false, false, false],
  vodyanoy: [false, false, true, true, false, false, false, false],
  dedushka_toptygin: [true, false, false, false, true, true, false, false],
  poludnica: [true, false, true, false, false, false, true, false],
  rusalka: [false, false, false, true, false, false, false, false],
  lada: [true, false, false, false, false, false, false, false],
  veles: [true, false, false, false, true, false, false, false],
  baba_yaga: [false, true, false, false, true, false, false, false],
  koschei_immortal: [false, false, false, false, false, false, false, true],
  chudo_yudo: [false, false, true, true, false, true, false, false],
  yarilo: [true, false, true, false, false, false, true, false],
  perun: [false, false, true, false, true, false, false, false],
};
