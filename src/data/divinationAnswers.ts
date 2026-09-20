import type { SpiritId } from '../config/assetRegistry';
import type { LocalizedText } from '../i18n/types';
import type { DivinationQuestionIndex } from './divinationTruth';
import generated from './divinationAnswers.generated.json';

const L = (ru: string): LocalizedText => ({ ru, en: ru, tr: ru });

type Pair = [string, string];

const pairsBySpirit = generated as unknown as Record<string, Pair[]>;

function toLocalizedPair(pair: Pair): [LocalizedText, LocalizedText] {
  return [L(pair[0]), L(pair[1])];
}

export function getDivinationAnswerPair(
  spiritId: SpiritId,
  questionIndex: DivinationQuestionIndex,
): [LocalizedText, LocalizedText] {
  const pairs = pairsBySpirit[spiritId];
  if (!pairs?.[questionIndex]) {
    throw new Error(`divination answers missing: ${spiritId} q${questionIndex}`);
  }
  return toLocalizedPair(pairs[questionIndex]);
}

export function pickDivinationAnswerLine(
  spiritId: SpiritId,
  questionIndex: DivinationQuestionIndex,
  rng: () => number = Math.random,
): LocalizedText {
  const [a, b] = getDivinationAnswerPair(spiritId, questionIndex);
  return rng() < 0.5 ? a : b;
}
