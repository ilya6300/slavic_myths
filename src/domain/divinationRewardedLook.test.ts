import { describe, expect, it } from 'vitest';

import * as divinationSession from './divinationSession';

function callFn(mod: object, name: string, ...args: unknown[]): unknown {
  const fn = (mod as Record<string, unknown>)[name];
  if (typeof fn !== 'function') {
    throw new Error(`missing behavior: ${name}`);
  }
  return (fn as (...a: unknown[]) => unknown)(...args);
}

describe('divination rewarded look (TASK-058)', () => {
  const today = new Date('2026-09-20T15:00:00');
  const tomorrow = new Date('2026-09-21T00:10:00');

  it('should offer one rewarded look when the mirror is open, candles are 0, and today is unused', () => {
    expect(
      callFn(divinationSession, 'canOfferDivinationRewardedLook', true, 0, null, today),
    ).toBe(true);
  });

  it('should not offer a rewarded look when candles remain', () => {
    expect(
      callFn(divinationSession, 'canOfferDivinationRewardedLook', true, 1, null, today),
    ).toBe(false);
  });

  it('should not offer a second rewarded look on the same calendar day', () => {
    expect(
      callFn(
        divinationSession,
        'canOfferDivinationRewardedLook',
        true,
        0,
        '2026-09-20',
        today,
      ),
    ).toBe(false);
  });

  it('should offer the rewarded look again on the next calendar day', () => {
    expect(
      callFn(
        divinationSession,
        'canOfferDivinationRewardedLook',
        true,
        0,
        '2026-09-20',
        tomorrow,
      ),
    ).toBe(true);
  });

  it('should not offer a rewarded look when the mirror is still closed', () => {
    expect(
      callFn(divinationSession, 'canOfferDivinationRewardedLook', false, 0, null, today),
    ).toBe(false);
  });
});
