import { makeAutoObservable } from 'mobx';
import type { SpiritId } from '../config/assetRegistry';
import { SPIRIT_ORDER } from '../data/spirits';
import { findSpiritIndex } from '../domain/spiritQueue';

export type BookPhase =
  | 'idle'
  | 'flying'
  | 'crossfading'
  | 'content'
  | 'closing';

export type BookCoverVariant = 'closed' | 'open';

const OPEN_CROSSFADE_MS = 1000;
const OPEN_CONTENT_MS = 1250;
const CLOSE_TOTAL_MS = 500;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export type BookSpreadMode = 'spirit' | 'folktale';

export class BookUiStore {
  isOpen = false;
  pageIndex = 0;
  spreadMode: BookSpreadMode = 'spirit';
  folktalePageIndex = 0;
  /** Ежедневка: сказ в книге → вопрос викторины. */
  dailyQuestFlow = false;
  dailyQuestUseVictoryTale = false;
  isFlipping = false;
  phase: BookPhase = 'idle';
  flightFrom: DOMRect | null = null;
  showPageContent = false;
  coverVariant: BookCoverVariant = 'closed';

  private timers: number[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get isOverlayActive(): boolean {
    return this.phase !== 'idle';
  }

  get isInteractionBlocked(): boolean {
    return this.phase !== 'content';
  }

  /** Книга уже открыта — только перейти в сказ ежедневки. */
  enterDailyQuestTaleInPlace(spiritId: SpiritId): void {
    this.dailyQuestFlow = true;
    this.dailyQuestUseVictoryTale = true;
    this.jumpToSpirit(spiritId);
    this.enterDailyQuestFolktale();
  }

  startDailyQuestTale(spiritId: SpiritId, fromRect?: DOMRect | null): void {
    this.dailyQuestFlow = true;
    this.dailyQuestUseVictoryTale = true;
    this.startOpen(spiritId, fromRect);
    if (this.phase === 'content') {
      this.enterDailyQuestFolktale();
    }
  }

  private enterDailyQuestFolktaleAfterOpen(): void {
    if (this.dailyQuestFlow && this.phase === 'content') {
      this.enterDailyQuestFolktale();
    }
  }

  clearDailyQuestFlow(): void {
    this.dailyQuestFlow = false;
    this.dailyQuestUseVictoryTale = false;
  }

  startOpen(spiritId?: SpiritId, fromRect?: DOMRect | null): void {
    this.clearTimers();
    this.spreadMode = 'spirit';
    this.folktalePageIndex = 0;
    if (spiritId) {
      const idx = findSpiritIndex(spiritId);
      if (idx >= 0) this.pageIndex = idx;
    }

    this.isOpen = true;
    this.flightFrom = fromRect ?? null;
    this.showPageContent = false;
    this.coverVariant = 'closed';

    if (prefersReducedMotion() || !fromRect) {
      this.phase = 'content';
      this.coverVariant = 'open';
      this.showPageContent = true;
      this.enterDailyQuestFolktaleAfterOpen();
      return;
    }

    this.phase = 'flying';

    this.timers.push(
      window.setTimeout(() => {
        if (this.phase === 'flying') {
          this.phase = 'crossfading';
          this.coverVariant = 'open';
        }
      }, OPEN_CROSSFADE_MS),
    );

    this.timers.push(
      window.setTimeout(() => {
        if (this.phase === 'flying' || this.phase === 'crossfading') {
          this.phase = 'content';
          this.showPageContent = true;
          this.enterDailyQuestFolktaleAfterOpen();
        }
      }, OPEN_CONTENT_MS),
    );
  }

  /** @deprecated Use startOpen from scene; kept for tests and instant open without rect. */
  open(spiritId?: SpiritId): void {
    this.startOpen(spiritId, null);
  }

  close(): void {
    if (this.phase !== 'content') return;
    this.clearTimers();
    this.showPageContent = false;

    if (prefersReducedMotion()) {
      this.resetToIdle();
      return;
    }

    this.phase = 'closing';
    this.timers.push(
      window.setTimeout(() => {
        this.resetToIdle();
      }, CLOSE_TOTAL_MS),
    );
  }

  reset(): void {
    this.clearTimers();
    this.resetToIdle();
  }

  setPageIndex(index: number): void {
    const max = SPIRIT_ORDER.length - 1;
    this.pageIndex = Math.max(0, Math.min(max, index));
  }

  goPrev(): void {
    if (this.spreadMode === 'folktale') {
      this.folktalePageIndex = Math.max(0, this.folktalePageIndex - 1);
      return;
    }
    this.setPageIndex(this.pageIndex - 1);
  }

  goNext(): void {
    if (this.spreadMode === 'folktale') {
      this.folktalePageIndex += 1;
      return;
    }
    this.setPageIndex(this.pageIndex + 1);
  }

  enterDailyQuestFolktale(): void {
    if (this.phase !== 'content') return;
    this.spreadMode = 'folktale';
    this.folktalePageIndex = 0;
  }

  enterFolktaleMode(): void {
    if (this.phase !== 'content') return;
    this.spreadMode = 'folktale';
    this.folktalePageIndex = 0;
  }

  exitFolktaleMode(): void {
    this.spreadMode = 'spirit';
    this.folktalePageIndex = 0;
    if (this.dailyQuestFlow) {
      this.clearDailyQuestFlow();
    }
  }

  jumpToSpirit(spiritId: SpiritId): void {
    const idx = findSpiritIndex(spiritId);
    if (idx >= 0) this.pageIndex = idx;
  }

  startFlip(): void {
    this.isFlipping = true;
  }

  endFlip(): void {
    this.isFlipping = false;
  }

  private resetToIdle(): void {
    this.phase = 'idle';
    this.isOpen = false;
    this.flightFrom = null;
    this.showPageContent = false;
    this.coverVariant = 'closed';
    this.isFlipping = false;
    this.spreadMode = 'spirit';
    this.folktalePageIndex = 0;
    this.clearDailyQuestFlow();
  }

  private clearTimers(): void {
    for (const id of this.timers) {
      window.clearTimeout(id);
    }
    this.timers = [];
  }
}

export const bookUiStore = new BookUiStore();
