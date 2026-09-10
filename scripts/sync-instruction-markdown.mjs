/**
 * Синхронизирует cat_dialogs.md (§3–4) и list_of_spirits.md (проигрыш, мини-сказ, русалка)
 * из instruction/quests.md.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const SPIRIT_ID = {
  Домовой: 'brownie',
  'Суседко (Барабашка)': 'susedko',
  Суседко: 'susedko',
  Банник: 'bannik',
  Кикимора: 'kikimora',
  Полевой: 'poludnik',
  Овинник: 'ovinnik',
  Леший: 'leshiy',
  Водяной: 'vodyanoy',
  'Дедушка Топтыгин': 'dedushka_toptygin',
  Топтыгин: 'dedushka_toptygin',
  Полудница: 'poludnica',
  Русалка: 'rusalka',
  Лада: 'lada',
  Велес: 'veles',
  'Баба-Яга': 'baba_yaga',
  'Кощей Бессмертный': 'koschei_immortal',
  Кощей: 'koschei_immortal',
  'Чудо-Юдо': 'chudo_yudo',
};

const CAT_DIALOG_NAME = {
  brownie: 'Домовой',
  susedko: 'Суседко',
  bannik: 'Банник',
  kikimora: 'Кикимора',
  poludnik: 'Полевой',
  ovinnik: 'Овинник',
  leshiy: 'Леший',
  vodyanoy: 'Водяной',
  dedushka_toptygin: 'Топтыгин',
  poludnica: 'Полудница',
  rusalka: 'Русалка',
  lada: 'Лада',
  veles: 'Велес',
  baba_yaga: 'Баба-Яга',
  koschei_immortal: 'Кощей',
  chudo_yudo: 'Чудо-Юдо',
};

const LIST_NAME = {
  brownie: 'Домовой',
  susedko: 'Суседко (Барабашка)',
  bannik: 'Банник',
  kikimora: 'Кикимора',
  poludnik: 'Полевой',
  ovinnik: 'Овинник',
  leshiy: 'Леший',
  vodyanoy: 'Водяной',
  dedushka_toptygin: 'Дедушка Топтыгин',
  poludnica: 'Полудница',
  rusalka: 'Русалка',
  lada: 'Лада',
  veles: 'Велес',
  baba_yaga: 'Баба-Яга',
  koschei_immortal: 'Кощей Бессмертный',
  chudo_yudo: 'Чудо-Юдо',
};

function parseSpiritSections(text) {
  const sections = text.split(/\n---\n/);
  const byId = {};
  for (const section of sections) {
    const header = section.match(/^## (.+?) — \d+ вопрос/m);
    if (!header) continue;
    const spiritId = SPIRIT_ID[header[1].trim()];
    if (!spiritId) continue;
    byId[spiritId] = {
      catHook: section.match(/\*\*Крючок кота:\*\* «(.+?)»/s)?.[1] ?? '',
      loseMessage: section.match(/\*\*Проигрыш:\*\* «(.+?)»/s)?.[1] ?? '',
      miniTale:
        section.match(/\*\*Мини-сказ:\*\* (.+?)(?=\n\n|$)/s)?.[1]?.trim() ?? '',
    };
  }
  return byId;
}

const md = readFileSync(join(root, 'instruction/quests.md'), 'utf8').replace(/\r\n/g, '\n');
const data = parseSpiritSections(md);

function patchTableSection(text, sectionTitle, nameToValue) {
  const start = text.indexOf(sectionTitle);
  if (start === -1) throw new Error(`Missing section: ${sectionTitle}`);
  const end = text.indexOf('\n---\n', start + sectionTitle.length);
  const head = text.slice(0, start);
  const body = text.slice(start, end === -1 ? undefined : end);
  const tail = end === -1 ? '' : text.slice(end);
  let patched = body;
  for (const [name, value] of Object.entries(nameToValue)) {
    patched = patched.replace(
      new RegExp(`(\\| ${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\| )[^|]+(\\|)`),
      `$1${value}$2`,
    );
  }
  return head + patched + tail;
}

let catDialogs = readFileSync(join(root, 'instruction/cat_dialogs.md'), 'utf8');
const hooks = {};
const loses = {};
for (const [id, name] of Object.entries(CAT_DIALOG_NAME)) {
  const d = data[id];
  if (!d) continue;
  hooks[name] = d.catHook;
  loses[name] = d.loseMessage;
}
catDialogs = patchTableSection(catDialogs, '## 3. Крючки квестов', hooks);
catDialogs = patchTableSection(catDialogs, '## 4. Проигрыш (голос кота)', loses);
writeFileSync(join(root, 'instruction/cat_dialogs.md'), catDialogs, 'utf8');

let list = readFileSync(join(root, 'instruction/list_of_spirits.md'), 'utf8');
for (const [id, name] of Object.entries(LIST_NAME)) {
  const d = data[id];
  if (!d) continue;
  const blockRe = new RegExp(
    `(Имя: "${name.replace(/[()]/g, '\\$&')}"[\\s\\S]*?Сообщение проигрыша: )"[^"]*"`,
  );
  list = list.replace(blockRe, `$1"${d.loseMessage}"`);
  const taleRe = new RegExp(
    `(Имя: "${name.replace(/[()]/g, '\\$&')}"[\\s\\S]*?Мини-сказ: )"[^"]*"`,
  );
  list = list.replace(taleRe, `$1"${d.miniTale}"`);
}

list = list.replace(
  /Описание в книге: "Дух реки и озёрной глади[^"]*"/,
  'Описание в книге: "Дух речных берегов и прибрежных рощ. В белой рубахе и венке, на ветвях берёзы — не «рыбья сказка». Уважай берег и не лезь в омут без нужды."',
);
list = list.replace(/Титул «Кот у берега»/g, 'Титул «Кот на берегу»');
list = list.replace(
  /Описание для трофея: "Серебряный гребень с водорослями[^"]*"/,
  'Описание для трофея: "Гребень из речного перламутра — не расчёсывай им чужие сны."',
);

writeFileSync(join(root, 'instruction/list_of_spirits.md'), list, 'utf8');
console.log('Synced cat_dialogs.md and list_of_spirits.md');
