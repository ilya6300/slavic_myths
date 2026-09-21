/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { BookUiStore } from './bookUiStore';

function mockRect(
  x = 0,
  y = 0,
  width = 50,
  height = 50,
): DOMRect {
  return {
    x,
    y,
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    toJSON: () => ({}),
  } as DOMRect;
}

describe('BookUiStore', () => {
  let store: BookUiStore;
  let matchMediaMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    store = new BookUiStore();
    matchMediaMock = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    vi.stubGlobal('matchMedia', matchMediaMock);
  });

  afterEach(() => {
    store.reset();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('should start in idle with overlay inactive', () => {
    expect(store.phase).toBe('idle');
    expect(store.isOverlayActive).toBe(false);
    expect(store.isInteractionBlocked).toBe(true);
  });

  it('should transition flying → crossfading → content on startOpen', () => {
    const rect = mockRect(100, 200, 80, 100);
    store.startOpen('brownie', rect);

    expect(store.phase).toBe('flying');
    expect(store.isOpen).toBe(true);
    expect(store.isOverlayActive).toBe(true);
    expect(store.showPageContent).toBe(false);
    expect(store.flightFrom?.left).toBe(100);
    expect(store.flightFrom?.top).toBe(200);
    expect(store.flightFrom?.width).toBe(80);

    vi.advanceTimersByTime(1000);
    expect(store.phase).toBe('crossfading');
    expect(store.coverVariant).toBe('open');

    vi.advanceTimersByTime(250);
    expect(store.phase).toBe('content');
    expect(store.showPageContent).toBe(true);
    expect(store.isInteractionBlocked).toBe(false);
  });

  it('should skip animation when prefers-reduced-motion', () => {
    matchMediaMock.mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });

    store.startOpen('brownie', mockRect());

    expect(store.phase).toBe('content');
    expect(store.showPageContent).toBe(true);
    expect(store.coverVariant).toBe('open');
  });

  it('should skip animation when startOpen has no rect', () => {
    store.startOpen('brownie', null);
    expect(store.phase).toBe('content');
    expect(store.showPageContent).toBe(true);
  });

  it('should close only from content phase', () => {
    store.startOpen('brownie', mockRect());
    vi.advanceTimersByTime(1250);

    store.close();
    expect(store.phase).toBe('closing');
    expect(store.showPageContent).toBe(false);

    vi.advanceTimersByTime(500);
    expect(store.phase).toBe('idle');
    expect(store.isOpen).toBe(false);
    expect(store.isOverlayActive).toBe(false);
  });

  it('should ignore close during flying', () => {
    store.startOpen('brownie', mockRect());
    store.close();
    expect(store.phase).toBe('flying');
  });

  it('should reset timers on close and reset', () => {
    store.startOpen('brownie', mockRect());
    store.reset();
    expect(store.phase).toBe('idle');
    vi.advanceTimersByTime(2000);
    expect(store.phase).toBe('idle');
  });

  it('should set page index from spirit id on startOpen', () => {
    store.startOpen('bannik', mockRect());
    expect(store.pageIndex).toBeGreaterThan(0);
  });

  it('should open folktale spread for daily quest without react effect', () => {
    store.startDailyQuestTale('brownie', null);
    expect(store.dailyQuestFlow).toBe(true);
    expect(store.spreadMode).toBe('folktale');
    expect(store.folktalePageIndex).toBe(0);
  });

  it('should enter daily folktale after animated open completes', () => {
    store.startDailyQuestTale('brownie', mockRect());
    expect(store.spreadMode).toBe('spirit');
    vi.advanceTimersByTime(1250);
    expect(store.spreadMode).toBe('folktale');
  });
});
