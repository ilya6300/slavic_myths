/**
 * Promote quiz_rewrite_v2.md → instruction/quests.md
 * Сохраняет preamble (регламент + сводная таблица), вставляет 16 секций духов из v2.
 * Запуск: node scripts/promote-quiz-v2-to-quests.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const v2Path = join(root, 'instruction/plans/quiz_rewrite_v2.md');
const questsPath = join(root, 'instruction/quests.md');

const v2 = readFileSync(v2Path, 'utf8').replace(/\r\n/g, '\n');
const quests = readFileSync(questsPath, 'utf8').replace(/\r\n/g, '\n');

const today = new Date().toISOString().slice(0, 10);

/** Preamble: от начала до второго `---` после сводной таблицы (регламент + таблица). */
function extractPreamble(text) {
  const marker = '\n## Домовой —';
  const idx = text.indexOf(marker);
  if (idx === -1) throw new Error('Cannot find first spirit section in quests.md');
  let preamble = text.slice(0, idx).trimEnd();
  preamble = preamble.replace(
    /> \*\*Редакция:\*\* .+/,
    `> **Редакция:** ${today} (принято из \`instruction/plans/quiz_rewrite_v2.md\`).`,
  );
  if (!preamble.includes('quiz_rewrite_v2')) {
    preamble = preamble.replace(
      /> \*\*Редакция:\*\* .+/,
      `> **Редакция:** ${today} (принято из \`instruction/plans/quiz_rewrite_v2.md\`).`,
    );
  }
  return preamble;
}

function cleanSpiritSection(section) {
  let s = section.trim();
  s = s.replace(/\n> \*\*Чеклист сценариста:\*\*[^\n]*/g, '');
  const cutAt = s.search(/\n### Сводка вопросов/);
  if (cutAt !== -1) s = s.slice(0, cutAt).trimEnd();
  const yamlAt = s.search(/\n```yaml\nscenarist_done:/);
  if (yamlAt !== -1) s = s.slice(0, yamlAt).trimEnd();
  return s.replace(/«Кот у берега»/g, '«Кот на берегу»');
}

function extractSpiritSections(text) {
  const sections = text.split(/\n---\n/);
  const spirits = [];
  for (const section of sections) {
    if (!/^## .+ — \d+ вопрос/m.test(section)) continue;
    const header = section.match(/^## (.+?) — \d+ вопрос/m)?.[1]?.trim();
    if (!header || header.startsWith('Сводка')) continue;
    spirits.push(cleanSpiritSection(section));
  }
  return spirits;
}

const preamble = extractPreamble(quests);
const spiritSections = extractSpiritSections(v2);

if (spiritSections.length !== 16) {
  console.error(`Expected 16 spirit sections from v2, got ${spiritSections.length}`);
  process.exit(1);
}

const out = `${preamble}\n\n${spiritSections.join('\n\n---\n\n')}\n`;
writeFileSync(questsPath, out, 'utf8');
console.log(`Promoted ${spiritSections.length} spirit sections to instruction/quests.md`);
