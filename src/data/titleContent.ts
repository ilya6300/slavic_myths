import type { Locale } from '../i18n/types';
import type { LocalizedText } from '../i18n/types';
import { resolveText } from '../i18n/resolve';
import type { TitleDefinition } from './titles';

const L = (ru: string, en: string, tr: string): LocalizedText => ({ ru, en, tr });

/** Локализованные названия титулов — instruction/tituls.md */
export const titleLocalizedNames: Record<string, LocalizedText> = {
  novenkiy: L('Новенький', 'Newcomer', 'Yeni'),
  kot_okhrannik: L('Кот-Охранник', 'Guard Cat', 'Nöbetçi Kedi'),
  melkiy_dukhoborets: L('Мелкий Духоборец', 'Little Spirit Fighter', 'Küçük Ruh Savaşçısı'),
  ushastyy_obereg: L('Ушастый Оберег', 'Eared Talisman', 'Kulaklı Tılsım'),
  tapochnyy_voin: L('Тапочный Воин', 'Slipper Warrior', 'Terlik Savaşçısı'),
  smetannyy_geroy: L('Сметанный Герой', 'Sour Cream Hero', 'Ekşi Krema Kahramanı'),
  sherstyannyy_strazh: L('Шерстяной Страж', 'Woolly Guardian', 'Tüylü Muhafız'),
  drug_pechki: L('Друг Печки', 'Stove Friend', 'Ocak Dostu'),
  lovets_barabashki: L('Ловец Барабашки', 'Barabashka Catcher', 'Barabashka Avcısı'),
  polevoy_kot: L('Полевой кот', 'Field Cat', 'Tarla Kedisi'),
  bannyy_gost: L('Банный Гость', 'Bath Guest', 'Hamam Misafiri'),
  rasputyvatel_nitok: L('Распутыватель Ниток', 'Thread Untangler', 'İplik Çözücü'),
  murchashchiy_strazh: L('Мурлыкающий Страж', 'Purring Guardian', 'Mırıldayan Muhafız'),
  kot_razvedchik: L('Кот-Разведчик', 'Scout Cat', 'Keşif Kedisi'),
  lesnoy_khitrets: L('Лесной Хитрец', 'Forest Trickster', 'Orman Hilekârı'),
  sumerechnyy_kot: L('Сумеречный Кот', 'Twilight Cat', 'Alacakaranlık Kedisi'),
  nochnoy_okhotnik: L('Ночной Охотник', 'Night Hunter', 'Gece Avcısı'),
  zashchitnik_izby: L('Защитник Избы', 'Hut Defender', 'Kulübe Koruyucusu'),
  hodok_po_tropam: L('Ходок по Тропам', 'Path Walker', 'Patika Yürüyücüsü'),
  beregovoy: L('Береговой', 'Shorekeeper', 'Kıyı Bekçisi'),
  kum_toptygina: L('Кум Топтыгина', 'Toptygin\'s Godfather', 'Toptygin\'in Kumisi'),
  zernovoy_dozor: L('Зерновой Дозор', 'Grain Watch', 'Tahıl Nöbeti'),
  povelitel_dukhov: L('Повелитель духов', 'Spirit Master', 'Ruhların Efendisi'),
  serebryanyy_kogot: L('Серебряный Коготь', 'Silver Claw', 'Gümüş Pençe'),
  tenevoy_okhotnik: L('Теневой Охотник', 'Shadow Hunter', 'Gölge Avcısı'),
  groza_zhirdyaev: L('Гроза Жирдяев', 'Bane of Zhirdyays', 'Zhirdyayların Belası'),
  poldnevnyy: L('Полдневный', 'Midday Cat', 'Öğle Vakti'),
  kot_u_berega: L('Кот на берегу', 'Cat on the Shore', 'Kıyıda Kedi'),
  gost_lada: L('Гость Лада', 'Lada\'s Guest', 'Lada\'nın Misafiri'),
  kogot_yagi: L('Коготь Яги', 'Yaga\'s Claw', 'Yaga\'nın Pençesi'),
  lapa_velesa: L('Лапа Велеса', 'Veles\'s Paw', 'Veles\'in Pençesi'),
  slavyanskiy_geroy: L('Славянский Герой', 'Slavic Hero', 'Slav Kahramanı'),
  khranitel_vesny: L('Хранитель весны', 'Spring Keeper', 'Bahar Koruyucusu'),
  razgadchik_smerti: L('Разгадчик Смерти', 'Death\'s Riddler', 'Ölümün Bulmacacısı'),
  kot_skazitel: L('Кот-Сказитель', 'Tale-Teller Cat', 'Masal Anlatıcısı Kedi'),
  khranitel_mifov: L('Хранитель Мифов', 'Myth Keeper', 'Mit Koruyucusu'),
  zolotoy_strazh_rusi: L('Золотой Страж Руси', 'Golden Guardian of Rus', 'Rus\'un Altın Muhafızı'),
  kot_rassvet: L('Кот-Рассвет', 'Dawn Cat', 'Şafak Kedisi'),
  khozyain_slavyanskikh_tayn: L(
    'Хозяин Славянских Тайн',
    'Keeper of Slavic Secrets',
    'Slav Sırlarının Sahibi',
  ),
  strazh_kraya_mira: L('Страж Края Мира', 'Guardian of the World\'s Edge', 'Dünyanın Ucu Muhafızı'),
};

export function resolveTitleName(title: TitleDefinition, locale: Locale): string {
  const localized = titleLocalizedNames[title.id];
  if (localized) return resolveText(localized, locale);
  return title.name;
}
