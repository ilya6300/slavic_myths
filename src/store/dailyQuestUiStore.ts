import { makeAutoObservable } from 'mobx';
import type { SpiritId } from '../config/assetRegistry';
import { getQuizBySpiritId, shuffleQuizQuestions } from '../data/quiz';
import type { ShuffledQuestion } from '../data/quiz';
import { pickDailyQuizQuestionIndex } from '../domain/dailyQuest';

class DailyQuestUiStore {
  isOpen = false;
  spiritId: SpiritId | null = null;
  question: ShuffledQuestion | null = null;
  private questionSourceIndex: number | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  openTale(spiritId: SpiritId, rng: () => number = Math.random): void {
    const quiz = getQuizBySpiritId(spiritId);
    if (!quiz?.questions.length) return;
    this.spiritId = spiritId;
    this.isOpen = true;
    this.loadQuestion(null, rng);
  }

  close(): void {
    this.isOpen = false;
    this.spiritId = null;
    this.question = null;
    this.questionSourceIndex = null;
  }

  loadQuestion(excludeIndex: number | null, rng: () => number = Math.random): void {
    if (!this.spiritId) return;
    const quiz = getQuizBySpiritId(this.spiritId);
    if (!quiz?.questions.length) return;
    const sourceIndex = pickDailyQuizQuestionIndex(
      quiz.questions.length,
      excludeIndex,
      rng,
    );
    this.questionSourceIndex = sourceIndex;
    const shuffled = shuffleQuizQuestions(
      [quiz.questions[sourceIndex]!],
      rng,
    );
    this.question = shuffled[0] ?? null;
  }

  get sourceQuestionIndex(): number | null {
    return this.questionSourceIndex;
  }
}

export const dailyQuestUiStore = new DailyQuestUiStore();
