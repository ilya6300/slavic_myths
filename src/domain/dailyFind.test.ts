import { describe, expect, it } from 'vitest';
import { getCalendarDayId } from './calendarDay';
import { isDailyFindAvailable } from './dailyFind';

describe('dailyFind', () => {
  it('should be available after onboarding when not claimed today', () => {
    expect(isDailyFindAvailable(true, null)).toBe(true);
  });

  it('should be hidden during onboarding', () => {
    expect(isDailyFindAvailable(false, null)).toBe(false);
  });

  it('should be hidden when already claimed today', () => {
    const now = new Date('2026-09-01T12:00:00');
    const today = getCalendarDayId(now);
    expect(isDailyFindAvailable(true, today, now)).toBe(false);
  });
});
