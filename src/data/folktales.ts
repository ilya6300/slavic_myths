/**
 * Народные сказки для режима книги (plan §5).
 * Источники: instruction/folktales/{spirit_id}.md
 */

import type { SpiritId } from '../config/assetRegistry';
import type { Locale, LocalizedText } from '../i18n/types';
import { resolveText } from '../i18n/resolve';

export interface FolktaleEntry {
  spiritId: SpiritId;
  pages: LocalizedText[];
}

const folktaleEntries: FolktaleEntry[] = [
  {
    spiritId: 'bannik',
    pages: [
      {
        ru: 'В бане жил Банник — дух пара и веников. Кто входил с грязными ногами, получал щепоть угля. Кто уважал — тёплый пар и здоровье.',
        en: 'In the bathhouse lived Bannik — spirit of steam and birch twigs. Dirty feet got a pinch of coal. Respect earned warm steam and health.',
        tr: 'Hamamda Bannik yaşardı — buhar ve fırça ruhu. Kirli ayaklar kömür alırdı. Saygı sıcak buhar ve sağlık getirirdi.',
      },
      {
        ru: 'Однажды хозяин забыл вынести воду. Банник шепнул: «Оставь ковш — я сам». Утром вода была чистая, а на полке — веник, пахнущий мёдом.',
        en: 'Once the owner forgot to carry out the water. Bannik whispered: «Leave the bucket — I\'ll handle it». Morning water was clean, and on the shelf — a broom smelling of honey.',
        tr: 'Bir gün ev sahibi suyu çıkarmayı unuttu. Bannik fısıldadı: «Kovayı bırak — ben hallederim». Sabah su temiz, rafta bal kokan bir fırça.',
      },
      {
        ru: 'С тех пор перед паром говорили: «С добрым паром, дедушка». Банник кивал усами — и никто в избе не болел зимой.',
        en: 'Since then, before steam they said: «Good steam, grandpa». Bannik nodded his whiskers — and no one in the hut fell ill in winter.',
        tr: 'O günden beri buhar öncesi: «İyi buharlar, dede» derlerdi. Bannik bıyıklarını sallardı — kulübede kimse kışın hasta olmazdı.',
      },
    ],
  },
  {
    spiritId: 'leshiy',
    pages: [
      {
        ru: 'В лесу жил Леший — хранитель троп и звериных тропок. Кто шёл с песней, тот не заблудился. Кто кричал и ломал ветки — кружил до рассвета.',
        en: 'In the forest lived Leshiy — keeper of paths and animal trails. Who walked singing never got lost. Who shouted and broke branches spun until dawn.',
        tr: 'Ormanda Leshiy yaşardı — patikaların ve izlerin bekçisi. Şarkı söyleyen kaybolmazdı. Bağıran ve dal kıran şafağa kadar dönerdi.',
      },
      {
        ru: 'Однажды мальчик заблудился. Леший вышел из ельника: «Тише. Следи за моей тенью». Тень вела к избе, а на опушке мальчик оставил кусок хлеба.',
        en: 'Once a boy got lost. Leshiy stepped from the spruce: «Quiet. Follow my shadow». The shadow led to the hut; at the edge the boy left a piece of bread.',
        tr: 'Bir çocuk kayboldu. Leshiy ladinden çıktı: «Sessiz. Gölgemi izle». Gölge kulübeye götürdü; orman kenarında çocuk bir parça ekmek bıraktı.',
      },
      {
        ru: 'Леший взял хлеб, кивнул и спрятался в ветки. С тех пор в лесу говорили: «Леший, не путай». И тропы открывались самы.',
        en: 'Leshiy took the bread, nodded, and hid in the branches. Since then in the forest they said: «Leshiy, don\'t confuse». And paths opened on their own.',
        tr: 'Leshiy ekmeği aldı, başını salladı, dallara saklandı. O günden beri ormanda «Leshiy, şaşırtma» derlerdi. Patikalar kendiliğinden açılırdı.',
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
