import { getCalendarDayId } from './calendarDay';

export function isDailyFindAvailable(
  onboardingCompleted: boolean,
  claimedDayId: string | null,
  now: Date = new Date(),
): boolean {
  if (!onboardingCompleted) return false;
  return claimedDayId !== getCalendarDayId(now);
}
