import { makeAutoObservable } from 'mobx';
import type { SpiritId } from '../config/assetRegistry';
import {
  divinationSpiritGreetings,
  divinationThresholdLines,
  divinationMirrorPromptLines,
  divinationUi,
} from '../data/divinationContent';
import { divinationQuestionPrompts } from '../data/divinationQuestions';
import { pickDivinationAnswerLine } from '../data/divinationAnswers';
import type { DivinationQuestionIndex } from '../data/divinationTruth';
import type { Locale } from '../i18n/types';
import { pickLocalizedLine, resolveText } from '../i18n/resolve';
import {
  buildDivinationNamePool,
  pickDivinationSpiritId,
  listDefeatedForDivination,
} from '../domain/divinationSession';
import type { SpiritStatus } from '../domain/GameSave';
import { spiritPortraitPaths } from '../config/assetRegistry';
import { getSpiritById } from '../data/spirits';

export type DivinationPhase =
  | 'idle'
  | 'threshold'
  | 'smoke'
  | 'line'
  | 'pickQuestion'
  | 'pickGuess'
  | 'reveal'
  | 'result';

const SMOKE_MS = 1200;

class DivinationUiStore {
  phase: DivinationPhase = 'idle';
  sessionSpiritId: SpiritId | null = null;
  lineText = '';
  portraitUrl: string | null = null;
  askedQuestions: DivinationQuestionIndex[] = [];
  namePool: SpiritId[] = [];
  guessedCorrect = false;
  crumbsAwarded = 0;
  private smokeTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingAfterSmoke: (() => void) | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  openThreshold(): void {
    this.resetSession();
    this.phase = 'threshold';
  }

  closeAll(): void {
    this.clearSmokeTimer();
    this.resetSession();
    this.phase = 'idle';
  }

  private resetSession(): void {
    this.sessionSpiritId = null;
    this.lineText = '';
    this.portraitUrl = null;
    this.askedQuestions = [];
    this.namePool = [];
    this.guessedCorrect = false;
    this.crumbsAwarded = 0;
    this.pendingAfterSmoke = null;
  }

  private clearSmokeTimer(): void {
    if (this.smokeTimer) clearTimeout(this.smokeTimer);
    this.smokeTimer = null;
  }

  private enterSmoke(then: () => void): void {
    this.clearSmokeTimer();
    this.phase = 'smoke';
    this.lineText = '';
    this.portraitUrl = null;
    this.smokeTimer = setTimeout(() => {
      this.smokeTimer = null;
      then();
    }, SMOKE_MS);
  }

  beginSessionAfterCandle(
    statuses: Record<string, SpiritStatus>,
    locale: Locale,
    rng: () => number = Math.random,
  ): boolean {
    const defeated = listDefeatedForDivination(statuses);
    const spiritId = pickDivinationSpiritId(defeated, rng);
    if (!spiritId) return false;
    this.sessionSpiritId = spiritId;
    this.enterSmoke(() => {
      this.lineText =
        pickLocalizedLine(divinationSpiritGreetings, locale, rng) ?? '';
      this.phase = 'line';
      this.pendingAfterSmoke = () => {
        this.enterSmoke(() => {
          this.lineText =
            pickLocalizedLine(divinationMirrorPromptLines, locale, rng) ?? '';
          this.phase = 'line';
          this.pendingAfterSmoke = () => {
            this.phase = 'pickQuestion';
            this.pendingAfterSmoke = null;
          };
        });
      };
    });
    return true;
  }

  continueLine(): void {
    if (this.phase !== 'line' && this.phase !== 'reveal') return;
    const next = this.pendingAfterSmoke;
    this.pendingAfterSmoke = null;
    next?.();
  }

  pickQuestion(
    index: DivinationQuestionIndex,
    locale: Locale,
    statuses: Record<string, SpiritStatus>,
    rng: () => number = Math.random,
  ): void {
    if (this.phase !== 'pickQuestion' || !this.sessionSpiritId) return;
    if (this.askedQuestions.includes(index)) return;
    this.askedQuestions = [...this.askedQuestions, index];
    const spiritId = this.sessionSpiritId;
    this.enterSmoke(() => {
      const answer = pickDivinationAnswerLine(spiritId, index, rng);
      this.lineText = resolveText(answer, locale);
      this.phase = 'line';
      this.pendingAfterSmoke = () => {
        if (this.askedQuestions.length >= 2) {
          const defeated = listDefeatedForDivination(statuses);
          this.namePool = buildDivinationNamePool(
            spiritId,
            defeated,
            rng,
          );
          this.phase = 'pickGuess';
        } else {
          this.phase = 'pickQuestion';
        }
        this.pendingAfterSmoke = null;
      };
    });
  }

  submitGuess(
    guessId: SpiritId,
    locale: Locale,
    awardCrumbs: (correct: boolean) => number,
  ): void {
    if (this.phase !== 'pickGuess' || !this.sessionSpiritId) return;
    this.guessedCorrect = guessId === this.sessionSpiritId;
    this.crumbsAwarded = awardCrumbs(this.guessedCorrect);
    const portrait =
      spiritPortraitPaths[this.sessionSpiritId] ??
      spiritPortraitPaths.brownie;
    this.enterSmoke(() => {
      this.portraitUrl = portrait;
      this.lineText = resolveText(
        getSpiritById(this.sessionSpiritId!)?.name ?? { ru: '', en: '', tr: '' },
        locale,
      );
      this.phase = 'reveal';
      this.pendingAfterSmoke = () => {
        this.lineText = resolveText(
          this.guessedCorrect
            ? divinationUi.resultCorrect
            : divinationUi.resultWrong,
          locale,
        );
        this.phase = 'result';
        this.pendingAfterSmoke = null;
      };
    });
  }

  finishResult(): void {
    if (this.phase !== 'result') return;
    this.closeAll();
  }

  thresholdLine(locale: Locale, rng: () => number = Math.random): string {
    return pickLocalizedLine(divinationThresholdLines, locale, rng) ?? '';
  }

  availableQuestions(): DivinationQuestionIndex[] {
    return [0, 1, 2, 3, 4, 5, 6, 7].filter(
      (i) => !this.askedQuestions.includes(i as DivinationQuestionIndex),
    ) as DivinationQuestionIndex[];
  }

  questionPrompt(index: DivinationQuestionIndex, locale: Locale): string {
    return resolveText(divinationQuestionPrompts[index], locale);
  }
}

export const divinationUiStore = new DivinationUiStore();
