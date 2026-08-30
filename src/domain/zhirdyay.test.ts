import { describe, expect, it } from 'vitest';
import {
  isZhirdyayDefeated,
  rollZhirdyayClicksRequired,
  shouldSpawnZhirdyay,
} from './zhirdyay';

describe('zhirdyay', () => {
  it('should roll clicks between 8 and 12', () => {
    for (let i = 0; i < 20; i++) {
      const n = rollZhirdyayClicksRequired(() => 0.5);
      expect(n).toBeGreaterThanOrEqual(8);
      expect(n).toBeLessThanOrEqual(12);
    }
  });

  it('should detect defeat at required clicks', () => {
    expect(isZhirdyayDefeated(8, 8)).toBe(true);
    expect(isZhirdyayDefeated(7, 8)).toBe(false);
  });

  it('should not spawn when already seen tonight', () => {
    expect(
      shouldSpawnZhirdyay({
        isNight: true,
        activeRoom: 1,
        zhirdyaySeenThisNight: true,
        onboardingCompleted: true,
        zhirdyayActive: false,
        rusalkaZhirdyayReductionPercent: 0,
        rng: () => 0,
      }),
    ).toBe(false);
  });
});
