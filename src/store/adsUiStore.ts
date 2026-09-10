import { makeAutoObservable } from 'mobx';

export const REWARDED_STUB_DURATION_SEC = 10;
export const REWARDED_STUB_CANCEL_WINDOW_SEC = 3;

export type RewardedLoreContext = 'smetana' | 'chest';

export class AdsUiStore {
  isWaitVisible = false;
  elapsedSec = 0;
  loreContext: RewardedLoreContext = 'smetana';

  private onRewarded: (() => void) | null = null;
  private onClose: (() => void) | null = null;
  private timerId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get canCancel(): boolean {
    return this.elapsedSec < REWARDED_STUB_CANCEL_WINDOW_SEC;
  }

  get remainingSec(): number {
    return Math.max(0, REWARDED_STUB_DURATION_SEC - this.elapsedSec);
  }

  get progress(): number {
    return Math.min(1, this.elapsedSec / REWARDED_STUB_DURATION_SEC);
  }

  startWait(
    onRewarded: () => void,
    onClose?: () => void,
    loreContext: RewardedLoreContext = 'smetana',
  ): void {
    this.clearTimer();
    this.onRewarded = onRewarded;
    this.onClose = onClose ?? null;
    this.loreContext = loreContext;
    this.elapsedSec = 0;
    this.isWaitVisible = true;
    this.timerId = setInterval(() => {
      this.elapsedSec += 1;
      if (this.elapsedSec >= REWARDED_STUB_DURATION_SEC) {
        this.finish(true);
      }
    }, 1000);
  }

  cancel(): void {
    if (!this.canCancel) return;
    this.finish(false);
  }

  private finish(rewarded: boolean): void {
    this.clearTimer();
    this.isWaitVisible = false;
    const rewardedCb = this.onRewarded;
    const closeCb = this.onClose;
    this.onRewarded = null;
    this.onClose = null;
    if (rewarded) rewardedCb?.();
    else closeCb?.();
  }

  private clearTimer(): void {
    if (this.timerId != null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}

export const adsUiStore = new AdsUiStore();
