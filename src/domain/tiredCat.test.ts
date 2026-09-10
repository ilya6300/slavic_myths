import { describe, expect, it } from 'vitest';
import {
  shouldOpenEnergyModalAfterTiredClick,
  TIRED_CLICKS_BEFORE_MODAL,
} from './tiredCat';

describe('tiredCat', () => {
  it('should not open modal before threshold', () => {
    for (let i = 1; i <= TIRED_CLICKS_BEFORE_MODAL; i++) {
      expect(shouldOpenEnergyModalAfterTiredClick(i)).toBe(false);
    }
  });

  it('should open modal after threshold', () => {
    expect(shouldOpenEnergyModalAfterTiredClick(TIRED_CLICKS_BEFORE_MODAL + 1)).toBe(
      true,
    );
  });
});
