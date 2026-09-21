/**
 * Лавка Яги — цены и id товаров (draft §1, §«Лавка Яги»).
 * Строки UI — RU/EN/TR; id не показывать игроку.
 */

import type { LocalizedText } from '../i18n/types';
import type { PetId } from './pets';
import { YAGA_PET_PRICE_CRUMBS } from './pets';

const L = (ru: string, en: string, tr: string): LocalizedText => ({ ru, en, tr });

export const YAGA_SHOP_CAT_SKIN_PRICE = 30;
export const YAGA_SHOP_TITLE_PRICE = 10;
export const YAGA_SHOP_EFFECT_PRICE = 15;

export type YagaShopItemKind = 'cat_skin' | 'title' | 'pet' | 'izba_effect';

export interface YagaShopItem {
  id: string;
  kind: YagaShopItemKind;
  priceCrumbs: number;
  name: LocalizedText;
  /** asset / catalog ref */
  refId: string;
}

/** Пять титулов лавки (не сундук, не квест). */
export const yagaShopTitles: YagaShopItem[] = [
  {
    id: 'shop_title_visionary_cat',
    kind: 'title',
    priceCrumbs: YAGA_SHOP_TITLE_PRICE,
    refId: 'title_visionary_cat',
    name: L('Вещий кот', 'Visionary Cat', 'Gören Kedi'),
  },
  {
    id: 'shop_title_spirit_talker',
    kind: 'title',
    priceCrumbs: YAGA_SHOP_TITLE_PRICE,
    refId: 'title_spirit_talker',
    name: L('Говорящий с духами', 'Spirit Talker', 'Ruhlarla Konuşan'),
  },
  {
    id: 'shop_title_mirror_side',
    kind: 'title',
    priceCrumbs: YAGA_SHOP_TITLE_PRICE,
    refId: 'title_mirror_side',
    name: L('Зазеркальный', 'Mirror-side', 'Ayna Ötesi'),
  },
  {
    id: 'shop_title_oracle',
    kind: 'title',
    priceCrumbs: YAGA_SHOP_TITLE_PRICE,
    refId: 'title_oracle',
    name: L('Оракул', 'Oracle', 'Kahin'),
  },
  {
    id: 'shop_title_clairvoyant',
    kind: 'title',
    priceCrumbs: YAGA_SHOP_TITLE_PRICE,
    refId: 'title_clairvoyant',
    name: L('Ясновидящий', 'Clairvoyant', 'Durugörü'),
  },
];

export const yagaShopPets: YagaShopItem[] = [
  {
    id: 'shop_pet_griffin',
    kind: 'pet',
    priceCrumbs: YAGA_PET_PRICE_CRUMBS,
    refId: 'pet_griffin' satisfies PetId,
    name: L('Грифон', 'Griffin', 'Grifon'),
  },
  {
    id: 'shop_pet_humpback',
    kind: 'pet',
    priceCrumbs: YAGA_PET_PRICE_CRUMBS,
    refId: 'pet_humpback_horse',
    name: L('Конёк-Горбунок', 'Humpback Horse', 'Huşatı At'),
  },
  {
    id: 'shop_pet_firebird',
    kind: 'pet',
    priceCrumbs: YAGA_PET_PRICE_CRUMBS,
    refId: 'pet_firebird',
    name: L('Жар-птица', 'Firebird', 'Ateş Kuşu'),
  },
];

/** Семь скинов кота лавки (draft §«Лавка Яги»). */
export const yagaShopCatSkins: YagaShopItem[] = [
  {
    id: 'shop_cat_smook',
    kind: 'cat_skin',
    priceCrumbs: YAGA_SHOP_CAT_SKIN_PRICE,
    refId: 'smook',
    name: L('Дымок', 'Smook', 'Duman'),
  },
  {
    id: 'shop_cat_purple_mage',
    kind: 'cat_skin',
    priceCrumbs: YAGA_SHOP_CAT_SKIN_PRICE,
    refId: 'purple_mage',
    name: L('Волшебство', 'Sorcery', 'Büyü'),
  },
  {
    id: 'shop_cat_midnight_sun',
    kind: 'cat_skin',
    priceCrumbs: YAGA_SHOP_CAT_SKIN_PRICE,
    refId: 'midnight_sun',
    name: L('Ночное солнце', 'Midnight Sun', 'Gece Güneşi'),
  },
  {
    id: 'shop_cat_fluffy',
    kind: 'cat_skin',
    priceCrumbs: YAGA_SHOP_CAT_SKIN_PRICE,
    refId: 'fluffy_veles',
    name: L('Мохнатый', 'Fluffy', 'Tüylü'),
  },
  {
    id: 'shop_cat_stormy',
    kind: 'cat_skin',
    priceCrumbs: YAGA_SHOP_CAT_SKIN_PRICE,
    refId: 'stormy_perun',
    name: L('Грозовик', 'Stormy', 'Fırtınalı'),
  },
  {
    id: 'shop_cat_wondrous',
    kind: 'cat_skin',
    priceCrumbs: YAGA_SHOP_CAT_SKIN_PRICE,
    refId: 'wondrous_div',
    name: L('Дивный', 'Wondrous', 'Harika'),
  },
  {
    id: 'shop_cat_svarozhich',
    kind: 'cat_skin',
    priceCrumbs: YAGA_SHOP_CAT_SKIN_PRICE,
    refId: 'svarozhich',
    name: L('Сварожич', 'Svarozhich', 'Svarojič'),
  },
];

export const yagaShopIzbaEffects: YagaShopItem[] = [
  {
    id: 'shop_fx_fog',
    kind: 'izba_effect',
    priceCrumbs: YAGA_SHOP_EFFECT_PRICE,
    refId: 'shop_fog',
    name: L('Туман', 'Fog', 'Sis'),
  },
  {
    id: 'shop_fx_firefly',
    kind: 'izba_effect',
    priceCrumbs: YAGA_SHOP_EFFECT_PRICE,
    refId: 'shop_firefly',
    name: L('Огонёк', 'Firefly', 'Ateş Böceği'),
  },
  {
    id: 'shop_fx_ball_lightning',
    kind: 'izba_effect',
    priceCrumbs: YAGA_SHOP_EFFECT_PRICE,
    refId: 'shop_ball_lightning',
    name: L('Шаровая молния', 'Ball lightning', 'Küre şimşek'),
  },
  {
    id: 'shop_fx_stars',
    kind: 'izba_effect',
    priceCrumbs: YAGA_SHOP_EFFECT_PRICE,
    refId: 'shop_stars',
    name: L('Звёздное небо', 'Starry sky', 'Yıldızlı gökyüzü'),
  },
];

export const allYagaShopCrumbItems: YagaShopItem[] = [
  ...yagaShopCatSkins,
  ...yagaShopTitles,
  ...yagaShopPets,
  ...yagaShopIzbaEffects,
];

export function findYagaShopItem(shopItemId: string): YagaShopItem | undefined {
  return allYagaShopCrumbItems.find((i) => i.id === shopItemId);
}

export type YagaShopCatalogTab = 'cat' | 'titles' | 'pets' | 'atmosphere' | 'candles';

export function getYagaShopItemsForTab(tab: Exclude<YagaShopCatalogTab, 'candles'>): YagaShopItem[] {
  switch (tab) {
    case 'cat':
      return yagaShopCatSkins;
    case 'titles':
      return yagaShopTitles;
    case 'pets':
      return yagaShopPets;
    case 'atmosphere':
      return yagaShopIzbaEffects;
  }
}

/** IAP свеча — цена только из PaymentsService / каталога SDK. */
export const YAGA_SHOP_CANDLE_PRODUCT_ID = 'candle_pack_1';
