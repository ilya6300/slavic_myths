import { describe, expect, it } from 'vitest';
import { addRewardEnergy } from './rewardEnergy';

describe('addRewardEnergy', () => {
  it('adds energy without max cap', () => {
    expect(addRewardEnergy(80, 50)).toBe(130);
    expect(addRewardEnergy(100, 50)).toBe(150);
  });
});
