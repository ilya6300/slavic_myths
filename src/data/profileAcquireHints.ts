import { STARTER_PACK_CAT_SKIN_ID } from '../config/gameConstants';
import { resolveText } from '../i18n/resolve';
import type { Locale, LocalizedText } from '../i18n/types';
import type { ProfileTab } from '../store/profileUiStore';
import { isDefaultOwnedSkin, type ProfileSkinCategory } from './profileCatalog';
import { getSkinGrade } from './skinPools';

const L = (ru: string, en: string, tr: string): LocalizedText => ({ ru, en, tr });

/** Колонка «Источник» — instruction/tituls.md */
const titleAcquireHints: Record<string, LocalizedText> = {
  novenkiy: L('Старт игры', 'Game start', 'Oyun başlangıcı'),
  kot_okhrannik: L('Сундук', 'Chest', 'Sandık'),
  melkiy_dukhoborets: L('Сундук', 'Chest', 'Sandık'),
  ushastyy_obereg: L('Сундук', 'Chest', 'Sandık'),
  tapochnyy_voin: L('Сундук', 'Chest', 'Sandık'),
  smetannyy_geroy: L('Сундук', 'Chest', 'Sandık'),
  sherstyannyy_strazh: L('Сундук', 'Chest', 'Sandık'),
  drug_pechki: L('После победы над Домовым', 'After defeating the Domovoy', 'Domovoy\'u yendikten sonra'),
  lovets_barabashki: L('После победы над Суседко', 'After defeating Susedko', 'Susedko\'yu yendikten sonra'),
  polevoy_kot: L('После победы над Полевым', 'After defeating the Field Spirit', 'Polovoy\'u yendikten sonra'),
  bannyy_gost: L('После победы над Банником', 'After defeating the Bannik', 'Bannik\'i yendikten sonra'),
  rasputyvatel_nitok: L('После победы над Кикиморой', 'After defeating Kikimora', 'Kikimora\'yı yendikten sonra'),
  murchashchiy_strazh: L('Сундук', 'Chest', 'Sandık'),
  kot_razvedchik: L('Сундук', 'Chest', 'Sandık'),
  lesnoy_khitrets: L('Сундук', 'Chest', 'Sandık'),
  sumerechnyy_kot: L('Сундук', 'Chest', 'Sandık'),
  nochnoy_okhotnik: L('Сундук', 'Chest', 'Sandık'),
  zashchitnik_izby: L('Сундук', 'Chest', 'Sandık'),
  hodok_po_tropam: L('После победы над Лешим', 'After defeating the Leshy', 'Leshiy\'i yendikten sonra'),
  beregovoy: L('После победы над Водяным', 'After defeating the Vodyanoy', 'Vodyanoy\'u yendikten sonra'),
  kum_toptygina: L('После победы над Топтыгиным', 'After defeating Toptygin', 'Toptygin\'i yendikten sonra'),
  zernovoy_dozor: L('После победы над Овинником', 'After defeating the Ovinnik', 'Ovinnik\'i yendikten sonra'),
  groza_zhirdyaev: L('Первый прогнанный Жирдяй', 'First Zhirdyay driven off', 'İlk kovulan Zhirdyay'),
  povelitel_dukhov: L('Сундук', 'Chest', 'Sandık'),
  serebryanyy_kogot: L('Сундук', 'Chest', 'Sandık'),
  tenevoy_okhotnik: L('Сундук', 'Chest', 'Sandık'),
  poldnevnyy: L('После победы над Полудницей', 'After defeating Poludnitsa', 'Poludnitsa\'yı yendikten sonra'),
  kot_u_berega: L('После победы над Русалкой', 'After defeating the Rusalka', 'Rusalka\'yı yendikten sonra'),
  gost_lada: L('После победы над Ладой', 'After defeating Lada', 'Lada\'yı yendikten sonra'),
  kogot_yagi: L('После победы над Бабой-Ягой', 'After defeating Baba Yaga', 'Baba Yaga\'yı yendikten sonra'),
  lapa_velesa: L('После победы над Велесом', 'After defeating Veles', 'Veles\'i yendikten sonra'),
  slavyanskiy_geroy: L('После победы над Чудо-Юдо', 'After defeating Chudo-Yudo', 'Chudo-Yudo\'yu yendikten sonra'),
  khranitel_vesny: L('После победы над Ярило', 'After defeating Yarilo', 'Yarilo\'yu yendikten sonra'),
  razgadchik_smerti: L('После победы над Кощеем', 'After defeating Koschei', 'Koschei\'yi yendikten sonra'),
  kot_skazitel: L('Сундук чудес', 'Wonder chest', 'Mucize sandığı'),
  khranitel_mifov: L('Сундук чудес', 'Wonder chest', 'Mucize sandığı'),
  zolotoy_strazh_rusi: L('Сундук чудес', 'Wonder chest', 'Mucize sandığı'),
  kot_rassvet: L('Сундук чудес', 'Wonder chest', 'Mucize sandığı'),
  khozyain_slavyanskikh_tayn: L('Сундук чудес', 'Wonder chest', 'Mucize sandığı'),
  strazh_kraya_mira: L(
    'Сундук чудес (очень редкий)',
    'Wonder chest (very rare)',
    'Mucize sandığı (çok nadir)',
  ),
  title_visionary_cat: L('Лавка Яги', "Yaga's shop", 'Yaga\'nın dükkânı'),
  title_spirit_talker: L('Лавка Яги', "Yaga's shop", 'Yaga\'nın dükkânı'),
  title_mirror_side: L('Лавка Яги', "Yaga's shop", 'Yaga\'nın dükkânı'),
  title_oracle: L('Лавка Яги', "Yaga's shop", 'Yaga\'nın dükkânı'),
  title_clairvoyant: L('Лавка Яги', "Yaga's shop", 'Yaga\'nın dükkânı'),
};

const YAGA_SHOP_CAT_SKIN_IDS = new Set([
  'smook',
  'purple_mage',
  'midnight_sun',
  'fluffy_veles',
  'stormy_perun',
  'wondrous_div',
  'svarozhich',
]);

const profileAcquireMiracle: LocalizedText = L(
  'Сундук чудес',
  'Wonder chest',
  'Mucize sandığı',
);

const profileAcquireChest: LocalizedText = L(
  'Сундук (каждые 3 ч)',
  'Chest (every 3 h)',
  'Sandık (her 3 saatte)',
);

const profileAcquireStarterPack: LocalizedText = L(
  'Дар путника (покупка)',
  "Wanderer's gift (purchase)",
  'Yolcunun armağanı (satın alma)',
);

const profileAcquireLada: LocalizedText = L(
  'После победы над Ладой',
  'After defeating Lada',
  'Lada\'yı yendikten sonra',
);

const profileAcquireYaga: LocalizedText = L(
  'После победы над Бабой-Ягой',
  'After defeating Baba Yaga',
  'Baba Yaga\'yı yendikten sonra',
);

const profileAcquireYagaShop: LocalizedText = L(
  'Лавка Яги',
  "Yaga's shop",
  'Yaga\'nın dükkânı',
);

export function resolveTitleAcquireHint(titleId: string, locale: Locale): string | null {
  const hint = titleAcquireHints[titleId];
  if (!hint) return null;
  if (titleId === 'novenkiy') return null;
  return resolveText(hint, locale);
}

export function resolveSkinAcquireHint(
  category: ProfileSkinCategory,
  skinId: string,
  locale: Locale,
): string | null {
  if (isDefaultOwnedSkin(skinId)) return null;

  if (category === 'cat' && skinId === STARTER_PACK_CAT_SKIN_ID) {
    return resolveText(profileAcquireStarterPack, locale);
  }
  if (category === 'izba' && skinId === 'hut_harmony') {
    return resolveText(profileAcquireLada, locale);
  }
  if (category === 'window' && skinId === 'landscape_yaga') {
    return resolveText(profileAcquireYaga, locale);
  }

  if (category === 'cat' && YAGA_SHOP_CAT_SKIN_IDS.has(skinId)) {
    return resolveText(profileAcquireYagaShop, locale);
  }

  if (category === 'cat') {
    const grade = getSkinGrade('cat', skinId);
    if (grade === 'epic' || grade === 'epoch') {
      return resolveText(profileAcquireMiracle, locale);
    }
  }

  return resolveText(profileAcquireChest, locale);
}

const profileAcquirePerun: LocalizedText = L(
  'Победите Перуна',
  'Defeat Perun',
  'Perun\'u yen',
);

export function resolveAcquireHintForProfile(
  tab: ProfileTab,
  itemId: string | null,
  locale: Locale,
): string | null {
  if (!itemId) return null;
  if (tab === 'atmosphere' && itemId === 'thunder_izba') {
    return resolveText(profileAcquirePerun, locale);
  }
  if (tab === 'atmosphere' && itemId.startsWith('shop_')) {
    return resolveText(profileAcquireYagaShop, locale);
  }
  if (tab === 'pets' && itemId !== 'none') {
    return resolveText(profileAcquireYagaShop, locale);
  }
  if (tab === 'titles') return resolveTitleAcquireHint(itemId, locale);
  if (tab === 'cat' || tab === 'izba' || tab === 'window' || tab === 'brownie') {
    return resolveSkinAcquireHint(tab, itemId, locale);
  }
  return null;
}
