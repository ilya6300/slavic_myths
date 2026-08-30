import { describe, expect, it } from 'vitest';
import { isNightTime } from './nightTime';

describe('isNightTime', () => {
  it('returns true between 20:00 and 06:00', () => {
    expect(isNightTime(new Date('2026-08-28T21:00:00'))).toBe(true);
    expect(isNightTime(new Date('2026-08-28T03:00:00'))).toBe(true);
  });

  it('returns false during day hours', () => {
    expect(isNightTime(new Date('2026-08-28T12:00:00'))).toBe(false);
    expect(isNightTime(new Date('2026-08-28T08:00:00'))).toBe(false);
  });
});
