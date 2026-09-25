import type { LocalizedText } from '../i18n/types';
import part0 from '../../scripts/_quiz-i18n-0.json';
import part1 from '../../scripts/_quiz-i18n-1.json';
import part2 from '../../scripts/_quiz-i18n-2.json';

type Pair = { en: string; tr: string };

const quizI18n: Record<string, Pair> = {
  ...(part0 as Record<string, Pair>),
  ...(part1 as Record<string, Pair>),
  ...(part2 as Record<string, Pair>),
};

/** Русская строка викторины → en/tr. Генератор quiz.ts эти переводы не трогает. */
export function localizeQuizLine(ru: string): LocalizedText {
  const hit = quizI18n[ru];
  if (!hit?.en || !hit?.tr || hit.en === ru || hit.tr === ru) {
    throw new Error(`quiz translation missing: ${ru.slice(0, 80)}`);
  }
  return { ru, en: hit.en, tr: hit.tr };
}
