/**
 * Арт-канон скинов лавки Яги (эпоха чудес).
 * Каждый id — отдельный персонаж: силуэт, палитра и «чудо» вшиты в тело, не наклейка на Рыжика.
 * Промпты генерации: scripts/yaga-shop-epoch-cat-prompts.mjs (синхрон с design_assets_prompts.md).
 */

import type { LocalizedText } from '../i18n/types';
import { yagaShopCatSkins } from './yagaShop';

const L = (ru: string, en: string, tr: string): LocalizedText => ({ ru, en, tr });

export type YagaShopCatSkinId =
  | 'smook'
  | 'purple_mage'
  | 'midnight_sun'
  | 'fluffy_veles'
  | 'stormy_perun'
  | 'wondrous_div'
  | 'svarozhich';

export interface YagaShopCatSkinArtSpec {
  id: YagaShopCatSkinId;
  /** Кратко для превью лавки — суть образа, не имя */
  tagline: LocalizedText;
}

export const yagaShopCatSkinArt: Record<YagaShopCatSkinId, YagaShopCatSkinArtSpec> = {
  smook: {
    id: 'smook',
    tagline: L(
      'Кот из тёплого дыма избушки — полупрозрачные клубы вместо обычной шерсти',
      'A cat woven from warm hut smoke — soft wisps instead of ordinary fur',
      'Kulübe dumanından örülü kedi — sıradan tüy yerine yumuşak duman',
    ),
  },
  purple_mage: {
    id: 'purple_mage',
    tagline: L(
      'Весь кот — фиолетовый маг эпохи чудес, руны и свет в шерсти',
      'The whole cat is an epoch sorcerer — runes and glow in the fur',
      'Bütün kedi — çağın mor büyücüsü, tüyde runlar ve ışık',
    ),
  },
  midnight_sun: {
    id: 'midnight_sun',
    tagline: L(
      'Янтарный длинношёрстный храмовый кот; солнце — узор в груди, не медальон',
      'Amber longhair temple cat; the sun is a chest pattern, not a badge',
      'Kehribar uzun tüylü tapınak kedisi; güneş göğüste desen, madalyon değil',
    ),
  },
  fluffy_veles: {
    id: 'fluffy_veles',
    tagline: L(
      'Медвежий силуэт, гора меха; золотой бычок вплетён в шерсть',
      'Bear-like silhouette, a mountain of fur; golden bull woven into the coat',
      'Ayı silüeti, tüy dağı; altın boğa posta örülü',
    ),
  },
  stormy_perun: {
    id: 'stormy_perun',
    tagline: L(
      'Кот из живой мягкой молнии — тихая гроза Перуна',
      'A cat woven from living soft lightning — Perun’s quiet storm',
      'Yumuşak şimşekten örülü kedi — Perun’un sessiz fırtınası',
    ),
  },
  wondrous_div: {
    id: 'wondrous_div',
    tagline: L(
      'Пепельный кот лавки, обычные пропорции; тень крыла в шерсти, взгляд вдаль',
      'Ash-grey shop cat, normal build; wing-shadow in the fur, gaze far away',
      'Küllü dükkan kedisi, normal gövde; tüyde kanat gölgesi',
    ),
  },
  svarozhich: {
    id: 'svarozhich',
    tagline: L(
      'Тёмный кот с жаром зерносушилки изнутри — угли в подшёрстке',
      'Dark cat with granary-fire glow within — embers in the undercoat',
      'İçten tahıl kurutma ateşi parıltısı — alttüyde korlar',
    ),
  },
};

export function getYagaShopCatSkinArt(refId: string): YagaShopCatSkinArtSpec | undefined {
  return yagaShopCatSkinArt[refId as YagaShopCatSkinId];
}

/** Каждый shop refId обязан иметь арт-спеку. */
export function assertYagaShopCatSkinArtComplete(): void {
  for (const item of yagaShopCatSkins) {
    if (!getYagaShopCatSkinArt(item.refId)) {
      throw new Error(`Missing yagaShopCatSkinArt for ${item.refId}`);
    }
  }
}
