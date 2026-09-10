import { afterEach, describe, expect, it, vi } from 'vitest';
import { adsService } from './adsService';
import { adsUiStore } from '../store/adsUiStore';

describe('adsService stub', () => {
  afterEach(() => {
    adsUiStore.isWaitVisible = false;
    vi.useRealTimers();
  });

  it('should not call onRewarded synchronously in dev stub', () => {
    const onRewarded = vi.fn();
    adsService.showRewarded(onRewarded);
    expect(onRewarded).not.toHaveBeenCalled();
    expect(adsUiStore.isWaitVisible).toBe(true);
  });
});
