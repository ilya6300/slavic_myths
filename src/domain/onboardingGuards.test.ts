import { describe, expect, it } from 'vitest';
import {
  canInteract,
  isTutorialHighlight,
  shouldBlockPan,
  shouldUseNovelDialog,
} from './onboardingGuards';

describe('onboardingGuards', () => {
  it('step 0 allows only cat', () => {
    expect(canInteract(0, false, 'cat')).toBe(true);
    expect(canInteract(0, false, 'book')).toBe(false);
    expect(canInteract(0, false, 'pan')).toBe(false);
  });

  it('step 1 allows cat and book', () => {
    expect(canInteract(1, false, 'cat')).toBe(true);
    expect(canInteract(1, false, 'book')).toBe(true);
    expect(canInteract(1, false, 'chest')).toBe(false);
  });

  it('highlights book on step 1', () => {
    expect(isTutorialHighlight(1, false, 'book')).toBe(true);
    expect(isTutorialHighlight(0, false, 'book')).toBe(false);
  });

  it('uses novel dialog on steps 0-1', () => {
    expect(shouldUseNovelDialog(0, false)).toBe(true);
    expect(shouldUseNovelDialog(1, false)).toBe(true);
    expect(shouldUseNovelDialog(2, false)).toBe(false);
  });

  it('blocks pan on steps 0-1', () => {
    expect(shouldBlockPan(0, false)).toBe(true);
    expect(shouldBlockPan(1, false)).toBe(true);
    expect(shouldBlockPan(2, false)).toBe(false);
  });

  it('unlocks all when completed', () => {
    expect(canInteract(0, true, 'book')).toBe(true);
    expect(shouldBlockPan(0, true)).toBe(false);
  });
});
