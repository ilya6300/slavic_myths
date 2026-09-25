import { describe, expect, it } from 'vitest';

import * as dailyQuest from './dailyQuest';

function callFn(mod: object, name: string, ...args: unknown[]): unknown {
  const fn = (mod as Record<string, unknown>)[name];
  if (typeof fn !== 'function') {
    throw new Error(`missing behavior: ${name}`);
  }
  return (fn as (...a: unknown[]) => unknown)(...args);
}

describe('daily quest rewarded reset (TASK-060)', () => {
  const today = new Date('2026-09-20T18:00:00');
  const tomorrow = new Date('2026-09-21T08:00:00');

  it('should allow one rewarded reset when today reward is granted and the reset is unused', () => {
    expect(
      callFn(
        dailyQuest,
        'canResetDailyQuestWithRewarded',
        true,
        '2026-09-20',
        null,
        today,
      ),
    ).toBe(true);
  });

  it('should refuse a rewarded reset before today reward is granted', () => {
    expect(
      callFn(dailyQuest, 'canResetDailyQuestWithRewarded', true, null, null, today),
    ).toBe(false);
    expect(
      callFn(
        dailyQuest,
        'canResetDailyQuestWithRewarded',
        true,
        '2026-09-19',
        null,
        today,
      ),
    ).toBe(false);
  });

  it('should refuse a rewarded reset before Bannik is defeated', () => {
    expect(
      callFn(
        dailyQuest,
        'canResetDailyQuestWithRewarded',
        false,
        '2026-09-20',
        null,
        today,
      ),
    ).toBe(false);
  });

  it('should refuse a second rewarded reset on the same calendar day', () => {
    expect(
      callFn(
        dailyQuest,
        'canResetDailyQuestWithRewarded',
        true,
        '2026-09-20',
        '2026-09-20',
        today,
      ),
    ).toBe(false);
  });

  it('should clear today progress and keep the tale spirit when the rewarded reset runs', () => {
    const next = callFn(
      dailyQuest,
      'resetDailyQuestAfterRewarded',
      {
        dayId: '2026-09-20',
        taleSpiritId: 'bannik',
        clickProgress: 100,
        taleQuizCorrect: true,
        fragmentGrantedDayId: '2026-09-20',
        rewardClaimedDayId: '2026-09-20',
        rewardedResetDayId: null,
      },
      today,
    ) as Record<string, unknown>;

    expect(next.dayId).toBe('2026-09-20');
    expect(next.taleSpiritId).toBe('bannik');
    expect(next.clickProgress).toBe(0);
    expect(next.taleQuizCorrect).toBe(false);
    expect(next.fragmentGrantedDayId).toBeNull();
    expect(next.rewardClaimedDayId).toBeNull();
    expect(next.rewardedResetDayId).toBe('2026-09-20');
  });

  it('should clear the rewarded reset flag when the calendar day changes', () => {
    expect(
      callFn(
        dailyQuest,
        'syncDailyQuestRewardedResetDayId',
        '2026-09-20',
        '2026-09-20',
        tomorrow,
      ),
    ).toBeNull();
  });

  it('should keep the rewarded reset flag when the calendar day stays the same', () => {
    expect(
      callFn(
        dailyQuest,
        'syncDailyQuestRewardedResetDayId',
        '2026-09-20',
        '2026-09-20',
        today,
      ),
    ).toBe('2026-09-20');
  });
});
