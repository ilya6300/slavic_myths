/** @vitest-environment jsdom */
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { bookUiStore } from '../../store/bookUiStore';

describe('book page flip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    bookUiStore.reset();
    bookUiStore.phase = 'content';
    bookUiStore.pageIndex = 1;
    bookUiStore.spreadMode = 'spirit';
  });

  afterEach(() => {
    bookUiStore.reset();
    vi.useRealTimers();
  });

  it('should advance page during flip for mid-animation swap', () => {
    bookUiStore.startFlip();
    bookUiStore.goNext();
    expect(bookUiStore.pageIndex).toBe(2);
    bookUiStore.endFlip();
  });

  it('should advance page when flip is not active', () => {
    bookUiStore.goNext();
    expect(bookUiStore.pageIndex).toBe(2);
  });
});
