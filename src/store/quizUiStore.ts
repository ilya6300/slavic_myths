import { makeAutoObservable } from 'mobx';
import type { SpiritId } from '../config/assetRegistry';
import type { LocalizedText } from '../i18n/types';
import type { ShuffledQuestion } from '../data/quiz';

export type QuizPhase =
  | 'question'
  | 'correct'
  | 'wrong'
  | 'victory'
  | 'defeat';

export class QuizUiStore {
  activeSpiritId: SpiritId | null = null;
  questions: ShuffledQuestion[] = [];
  questionIndex = 0;
  phase: QuizPhase = 'question';
  pendingAnswerIndex: number | null = null;
  loseMessage: LocalizedText | null = null;
  oberegShieldFlash = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isActive(): boolean {
    return this.activeSpiritId != null;
  }

  get currentQuestion(): ShuffledQuestion | null {
    return this.questions[this.questionIndex] ?? null;
  }

  get totalQuestions(): number {
    return this.questions.length;
  }

  open(
    spiritId: SpiritId,
    questions: ShuffledQuestion[],
  ): void {
    this.activeSpiritId = spiritId;
    this.questions = questions;
    this.questionIndex = 0;
    this.phase = 'question';
    this.pendingAnswerIndex = null;
    this.loseMessage = null;
    this.oberegShieldFlash = false;
  }

  setOberegShieldFlash(active: boolean): void {
    this.oberegShieldFlash = active;
  }

  setPhase(phase: QuizPhase): void {
    this.phase = phase;
  }

  setPendingAnswer(index: number): void {
    this.pendingAnswerIndex = index;
  }

  advanceQuestion(): void {
    this.questionIndex += 1;
    this.phase = 'question';
    this.pendingAnswerIndex = null;
  }

  showVictory(): void {
    this.phase = 'victory';
    this.pendingAnswerIndex = null;
  }

  showDefeat(message: LocalizedText): void {
    this.phase = 'defeat';
    this.loseMessage = message;
    this.pendingAnswerIndex = null;
  }

  close(): void {
    this.activeSpiritId = null;
    this.questions = [];
    this.questionIndex = 0;
    this.phase = 'question';
    this.pendingAnswerIndex = null;
    this.loseMessage = null;
    this.oberegShieldFlash = false;
  }
}

export const quizUiStore = new QuizUiStore();
