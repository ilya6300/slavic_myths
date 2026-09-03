import type { Locale } from '../i18n/types';
import type { LocalizedText } from '../i18n/types';
import { resolveText } from '../i18n/resolve';
import type { ProfileSkinCategory } from './profileCatalog';

const L = (ru: string, en: string, tr: string): LocalizedText => ({ ru, en, tr });

/** Отображаемые имена скинов (не id ассета). instruction/profile_layout.md §6 */
const skinLocalizedNames: Record<ProfileSkinCategory, Record<string, LocalizedText>> = {
  cat: {
    cat_standart: L('Рыжик', 'Ginger', 'Turuncu'),
    cat_grey: L('Серый', 'Grey', 'Gri'),
    maycoon: L('Мейкун', 'Maine Coon', 'Maine Coon'),
    snowshoe: L('Сноушу', 'Snowshoe', 'Snowshoe'),
    white: L('Белый', 'White', 'Beyaz'),
    black_green_spark: L('Искристый', 'Green Spark', 'Yeşil Kıvılcım'),
    cyberpank: L('Киберкот', 'Cyber Cat', 'Siber Kedi'),
    green_mage: L('Зелёный маг', 'Green Mage', 'Yeşil Büyücü'),
    mace: L('Тигровый', 'Tiger Mask', 'Kaplan Maskeli'),
    ninja: L('Ниндзя', 'Ninja', 'Ninja'),
    blue_mage: L('Синий маг', 'Blue Mage', 'Mavi Büyücü'),
    epic_hero: L('Эпический герой', 'Epic Hero', 'Epik Kahraman'),
    red_gunner: L('Красный стрелок', 'Red Gunner', 'Kırmızı Nişancı'),
    vulkan: L('Вулкан', 'Vulkan', 'Vulkan'),
    flying_carpet: L('Ковёр-самолёт', 'Flying Carpet', 'Uçan Halı'),
    purple_mage: L('Фиолетовый маг', 'Purple Mage', 'Mor Büyücü'),
    smook: L('Дымок', 'Smook', 'Duman'),
  },
  izba: {
    hut_standart: L('Стандартная', 'Standard Hut', 'Standart Kulübe'),
    hut_rate: L('Редкая', 'Rare Hut', 'Nadir Kulübe'),
    hut_epic: L('Эпическая', 'Epic Hut', 'Epik Kulübe'),
    hut_the_age_of_miracles: L('Эпоха чудес', 'Age of Miracles', 'Mucizeler Çağı'),
  },
  window: {
    landscape_standart: L('Стандартный лес', 'Standard Forest', 'Standart Orman'),
    landscape_temnyy_les: L('Тёмный лес', 'Dark Forest', 'Karanlık Orman'),
    landscape_omut: L('Омут', 'Dark Pool', 'Gölet'),
    landscape_cyber_city: L('Неоновый город', 'Neon City', 'Neon Şehir'),
  },
  brownie: {
    brownie_standart: L('Стандартный', 'Standard Domovoy', 'Standart Domovoy'),
    brownie_rate: L('Редкий', 'Rare Domovoy', 'Nadir Domovoy'),
    brownie_epic: L('Эпический', 'Epic Domovoy', 'Epik Domovoy'),
    the_age_of_miracles_brownie: L('Эпоха чудес', 'Age of Miracles', 'Mucizeler Çağı'),
  },
};

export function resolveSkinName(
  category: ProfileSkinCategory,
  skinId: string,
  locale: Locale,
): string {
  const localized = skinLocalizedNames[category]?.[skinId];
  if (localized) return resolveText(localized, locale);
  return skinId;
}
