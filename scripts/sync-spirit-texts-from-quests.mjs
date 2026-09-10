/**
 * Синхронизирует loseMessage, miniTale (spirits.ts) и questHook, loseLine RU (spiritCatDialogContent.ts)
 * из instruction/quests.md после promote/generate.
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

function parseSpiritSections(text) {
  const sections = text.split(/\n---\n/);
  const quests = [];
  for (const section of sections) {
    const header = section.match(/^## (.+?) — \d+ вопрос/m);
    if (!header) continue;
    const rawName = header[1].trim();
    const spiritId = SPIRIT_ID[rawName];
    if (!spiritId) continue;
    const catHook = section.match(/\*\*Крючок кота:\*\* «(.+?)»/s)?.[1] ?? '';
    const loseMessage = section.match(/\*\*Проигрыш:\*\* «(.+?)»/s)?.[1] ?? '';
    const miniTale =
      section.match(/\*\*Мини-сказ:\*\* (.+?)(?=\n\n|$)/s)?.[1]?.trim() ?? '';
    quests.push({ spiritId, catHook, loseMessage, miniTale });
  }
  return quests;
}

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

const md = readFileSync(join(root, 'instruction/quests.md'), 'utf8').replace(/\r\n/g, '\n');
const quests = parseSpiritSections(md);

let spiritsTs = readFileSync(join(root, 'src/data/spirits.ts'), 'utf8');
let dialogTs = readFileSync(join(root, 'src/data/spiritCatDialogContent.ts'), 'utf8');

for (const q of quests) {
  const id = q.spiritId;
  spiritsTs = spiritsTs.replace(
    new RegExp(`(id: '${id}'[\\s\\S]*?loseMessage:\\s*\\n\\s*)'[^']*'`),
    `$1'${esc(q.loseMessage)}'`,
  );
  spiritsTs = spiritsTs.replace(
    new RegExp(`(id: '${id}'[\\s\\S]*?miniTale:\\s*\\n\\s*)'[^']*'`),
    `$1'${esc(q.miniTale)}'`,
  );
  dialogTs = dialogTs.replace(
    new RegExp(`(${id}:\\s*\\{[\\s\\S]*?questHook:\\s*L\\(\\s*\\n\\s*)'[^']*'`),
    `$1'${esc(q.catHook)}'`,
  );
  dialogTs = dialogTs.replace(
    new RegExp(`(${id}:\\s*\\{[\\s\\S]*?loseLine:\\s*L\\(\\s*\\n\\s*)'[^']*'`),
    `$1'${esc(q.loseMessage)}'`,
  );
}

writeFileSync(join(root, 'src/data/spirits.ts'), spiritsTs, 'utf8');
writeFileSync(join(root, 'src/data/spiritCatDialogContent.ts'), dialogTs, 'utf8');
console.log(`Synced ${quests.length} spirits from quests.md`);
