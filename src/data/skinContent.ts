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
    black_green_spark: L('Изумрудный глаз', 'Emerald Eye', 'Zümrüt Göz'),
    cyberpank: L('Киберкот', 'Cyber Cat', 'Siber Kedi'),
    green_mage: L('Зелёный маг', 'Green Mage', 'Yeşil Büyücü'),
    cat_pilgrim: L('Путник', 'Traveler', 'Yolcu'),
    mace: L('Разбойник', 'Bandit', 'Haydut'),
    ninja: L('Ниндзя', 'Ninja', 'Ninja'),
    blue_mage: L('Синий маг', 'Blue Mage', 'Mavi Büyücü'),
    epic_hero: L('Боготырь', 'Bogatyr', 'Boğatır'),
    red_gunner: L('Кибершот', 'Cybershot', 'Siber Atış'),
    vulkan: L('Вулкан', 'Vulkan', 'Vulkan'),
    flying_carpet: L('Ковёр-самолёт', 'Flying Carpet', 'Uçan Halı'),
    purple_mage: L('Волшебство', 'Sorcery', 'Büyü'),
    smook: L('Дымок', 'Smook', 'Duman'),
    midnight_sun: L('Ночное солнце', 'Midnight Sun', 'Gece Güneşi'),
    fluffy_veles: L('Мохнатый', 'Fluffy', 'Tüylü'),
    stormy_perun: L('Грозовик', 'Stormy', 'Fırtınalı'),
    wondrous_div: L('Дивный', 'Wondrous', 'Harika'),
    svarozhich: L('Сварожич', 'Svarozhich', 'Svarojič'),
  },
  izba: {
    hut_standart: L('Стандартная', 'Standard Hut', 'Standart Kulübe'),
    hut_rate: L('Заброшенная', 'Abandoned Hut', 'Terk Edilmiş Kulübe'),
    hut_the_age_of_miracles: L('Магическая', 'Magical Hut', 'Büyülü Kulübe'),
    hut_harmony: L('Гармония', 'Harmony', 'Uyum'),
    hut_cyberpank: L('Неоновая', 'Neon Hut', 'Neon Kulübe'),
  },
  window: {
    landscape_standart: L('Стандартный лес', 'Standard Forest', 'Standart Orman'),
    landscape_temnyy_les: L('Тёмный лес', 'Dark Forest', 'Karanlık Orman'),
    landscape_omut: L('Омут', 'Dark Pool', 'Gölet'),
    landscape_cyber_city: L('Неоновый город', 'Neon City', 'Neon Şehir'),
    landscape_yaga: L('Избушка Яги', 'Yaga\'s Hut', 'Yaga\'nın Kulübesi'),
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
