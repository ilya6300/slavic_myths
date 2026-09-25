/**
 * Народные сказки для режима книги (plan §5).
 * Источники: instruction/folktales/{spirit_id}.md
 */

import type { SpiritId } from '../config/assetRegistry';
import type { Locale, LocalizedText } from '../i18n/types';
import { resolveText } from '../i18n/resolve';
import { getSpiritById } from './spirits';

export interface FolktaleEntry {
  spiritId: SpiritId;
  pages: LocalizedText[];
}

const folktaleEntries: FolktaleEntry[] = [
  {
    spiritId: 'brownie',
    pages: [
      {
        ru: 'В избе у печки жил Домовой — хозяин горницы. Кто кормил и не кричал, тот спал спокойно. Кто ломал посуду, тот слышал ночью шорох у полати.',
        en: 'In the hut by the stove lived Domovoy — master of the room. Whoever fed him and did not shout slept peacefully. Whoever broke the dishes heard a rustle by the sleeping bench at night.',
        tr: 'Kulübede ocağın yanında Domovoy yaşardı — odanın efendisi. Besleyen ve bağırmayan rahat uyurdu. Tabak kıran geceleri ranza yanında hışırtı duyardı.',
      },
      {
        ru: 'Хозяйка поставила молоко в блюдце и шепнула: «На здоровье, дедушка». Утром в избе было тепло, а каша в печи не пригорела.',
        en: 'The mistress set milk in a saucer and whispered: «To your health, grandfather». In the morning the hut was warm, and the porridge in the stove had not burned.',
        tr: 'Ev hanımı tabağa süt koydu ve fısıldadı: «Şerefe, dede». Sabah kulübe sıcaktı, ocaktaki lapası yanmamıştı.',
      },
      {
        ru: 'С тех пор перед сном говорили: «Спи, хозяин». Домовой кивал из угла — и дом держался крепко, как добрый сруб.',
        en: 'From then on, before sleep, they said: «Sleep, master». Domovoy nodded from the corner — and the house stood firm, like a good timber frame.',
        tr: 'O günden beri uyumadan önce «Uyu, efendi» derlerdi. Domovoy köşeden başını sallardı — ev sağlam bir kütük yığma gibi dimdik dururdu.',
      },
    ],
  },
  {
    spiritId: 'susedko',
    pages: [
      {
        ru: 'Под половицами жил Суседко — мохнатый барабашка. Ночью стучал «тыгыдык», таскал пуговицы и шуршал пакетами. Сундук он утащил не из злости — из озорства.',
        en: 'Under the floorboards lived Susedko — a shaggy barabashka. At night he tapped «tygydyk», carried off buttons, and rustled bags. He took the chest not from malice, but from mischief.',
        tr: 'Döşemelerin altında Susedko yaşardı — tüylü bir barabashka. Geceleri «tıgıdık» diye tıkırdar, düğme taşır, torbaları hışırdatırdı. Sandığı kızgınlıktan değil, yaramazlıktan almıştı.',
      },
      {
        ru: 'Хозяин не стал колотить по полу: оставил на краю лавки кусок хлеба и тихо сказал: «На, сосед, поешь». Стук стих, а к утру сундук стоял на месте.',
        en: 'The owner did not hammer the floor: he left a piece of bread on the edge of the bench and said quietly: «Here, neighbor, eat». The tapping stopped, and by morning the chest stood in its place.',
        tr: 'Ev sahibi yere vurmadı: lavanın kenarına bir parça ekmek bıraktı ve usulca dedi: «Al, komşu, ye». Tıkırtı kesildi, sabaha sandık yerinde duruyordu.',
      },
      {
        ru: 'В народе знают: Суседко любит уважение без крика. Кто кормит и не гонит — тот сундук не потеряет, а ночь пройдёт с весёлым стуком, не со страхом.',
        en: 'Folk know: Susedko likes respect without shouting. Whoever feeds him and does not chase him will not lose the chest, and the night passes with a merry tap, not with fear.',
        tr: 'Halk bilir: Susedko bağırmadan saygı sever. Besleyen ve kovalamayan sandığını kaybetmez; gece korkuyla değil, neşeli tıkırtıyla geçer.',
      },
    ],
  },
  {
    spiritId: 'bannik',
    pages: [
      {
        ru: 'В бане жил Банник — дух пара и веников. Кто входил с грязными ногами, получал щепоть угля. Кто уважал — тёплый пар и здоровье.',
        en: 'In the bathhouse lived Bannik — spirit of steam and besoms. Whoever entered with dirty feet got a pinch of coal. Whoever showed respect got warm steam and health.',
        tr: 'Hamamda Bannik yaşardı — buharın ve süpürgenin ruhu. Kirli ayakla giren bir tutam kömür alırdı. Saygı gösteren sıcak buhar ve sağlık bulurdu.',
      },
      {
        ru: 'Однажды хозяин забыл вынести воду. Банник шепнул: «Оставь ковш — я сам». Утром вода была чистая, а на полке — веник, пахнущий мёдом.',
        en: 'Once the owner forgot to carry the water out. Bannik whispered: «Leave the dipper — I will see to it myself». In the morning the water was clean, and on the shelf lay a besom that smelled of honey.',
        tr: 'Bir gün ev sahibi suyu dışarı çıkarmayı unuttu. Bannik fısıldadı: «Kepçeyi bırak — ben kendim bakarım». Sabah su temizdi, rafta bal kokan bir süpürge duruyordu.',
      },
      {
        ru: 'С тех пор перед паром говорили: «С добрым паром, дедушка». Банник кивал усами — и никто в избе не болел зимой.',
        en: 'From then on, before the steam, they said: «Good steam to you, grandfather». Bannik nodded his whiskers — and no one in the hut fell ill in winter.',
        tr: 'O günden beri buhardan önce «İyi buharlar, dede» derlerdi. Bannik bıyıklarını sallardı — kulübede kışın kimse hastalanmazdı.',
      },
    ],
  },
  {
    spiritId: 'leshiy',
    pages: [
      {
        ru: 'В лесу жил Леший — хранитель троп и звериных тропок. Кто шёл с песней, тот не заблудился. Кто кричал и ломал ветки — кружил до рассвета.',
        en: 'In the forest lived Leshy — keeper of paths and animal trails. Whoever walked with a song did not get lost. Whoever shouted and broke branches wandered in circles until dawn.',
        tr: 'Ormanda Leshy yaşardı — patikaların ve hayvan izlerinin bekçisi. Şarkıyla yürüyen kaybolmazdı. Bağıran ve dal kıran şafağa kadar daireler çizerdi.',
      },
      {
        ru: 'Однажды мальчик заблудился. Леший вышел из ельника: «Тише. Следи за моей тенью». Тень вела к избе, а на опушке мальчик оставил кусок хлеба.',
        en: 'Once a boy got lost. Leshy stepped out of the spruce wood: «Quiet. Follow my shadow». The shadow led to the hut, and at the forest edge the boy left a piece of bread.',
        tr: 'Bir çocuk kayboldu. Leshy ladinliğin içinden çıktı: «Sessiz ol. Gölgemi izle». Gölge kulübeye götürdü, orman kenarında çocuk bir parça ekmek bıraktı.',
      },
      {
        ru: 'Леший взял хлеб, кивнул и спрятался в ветки. С тех пор в лесу говорили: «Леший, не путай». И тропы открывались самы.',
        en: 'Leshy took the bread, nodded, and hid in the branches. From then on in the forest they said: «Leshy, do not tangle the way». And the paths opened by themselves.',
        tr: 'Leshy ekmeği aldı, başını salladı ve dalların arasına saklandı. O günden beri ormanda «Leshy, yolu karıştırma» derlerdi. Patikalar kendiliğinden açılırdı.',
      },
    ],
  },
];

const folktaleBySpirit = new Map(
  folktaleEntries.map((entry) => [entry.spiritId, entry]),
);

export function hasFolktale(spiritId: string): boolean {
  return folktaleBySpirit.has(spiritId as SpiritId);
}

export function getFolktalePages(spiritId: string, locale: Locale): string[] {
  const entry = folktaleBySpirit.get(spiritId as SpiritId);
  if (!entry) return [];
  return entry.pages.map((page) => resolveText(page, locale));
}

export function getFolktalePageCount(spiritId: string): number {
  const entry = folktaleBySpirit.get(spiritId as SpiritId);
  return entry?.pages.length ?? 0;
}

/** Страницы сказа для ежедневки: народная сказка или мини-сказ о победе. */
export function getDailyQuestTalePages(
  spiritId: string,
  locale: Locale,
): string[] {
  if (hasFolktale(spiritId)) {
    return getFolktalePages(spiritId, locale);
  }
  const spirit = getSpiritById(spiritId as SpiritId);
  const mini = spirit?.miniTale?.ru.trim();
  return spirit && mini ? [resolveText(spirit.miniTale, locale)] : [];
}

export function getDailyQuestTalePageCount(spiritId: string): number {
  if (hasFolktale(spiritId)) {
    return getFolktalePageCount(spiritId);
  }
  const spirit = getSpiritById(spiritId as SpiritId);
  return spirit?.miniTale?.ru.trim() ? 1 : 0;
}
