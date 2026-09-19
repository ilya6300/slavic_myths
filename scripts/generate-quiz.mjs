/**
 * Одноразовый генератор src/data/quiz.ts из instruction/quests.md
 * Запуск: node scripts/generate-quiz.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const md = readFileSync(join(root, 'instruction/quests.md'), 'utf8').replace(/\r\n/g, '\n');

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
  Ярило: 'yarilo',
  Перун: 'perun',
};

function parseSpiritSections(text) {
  const sections = text.split(/\n---\n/);
  const quests = [];

  for (const section of sections) {
    const header = section.match(/^## (.+?) — \d+ вопрос/m);
    if (!header) continue;

    const rawName = header[1].trim();
    if (rawName === 'Сводка' || rawName === 'Заметки для разработки') continue;

    const spiritId = SPIRIT_ID[rawName];
    if (!spiritId) {
      console.warn('Unknown spirit:', rawName);
      continue;
    }

    const catHook = section.match(/\*\*Крючок кота:\*\* «(.+?)»/s)?.[1] ?? '';
    const loseMessage = section.match(/\*\*Проигрыш:\*\* «(.+?)»/s)?.[1] ?? '';
    const miniTale =
      section.match(/\*\*Мини-сказ:\*\* (.+?)(?=\n\n|$)/s)?.[1]?.trim() ?? '';

    const questions = [];
    const qBlocks = section.split(/\n### Вопрос \d+(?: \[характер духа\])?\n/).slice(1);

    for (const block of qBlocks) {
      const lines = block.trim().split('\n');
      const prompt = lines[0].trim();
      const options = [];
      let correctIndex = 0;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line.startsWith('- ')) continue;
        if (line.startsWith('> ')) continue;
        const isCorrect = line.includes('*(верный)*');
        const text = line
          .replace(/^- /, '')
          .replace(/\s*\*\(верный\)\*/, '')
          .trim();
        if (isCorrect) correctIndex = options.length;
        options.push(text);
      }

      if (options.length > 0) {
        questions.push({ prompt, options, correctIndex });
      }
    }

    quests.push({ spiritId, catHook, loseMessage, miniTale, questions });
  }

  return quests;
}

const quests = parseSpiritSections(md);

if (quests.length !== 18) {
  console.warn(`Expected 18 quizzes, got ${quests.length}`);
}

const out = `/**
 * Викторины — зеркало instruction/quests.md
 * В рантайме correctIndex не экспонируется в UI; shuffle на старте квеста.
 * Сгенерировано: scripts/generate-quiz.mjs
 */

import type { SpiritId } from '../config/assetRegistry';

export type QuizLocationId =
  | 'izba'
  | 'banya'
  | 'les'
  | 'pole'
  | 'voda'
  | 'temnyy_les';

export interface QuizQuestion {
  prompt: string;
  options: string[];
  /** Индекс верного ответа до shuffle */
  correctIndex: number;
}

export interface SpiritQuiz {
  spiritId: SpiritId;
  locationId: QuizLocationId;
  catHook: string;
  loseMessage: string;
  miniTale: string;
  questions: QuizQuestion[];
}

/** Маппинг дух → локация фона (quests.md сводка + list_of_spirits) */
export const quizLocationBySpirit: Record<SpiritId, QuizLocationId> = {
  brownie: 'izba',
  susedko: 'izba',
  bannik: 'banya',
  kikimora: 'izba',
  poludnik: 'pole',
  ovinnik: 'pole',
  leshiy: 'les',
  vodyanoy: 'voda',
  dedushka_toptygin: 'les',
  poludnica: 'pole',
  rusalka: 'voda',
  lada: 'les',
  veles: 'les',
  baba_yaga: 'temnyy_les',
  koschei_immortal: 'temnyy_les',
  chudo_yudo: 'voda',
  yarilo: 'pole',
  perun: 'les',
};

const rawQuests: Omit<SpiritQuiz, 'locationId'>[] = ${JSON.stringify(quests, null, 2)};

export const spiritQuizzes: SpiritQuiz[] = rawQuests.map((q) => ({
  ...q,
  locationId: quizLocationBySpirit[q.spiritId],
}));

export function getQuizBySpiritId(spiritId: SpiritId): SpiritQuiz | undefined {
  return spiritQuizzes.find((q) => q.spiritId === spiritId);
}

/** Fisher–Yates shuffle (копия массива) */
export function shuffleArray<T>(items: T[], rng: () => number = Math.random): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export interface ShuffledQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
}

/** Перемешать вопросы и ответы; вернуть новый correctIndex */
export function shuffleQuizQuestions(
  questions: QuizQuestion[],
  rng: () => number = Math.random,
): ShuffledQuestion[] {
  const shuffledQs = shuffleArray(questions, rng);
  return shuffledQs.map((q) => {
    const indexed = q.options.map((text, i) => ({ text, i }));
    const shuffledOpts = shuffleArray(indexed, rng);
    return {
      prompt: q.prompt,
      options: shuffledOpts.map((o) => o.text),
      correctIndex: shuffledOpts.findIndex((o) => o.i === q.correctIndex),
    };
  });
}
`;

writeFileSync(join(root, 'src/data/quiz.ts'), out, 'utf8');
const totalQ = quests.reduce((s, q) => s + q.questions.length, 0);
console.log(`Generated ${quests.length} quizzes, ${totalQ} questions`);
if (quests.length !== 18) {
  console.error(`Expected 18 quizzes, got ${quests.length}`);
  process.exit(1);
}
if (totalQ < 140 || totalQ > 145) {
  console.error(`Expected 140–145 questions, got ${totalQ}`);
  process.exit(1);
}
