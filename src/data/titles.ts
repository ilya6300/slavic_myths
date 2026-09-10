/**
 * Титулы кота — зеркало instruction/tituls.md
 */

import type { Grade } from '../domain/grade';

export type TitleSource = 'start' | 'quest' | 'chest' | 'event' | 'miracle_chest';

export interface TitleDefinition {
  id: string;
  name: string;
  grade: Grade;
  source: TitleSource;
  description: string;
}

export const titles: TitleDefinition[] = [
  // --- Обычный: старт ---
  {
    id: 'novenkiy',
    name: 'Новенький',
    grade: 'common',
    source: 'start',
    description: 'Только-только пришёл в избу — усы ещё не знают всех духов.',
  },
  // --- Обычный: сундук ---
  {
    id: 'kot_okhrannik',
    name: 'Кот-Охранник',
    grade: 'common',
    source: 'chest',
    description: 'Сидит у порога так, будто это его смена.',
  },
  {
    id: 'melkiy_dukhoborets',
    name: 'Мелкий Духоборец',
    grade: 'common',
    source: 'chest',
    description: 'Духи пока крупные, а бойцовский дух — уже есть.',
  },
  {
    id: 'ushastyy_obereg',
    name: 'Ушастый Оберег',
    grade: 'common',
    source: 'chest',
    description: 'Уши торчком: одно — на Суседко, другое — на сметану.',
  },
  {
    id: 'tapochnyy_voin',
    name: 'Тапочный Воин',
    grade: 'common',
    source: 'chest',
    description: 'Побеждает пыль, мышей и собственные сомнения в тапках хозяина.',
  },
  {
    id: 'smetannyy_geroy',
    name: 'Сметанный Герой',
    grade: 'common',
    source: 'chest',
    description: 'Главное оружие — усы в сметане и чистая совесть.',
  },
  {
    id: 'sherstyannyy_strazh',
    name: 'Шерстяной Страж',
    grade: 'common',
    source: 'chest',
    description: 'Шерсть дыбом — значит, в избе кто-то чужой шуршит.',
  },
  // --- Обычный: квест ---
  {
    id: 'drug_pechki',
    name: 'Друг Печки',
    grade: 'common',
    source: 'quest',
    description: 'Домовой кивнул — у печки теперь свой кот.',
  },
  {
    id: 'lovets_barabashki',
    name: 'Ловец Барабашки',
    grade: 'common',
    source: 'quest',
    description: 'Сундук вернулся. Носки… почти все.',
  },
  {
    id: 'polevoy_kot',
    name: 'Полевой кот',
    grade: 'common',
    source: 'quest',
    description: 'Межа признала: этот кот знает, когда поле работает.',
  },
  {
    id: 'bannyy_gost',
    name: 'Банный Гость',
    grade: 'common',
    source: 'quest',
    description: 'В баню без спроса не лезет — Банник доволен.',
  },
  {
    id: 'rasputyvatel_nitok',
    name: 'Распутыватель Ниток',
    grade: 'common',
    source: 'quest',
    description: 'Клубок сдан. Хаос в избе подождёт до завтра.',
  },
  // --- Редкий: сундук ---
  {
    id: 'murchashchiy_strazh',
    name: 'Мурлыкающий Страж',
    grade: 'rare',
    source: 'chest',
    description: 'Мурлычет так, что даже Суседко затихает на минуту.',
  },
  {
    id: 'kot_razvedchik',
    name: 'Кот-Разведчик',
    grade: 'rare',
    source: 'chest',
    description: 'Первый замечает шорох под половицей.',
  },
  {
    id: 'lesnoy_khitrets',
    name: 'Лесной Хитрец',
    grade: 'rare',
    source: 'chest',
    description: 'В чаще не свистит — и тропы его слушают.',
  },
  {
    id: 'sumerechnyy_kot',
    name: 'Сумеречный Кот',
    grade: 'rare',
    source: 'chest',
    description: 'Между днём и ночью — его любимая смена.',
  },
  {
    id: 'nochnoy_okhotnik',
    name: 'Ночной Охотник',
    grade: 'rare',
    source: 'chest',
    description: 'Ночью храбрее… особенно если хозяин рядом.',
  },
  {
    id: 'zashchitnik_izby',
    name: 'Защитник Избы',
    grade: 'rare',
    source: 'chest',
    description: 'Порог, печка и книга — под его лапой.',
  },
  // --- Редкий: квест ---
  {
    id: 'hodok_po_tropam',
    name: 'Ходок по Тропам',
    grade: 'rare',
    source: 'quest',
    description: 'Леший вывел на опушку — титул сам прилип к усам.',
  },
  {
    id: 'beregovoy',
    name: 'Береговой',
    grade: 'rare',
    source: 'quest',
    description: 'У омута вежлив: крошку — воде, лапу — на суше.',
  },
  {
    id: 'kum_toptygina',
    name: 'Кум Топтыгина',
    grade: 'rare',
    source: 'quest',
    description: 'Мёд поделён по-честному. Медведь кивнул.',
  },
  {
    id: 'zernovoy_dozor',
    name: 'Зерновой Дозор',
    grade: 'rare',
    source: 'quest',
    description: 'Зерно сухое — кот спокоен, Овинник тоже.',
  },
  // --- Эпический: сундук ---
  {
    id: 'povelitel_dukhov',
    name: 'Повелитель духов',
    grade: 'epic',
    source: 'chest',
    description: 'Бестиарий толстеет — и кот вместе с ним.',
  },
  {
    id: 'serebryanyy_kogot',
    name: 'Серебряный Коготь',
    grade: 'epic',
    source: 'chest',
    description: 'Коготь блестит так, будто им подписывали сказки.',
  },
  {
    id: 'tenevoy_okhotnik',
    name: 'Теневой Охотник',
    grade: 'epic',
    source: 'chest',
    description: 'В тени окна — он, а не чужой силуэт.',
  },
  // --- Эпический: квест / событие ---
  {
    id: 'groza_zhirdyaev',
    name: 'Гроза Жирдяев',
    grade: 'epic',
    source: 'event',
    description: 'Ночь больше не командует. Почти.',
  },
  {
    id: 'poldnevnyy',
    name: 'Полдневный',
    grade: 'epic',
    source: 'quest',
    description: 'В жару знает меру: тень важнее клика.',
  },
  {
    id: 'kot_u_berega',
    name: 'Кот на берегу',
    grade: 'epic',
    source: 'quest',
    description: 'Сидел на берегу — и остался сухим.',
  },
  {
    id: 'gost_lada',
    name: 'Гость Лада',
    grade: 'epic',
    source: 'quest',
    description: 'В избе «Гармония» — и титул к лицу стенам.',
  },
  {
    id: 'kogot_yagi',
    name: 'Коготь Яги',
    grade: 'epic',
    source: 'quest',
    description: 'Избушка повернулась лицом. Яга хмыкнула: «Сойдёт».',
  },
  // --- Эпоха чудес: квест ---
  {
    id: 'lapa_velesa',
    name: 'Лапа Велеса',
    grade: 'epoch',
    source: 'quest',
    description: 'Редкая честь: лес и скот признали лапу.',
  },
  {
    id: 'slavyanskiy_geroy',
    name: 'Славянский Герой',
    grade: 'epoch',
    source: 'quest',
    description: 'Много голов — один верный ответ. Финал пути.',
  },
  {
    id: 'razgadchik_smerti',
    name: 'Разгадчик Смерти',
    grade: 'epoch',
    source: 'quest',
    description: 'Нашёл смысл иглы, не потеряв усы.',
  },
  // --- Эпоха чудес: сундук чудес ---
  {
    id: 'kot_skazitel',
    name: 'Кот-Сказитель',
    grade: 'epoch',
    source: 'miracle_chest',
    description: 'Мини-сказы знает наизусть — и добавляет от себя.',
  },
  {
    id: 'khranitel_mifov',
    name: 'Хранитель Мифов',
    grade: 'epoch',
    source: 'miracle_chest',
    description: 'Книга духов — под его лапой и взглядом.',
  },
  {
    id: 'zolotoy_strazh_rusi',
    name: 'Золотой Страж Руси',
    grade: 'epoch',
    source: 'miracle_chest',
    description: 'Золото не в сундуке — в том, что избы целы.',
  },
  {
    id: 'kot_rassvet',
    name: 'Кот-Рассвет',
    grade: 'epoch',
    source: 'miracle_chest',
    description: 'Встречает утро раньше Жирдяя и позже Суседко.',
  },
  {
    id: 'khozyain_slavyanskikh_tayn',
    name: 'Хозяин Славянских Тайн',
    grade: 'epoch',
    source: 'miracle_chest',
    description: 'Тайны не хвастает — мурлычет о них у печки.',
  },
  {
    id: 'strazh_kraya_mira',
    name: 'Страж Края Мира',
    grade: 'epoch',
    source: 'miracle_chest',
    description: 'Там, где сказка кончается, кот ещё сидит на страже.',
  },
];

export const DEFAULT_TITLE_ID = 'novenkiy';

export function getTitleById(id: string): TitleDefinition | undefined {
  return titles.find((t) => t.id === id);
}

export function getTitlesBySource(source: TitleSource): TitleDefinition[] {
  return titles.filter((t) => t.source === source);
}

export function getChestPoolTitles(): TitleDefinition[] {
  return titles.filter((t) => t.source === 'chest');
}

export function getMiracleChestTitles(): TitleDefinition[] {
  return titles.filter((t) => t.source === 'miracle_chest');
}
