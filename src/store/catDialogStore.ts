import { makeAutoObservable } from 'mobx';
import type { CatDialogLine } from '../data/catDialogs';
import { getOnboardingLine } from '../data/catDialogs';
import type { Locale } from '../i18n/types';
import { shouldUseNovelDialog } from '../domain/onboardingGuards';

export class CatDialogStore {
  lines: CatDialogLine[] = [];
  lineIndex = 0;
  visible = false;

  constructor() {
    makeAutoObservable(this);
  }

  get currentLine(): CatDialogLine | null {
    return this.lines[this.lineIndex] ?? null;
  }

  get hasNext(): boolean {
    return this.lineIndex < this.lines.length - 1;
  }

  show(lines: CatDialogLine[]): void {
    if (lines.length === 0) return;
    this.lines = lines;
    this.lineIndex = 0;
    this.visible = true;
  }

  showOnboardingStep(step: number, locale: Locale): void {
    const text = getOnboardingLine(step, locale);
    if (!text) return;

    const novel = shouldUseNovelDialog(step, false);
    this.show([
      {
        text,
        mode: novel ? 'novel' : 'footnote',
        blocking: novel && step === 1,
      },
    ]);
  }

  nextOrDismiss(): boolean {
    if (this.hasNext) {
      this.lineIndex += 1;
      return true;
    }
    this.dismiss();
    return false;
  }

  dismiss(): void {
    this.visible = false;
    this.lines = [];
    this.lineIndex = 0;
  }
}

export const catDialogStore = new CatDialogStore();
