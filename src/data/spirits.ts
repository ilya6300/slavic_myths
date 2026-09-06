/**
 * Духи бестиария — зеркало instruction/list_of_spirits.md
 * Награды §5.5 scenario.md — типы, не хардкод в UI.
 */

import type { SpiritId } from '../config/assetRegistry';
import type { Grade } from '../domain/grade';

export type QuizLocationId =
  | 'izba'
  | 'banya'
  | 'les'
  | 'pole'
  | 'voda'
  | 'temnyy_les';

export type SpiritChapter = 'dom' | 'dvor' | 'les' | 'epoch';

export type SpiritUnlockKind =
  | 'start'
  | 'after_spirit'
  | 'chest_key'
  | 'fragments';

export interface SpiritUnlock {
  kind: SpiritUnlockKind;
  /** id духа-предшественника или целевого духа для ключей/фрагментов */
  targetId?: SpiritId;
  fragmentCount?: number;
}

export type SpiritRewardKind =
  | 'domovoy_on_scene'
  | 'chest_appears'
  | 'max_energy'
  | 'obereg'
  | 'title_and_energy'
  | 'reward_energy'
  | 'regen_percent'
  | 'title_only'
  | 'luck_cap_and_title'
  | 'day_coin_bonus'
  | 'night_zhirdyay_reduction';

export interface SpiritReward {
  kind: SpiritRewardKind;
  /** Для title_* наград */
  titleId?: string;
  amount?: number;
  percent?: number;
  skinId?: string;
}

export interface SpiritDefinition {
  id: SpiritId;
  name: string;
  grade: Grade;
  chapter: SpiritChapter;
  unlock: SpiritUnlock;
  locationId: QuizLocationId;
  bookDescription: string;
  bookRewardDescription: string;
  loseMessage: string;
  trophyDescription: string;
  miniTale: string;
  /** Пустая строка — трофея нет (Домовой) */
  hasTrophy: boolean;
  reward: SpiritReward;
  lockedHint: string;
}

export const SPIRIT_ORDER: SpiritId[] = [
  'brownie',
  'susedko',
  'bannik',
  'kikimora',
  'poludnik',
  'ovinnik',
  'leshiy',
  'vodyanoy',
  'dedushka_toptygin',
  'poludnica',
  'rusalka',
  'lada',
  'veles',
  'baba_yaga',
  'koschei_immortal',
  'chudo_yudo',
];

export const spirits: SpiritDefinition[] = [
  {
    id: 'brownie',
    name: 'Домовой',
    grade: 'common',
    chapter: 'dom',
    unlock: { kind: 'start' },
    locationId: 'izba',
    bookDescription:
      'Хозяин избы. Корми — поможет. Зли — посуда в полёт, ночью кошмары. Без него тут бардак.',
    bookRewardDescription:
      'Задобришь — станет союзником в избе. Бонус удачи с клика: +1% (обычный скин), +2% (редкий), +3% (эпик), +5% (эпический).',
    loseMessage:
      'Ох уж эти духи. Лапу сломишь, пока поймёшь, чего им надо.',
    trophyDescription: 'Трофея нет — сам Домовой теперь живёт в избе у печки.',
    miniTale:
      'Сказ о сметане и хозяине. Я принёс блюдце и сказал «добро пожаловать». Домовой хмыкнул, спрятал веник за печку и остался. Чем кормишь — тем дом и держится.',
    hasTrophy: false,
    reward: { kind: 'domovoy_on_scene' },
    lockedHint: '',
  },
  {
    id: 'susedko',
    name: 'Суседко (Барабашка)',
    grade: 'common',
    chapter: 'dom',
    unlock: { kind: 'after_spirit', targetId: 'brownie' },
    locationId: 'izba',
    bookDescription:
      'Мохнатый сосед из-под половиц. Ночью устраивает «тыгыдык», шуршит пакетами и тащит мелочь. Шаги бесшумны — мягкая шерсть на лапках. Сундук утащил именно он.',
    bookRewardDescription:
      'Вернул сундук в избу. Первое открытие — сразу, дальше по таймеру. Удача копится, пока ты гуляешь.',
    loseMessage:
      'Сбежал. Сундука нет. Где мне теперь мышей хранить?',
    trophyDescription:
      'Крошечный возвращённый сундук для полки — не тот большой, что копит удачу на полу. Барабашка его вернул… почти добровольно.',
    miniTale:
      'Сказ о бесшумном воришке и возвращённом сундуке. Я сел у щели и ждал. Когда он полез за носком — хлоп лапой по крышке. «Отдай сундук — оставлю носки». Сделка века. Говорят, Суседко ворует не от злости, а от скуки: дай ему занятие — и дом целее.',
    hasTrophy: true,
    reward: { kind: 'chest_appears' },
    lockedHint: 'Сначала Домовой. Без него сосед не вылезет.',
  },
  {
    id: 'bannik',
    name: 'Банник',
    grade: 'common',
    chapter: 'dom',
    unlock: { kind: 'after_spirit', targetId: 'susedko' },
    locationId: 'banya',
    bookDescription:
      'Строгий хозяин бани. Любит чистоту, пар и уважение. Придёшь с добром — согреет; без поклона — парком «пожурит». В баню не входят грубо и не ночуют без спроса.',
    bookRewardDescription:
      '+5 к максимуму энергии навсегда. В HUD будет видно: текущая / новый макс. (например 100/105).',
    loseMessage: 'Не угодили. Теперь паримся… что не попарились...',
    trophyDescription: 'Старый банный веник — ещё тёплый, будто только с полка.',
    miniTale:
      'Сказ о парке и вежливой лапе. Я постучал в дверь, оставил веник у порога и не стал мяукать на полке — Банник это ценит. Он кивнул: «Можешь заходить». В народе знали: в баню входят с добром, а не как на пикник.',
    hasTrophy: true,
    reward: { kind: 'max_energy', amount: 5 },
    lockedHint: 'Сначала Суседко. Банник пар даром не даёт.',
  },
  {
    id: 'kikimora',
    name: 'Кикимора',
    grade: 'common',
    chapter: 'dom',
    unlock: { kind: 'after_spirit', targetId: 'bannik' },
    locationId: 'izba',
    bookDescription:
      'Худая хозяюшка избы и сырых углов. Любит порядок — но если хаос, путает нитки, прячет вещи и шуршит по ночам. Задобрить заботой проще, чем криком.',
    bookRewardDescription: '+1 тайный оберег в инвентарь (иконка в HUD).',
    loseMessage:
      'Умчалась в болото. Посуда? Вон осколки. Мыши живы — уже хорошо.',
    trophyDescription:
      'Клубок чёрной спутанной шерсти — не распутывай, пусть лежит трофеем.',
    miniTale:
      'Сказ о клубке и ночном шуме. Я не ловил её — я разложил нитки ровно и попросил: «Хватит прятать мои мышиные запасы». Она хихикнула и кинула клубок. Говорили: Кикимора путает пряжу тому, у кого в доме путаница в делах.',
    hasTrophy: true,
    reward: { kind: 'obereg', amount: 1 },
    lockedHint: 'Сначала Банник. Кикимора любит чистые лапы.',
  },
  {
    id: 'poludnik',
    name: 'Полевой',
    grade: 'common',
    chapter: 'dvor',
    unlock: { kind: 'after_spirit', targetId: 'kikimora' },
    locationId: 'pole',
    bookDescription:
      'Весёлый дух лугов и межи. Следит, чтобы урожай рос, а люди в жару не ломали спину без меры. Любит благодарность земле — и не любит, когда поле топчут зря.',
    bookRewardDescription:
      'Титул «Полевой кот» и +10 энергии разово (может превысить макс.; в HUD: текущая / макс.).',
    loseMessage:
      'По полям, по полям, убегает кот от полевого!',
    trophyDescription:
      'Круглый венок из колосьев и полевых цветов — дар живому полю; пахнет сеном и победой.',
    miniTale:
      'Сказ о меже и коротком отдыхе. Жара. Я лёг в тень межи и не полез в колосья лапами. Полевой вышел, кинул венок: «Умный кот — знает, когда поле работает, а когда человек». Крестьяне в полдень отдыхали не от лени — от уважения к земле.',
    hasTrophy: true,
    reward: { kind: 'title_and_energy', titleId: 'polevoy_kot', amount: 10 },
    lockedHint: 'Сначала Кикимора. Полевой без порядка в избе не выйдет.',
  },
  {
    id: 'ovinnik',
    name: 'Овинник',
    grade: 'common',
    chapter: 'dvor',
    unlock: { kind: 'after_spirit', targetId: 'poludnik' },
    locationId: 'pole',
    bookDescription:
      'Хранитель овина и зерна. Следит, чтобы урожай оставался сухим и целым. Грязь и небрежность не любит; к хлебу с почтением — поможет.',
    bookRewardDescription:
      '+50 энергии разово (может превысить макс.; в HUD: текущая / макс.).',
    loseMessage:
      'Шухер! Прятки! Тихо, сзади шорох… а, это мой хвост.',
    trophyDescription:
      'Высокий сноп спелой пшеницы, связанный верёвкой — зерно для зимы в овине, не круглый венок Полевого.',
    miniTale:
      'Сказ о сухом зерне и мокрой лапе. Я не стал топтать солому и не чихнул на огонь овина — Овинник это заметил. Дал сноп и запас сил «за порядок». В старину овин берегли пуще избы: сгори зерно — зима будет голодной.',
    hasTrophy: true,
    reward: { kind: 'reward_energy', amount: 50 },
    lockedHint: 'Сначала Полевой. Овинник зерно зря не отдаст.',
  },
  {
    id: 'leshiy',
    name: 'Леший',
    grade: 'rare',
    chapter: 'les',
    unlock: { kind: 'after_spirit', targetId: 'ovinnik' },
    locationId: 'les',
    bookDescription:
      'Хозяин леса, повелитель троп и зверья. Неуважительным путает дорогу; заботливым — выводит к опушке. В лесу он — закон, а ты — гость.',
    bookRewardDescription:
      '+5% к скорости восстановления энергии (пассивно, навсегда).',
    loseMessage:
      'Увёл в чащу. Придётся сначала. Так, а как попасть в избу? Хм...',
    trophyDescription:
      'Деревянный посох, обвитый плющом — тропа помнит хозяина.',
    miniTale:
      'Сказ о кривой тропе и прямой просьбе. Я не ломал ветки и не свистел в чаще — Леший сам вышел. «Иди за мной» — и вот опушка. Посох оставил на память. Говорили: Леший ростом с дерево или с травинку — как захочет. Главное — не зли.',
    hasTrophy: true,
    reward: { kind: 'regen_percent', percent: 5 },
    lockedHint: 'Сначала Овинник. Леший тропу без очереди не даст.',
  },
  {
    id: 'vodyanoy',
    name: 'Водяной',
    grade: 'rare',
    chapter: 'les',
    unlock: { kind: 'after_spirit', targetId: 'leshiy' },
    locationId: 'voda',
    bookDescription:
      'Повелитель рек, омутов и всех, кто плещется. Жадинам прячет рыбу; тем, кто воду уважает, — может и одарить. Без спроса в омут не суйся.',
    bookRewardDescription:
      '+1 тайный оберег в инвентарь и раковина на полке.',
    loseMessage:
      'На дно? В переносном. Мокрый я — в прямом.',
    trophyDescription:
      'Большая речная раковина — внутри шумит дальняя вода.',
    miniTale:
      'Сказ о тихом омуте и сухой лапе. Я не плескался у омута без нужды и бросил в воду кусочек хлеба — «на угощение». Водяной вынырнул, фыркнул пузырями и кинул раковину. В народе знали: воду не ругают и не плюют — иначе улов уйдёт, а человек — за ним.',
    hasTrophy: true,
    reward: { kind: 'obereg', amount: 1 },
    lockedHint: 'Сначала Леший. Водяной без леса не зовёт.',
  },
  {
    id: 'dedushka_toptygin',
    name: 'Дедушка Топтыгин',
    grade: 'rare',
    chapter: 'les',
    unlock: { kind: 'chest_key', targetId: 'dedushka_toptygin' },
    locationId: 'les',
    bookDescription:
      'Добродушный дух-медведь, сила леса без злобы. Любит мёд и тишину. Заблудшим помогает, жадным — показывает, где выход… другим путём. Настоящая сила рядом с добротой.',
    bookRewardDescription:
      '+10 к максимуму энергии навсегда (в HUD: текущая / новый макс.). Открывается ключом из сундука.',
    loseMessage:
      'Это был медведь? Когда он в спячку впадает? Может подождём?',
    trophyDescription: 'Деревянная медвежья лапа — капля мёда ещё блестит.',
    miniTale:
      'Сказ о мёде и крепком рукопожатии. Я не дразнил — просто сел рядом и поделился каплей. Топтыгин кивнул: «Хороший кот». Лапу-трофей вырезал сам. В сказках медведь — и гроза, и кум: зли его — беда, уважай — путь открыт.',
    hasTrophy: true,
    reward: { kind: 'max_energy', amount: 10 },
    lockedHint: 'Ключ из сундука. Топтыгин сам не придёт.',
  },
  {
    id: 'poludnica',
    name: 'Полудница',
    grade: 'epic',
    chapter: 'dvor',
    unlock: { kind: 'chest_key', targetId: 'poludnica' },
    locationId: 'pole',
    bookDescription:
      'Хранительница полей в самый жаркий час. Является в полдень и напоминает: работай с умом, знай меру. Кто слушает землю — того не покарает зноем.',
    bookRewardDescription:
      '+15 к максимуму энергии навсегда (в HUD: текущая / новый макс.). Открывается ключом из сундука.',
    loseMessage:
      'Закружила голову. Сворачиваем хвосты — что так жарко? Так, а где Полудница-то?',
    trophyDescription:
      'Маленький серп с лентой — полдень помнит тех, кто знает меру.',
    miniTale:
      'Сказ о полдне и короткой тени. Солнце пекло. Я лёг в тень и не стал «ещё один клик» через силу. Полудница улыбнулась: «Умный». Серп с лентой — в награду. Предки в полдень отдыхали: Полудница наказывает тех, кто ломает себя на жаре.',
    hasTrophy: true,
    reward: { kind: 'max_energy', amount: 15 },
    lockedHint: 'Ключ из сундука. Редкий. Полудница не любит спешку.',
  },
  {
    id: 'rusalka',
    name: 'Русалка',
    grade: 'epic',
    chapter: 'les',
    unlock: { kind: 'chest_key', targetId: 'rusalka' },
    locationId: 'voda',
    bookDescription:
      'Дух реки и озёрной глади. Поёт при луне, играет венками, заманивает неосторожных. К воде с заботой и восхищением — благосклонна; с жадностью — береги берег.',
    bookRewardDescription:
      'Титул «Кот у берега» и +10 энергии разово (может превысить макс.; в HUD: текущая / макс.). Открывается ключом из сундука.',
    loseMessage:
      'В следующий раз может удочку с собой взять? ',
    trophyDescription:
      'Серебряный гребень с водорослями — не расчёсывай им чужие сны.',
    miniTale:
      'Сказ о гребне и сухом хвосте. Я сидел на берегу, бросил венок — и не полез в омут «за гребнем». Русалка кивнула с воды: «Умный гость». В преданиях русалки купаются у берега и хватают неосторожных — а тех, кто уважает воду, отпускают сухими.',
    hasTrophy: true,
    reward: { kind: 'title_and_energy', titleId: 'kot_u_berega', amount: 10 },
    lockedHint: 'Ключ из сундука. Эпик. Русалка сама не поётся.',
  },
  {
    id: 'lada',
    name: 'Лада',
    grade: 'epic',
    chapter: 'epoch',
    unlock: { kind: 'fragments', targetId: 'lada', fragmentCount: 3 },
    locationId: 'les',
    bookDescription:
      'Светлая сила красоты, лада и согласия. Где она — там тепло и гармония. Благоволит тем, кто творит доброту и красоту вокруг себя, а не только копит монеты.',
    bookRewardDescription:
      'Титул «Гость Лада» (в профиле). Трофей — гармония-ваза на полку. Условие: 3 фрагмента.',
    loseMessage: 'Хватит глазеть. Гармонию так не поймаешь.',
    trophyDescription:
      'Глиняная гармония-ваза с узким горлом, двумя ручками и простым орнаментом — изба после неё дышит иначе.',
    miniTale:
      'Сказ о вазе и тихой избе. Я не спорил, не торопил и поправил кривой цветок у порога. Лада улыбнулась — и стены стали мягче светом. Гармония-ваза с цветами осталась нам. В старину лад в доме берегли как огонь: без согласия ни урожай, ни любовь не держатся.',
    hasTrophy: true,
    reward: { kind: 'title_only', titleId: 'gost_lada' },
    lockedHint: '3 осколка. Лада без лада не придёт.',
  },
  {
    id: 'veles',
    name: 'Велес',
    grade: 'epoch',
    chapter: 'epoch',
    unlock: { kind: 'fragments', targetId: 'veles', fragmentCount: 6 },
    locationId: 'les',
    bookDescription:
      'Покровитель скота, лесов, тайных троп и земной мудрости. Учит жить в ладу с природой. Уважает заботу о зверях и знание меры — не пустой шум.',
    bookRewardDescription:
      'Титул «Лапа Велеса» (в профиле). Условие: 6 фрагментов.',
    loseMessage: 'Пошли в избу. Над нами уже звери ржут.',
    trophyDescription:
      'Деревянный бюст Велеса с рогами — с полки глядит мудро, без крика.',
    miniTale:
      'Сказ о рогах и тихой лапе. В чаще я не хвастался и не гонял зверя — сел и слушал. Велес кивнул: «Этот кот знает цену лесу». Бюст — на полку, титул «Лапа Велеса» — в книгу. Велеса звали и скотьим богом, и хозяином низа: мудрость его — земная, не крикливая.',
    hasTrophy: true,
    reward: { kind: 'title_only', titleId: 'lapa_velesa' },
    lockedHint: '6 осколков. Велес терпелив. Ты — нет.',
  },
  {
    id: 'baba_yaga',
    name: 'Баба-Яга',
    grade: 'epoch',
    chapter: 'epoch',
    unlock: { kind: 'fragments', targetId: 'baba_yaga', fragmentCount: 3 },
    locationId: 'temnyy_les',
    bookDescription:
      'Старуха в избушке на курьих ножках. Не просто «злая» — испытует ум, смелость и сердце. Прошедшим испытание может дать совет, дар… или дорогу дальше.',
    bookRewardDescription:
      'Титул «Коготь Яги» (в профиле). Трофей — избушка на курьих ножках на полку. Условие: 3 фрагмента.',
    loseMessage:
      'Хорошо хоть не съела. Зайдём, когда аппетит поменьше будет.',
    trophyDescription: 'Маленькая избушка на курьих ножках — стоит, куда повернут.',
    miniTale:
      'Сказ о курьих ножках и правильных словах. Я попросил избушку повернуться ко мне передом — и не полез без спроса в ступу. Яга хмыкнула: «Кот учтивый». В сказках Яга то враг, то помощница: смотря, как стучишься.',
    hasTrophy: true,
    reward: { kind: 'title_only', titleId: 'kogot_yagi' },
    lockedHint: '3 осколка. Яга уже ступу греет.',
  },
  {
    id: 'koschei_immortal',
    name: 'Кощей Бессмертный',
    grade: 'epoch',
    chapter: 'epoch',
    unlock: { kind: 'fragments', targetId: 'koschei_immortal', fragmentCount: 5 },
    locationId: 'temnyy_les',
    bookDescription:
      'Владыка, чья смерть спрятана далеко. Хранитель тайн и сокровищ. Уважает хитрость и твёрдый дух; грубость и жадность прощает редко — если вообще прощает.',
    bookRewardDescription:
      '+20 к cap монет удачи (до 220) и титул «Разгадчик Смерти». Условие: 5 фрагментов.',
    loseMessage:
      'Он бессмертен. Ты — нет. Пошли, пока игла не в хвосте.',
    trophyDescription:
      'Золотая игла в хрустальном яйце — не ломай, даже из любопытства.',
    miniTale:
      'Сказ об игле, яйце и коте, который не жадничал. Я не хватался за сундуки — спросил: «Где спрятана твоя смерть, если не секрет?» Кощей усмехнулся и дал яйцо с иглой как урок: сила — не в куче золота, а в том, что спрятано с умом. В былинах смерть Кощея — в игле, игла — в яйце, яйцо — далеко. Хитрость бьёт силу.',
    hasTrophy: true,
    reward: {
      kind: 'luck_cap_and_title',
      titleId: 'razgadchik_smerti',
      amount: 20,
    },
    lockedHint: '5 осколков. Смерть прячет — ты ищи.',
  },
  {
    id: 'chudo_yudo',
    name: 'Чудо-Юдо',
    grade: 'epoch',
    chapter: 'epoch',
    unlock: { kind: 'fragments', targetId: 'chudo_yudo', fragmentCount: 6 },
    locationId: 'voda',
    bookDescription:
      'Многоголовое чудище вод, древний страж. Испытывает силу, выдержку и ум. Кто явит уважение и понимание — может пройти. Финал пути для тех, кто собрал книгу почти до конца.',
    bookRewardDescription:
      'Титул «Славянский Герой» (в профиле). Условие: 6 фрагментов (финал).',
    loseMessage:
      'Чудо, что нас чудом не проглотило.',
    trophyDescription:
      'Фигурка Чудо-Юдо — все головы смотрят в разные стороны, как надо.',
    miniTale:
      'Сказ о многих головах и одной правильной фразе. Каждая голова спрашивала своё. Я не кричал и не дрался — отвечал по делу и низко кланялся воде. Чудо-Юдо расступилось. Фигурка — на полку, титул — в сердце. В сказах многоголовые чудища стерегут край мира: пройти их — значит дозреть до героя.',
    hasTrophy: true,
    reward: { kind: 'title_only', titleId: 'slavyanskiy_geroy' },
    lockedHint: '6 осколков. Финал. Чудо-Юдо ждёт героя.',
  },
];

export function getSpiritById(id: SpiritId): SpiritDefinition | undefined {
  return spirits.find((s) => s.id === id);
}

export function getChapterLabel(chapter: SpiritChapter): string {
  const labels: Record<SpiritChapter, string> = {
    dom: 'Дом',
    dvor: 'Двор',
    les: 'Лес',
    epoch: 'Эпоха чудес',
  };
  return labels[chapter];
}
