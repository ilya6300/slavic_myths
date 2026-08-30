import { describe, expect, it } from 'vitest';
import { createDefaultSave } from './GameSave';
import {
  canOpenWonderChest,
  getWonderChestWeekId,
  isWonderChestEligible,
  shouldIncrementWonderClickProgress,
  syncWonderChestWeekState,
} from './wonderChest';

describe('wonderChest', () => {
  it('should use Monday 00:00 as week id', () => {
    const wed = new Date(2026, 7, 26, 12, 0, 0);
    expect(getWonderChestWeekId(wed)).toBe('2026-08-24');
  });

  it('should reset free slot on new week but keep click progress', () => {
    const sync = syncWonderChestWeekState('2026-08-17', true);
    expect(sync.isNewWeek).toBe(true);
    expect(sync.wonderChestWeekSlotUsed).toBe(false);
  });

  it('should require susedko and rare+ defeated for eligibility', () => {
    const statuses = createDefaultSave().spiritStatuses;
    expect(isWonderChestEligible(statuses)).toBe(false);

    statuses.susedko = 'defeated';
    expect(isWonderChestEligible(statuses)).toBe(false);

    statuses.leshiy = 'defeated';
    expect(isWonderChestEligible(statuses)).toBe(true);
  });

  it('should allow free open when week slot unused', () => {
    expect(canOpenWonderChest(false, 0)).toBe(true);
    expect(canOpenWonderChest(true, 999)).toBe(false);
    expect(canOpenWonderChest(true, 1000)).toBe(true);
  });

  it('should increment click progress only after free slot spent', () => {
    expect(shouldIncrementWonderClickProgress(true, false, 0)).toBe(false);
    expect(shouldIncrementWonderClickProgress(true, true, 500)).toBe(true);
    expect(shouldIncrementWonderClickProgress(true, true, 1000)).toBe(false);
  });
});
