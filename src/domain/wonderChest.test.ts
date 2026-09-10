import { describe, expect, it } from 'vitest';
import { createDefaultSave } from './GameSave';
import {
  canOpenWonderChest,
  getWonderChestWeekId,
  isWonderChestEligible,
  shouldIncrementWonderClickProgress,
  shouldShowWonderChestProgress,
  syncWonderChestWeekState,
  wonderChestFillRatio,
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
    expect(canOpenWonderChest(true, 699)).toBe(false);
    expect(canOpenWonderChest(true, 700)).toBe(true);
  });

  it('should increment click progress only after free slot spent', () => {
    expect(shouldIncrementWonderClickProgress(true, false, 0)).toBe(false);
    expect(shouldIncrementWonderClickProgress(true, true, 699)).toBe(true);
    expect(shouldIncrementWonderClickProgress(true, true, 700)).toBe(false);
  });

  // TASK-038 / tech.md Epic 14: floor bar visibility + fill ratio
  it('should hide progress when week slot is free and clicks are 0', () => {
    expect(shouldShowWonderChestProgress(false, 0, 700)).toBe(false);
  });

  it('should hide progress when week slot is free despite leftover clicks', () => {
    expect(shouldShowWonderChestProgress(false, 700, 700)).toBe(false);
  });

  it('should show progress when week slot is used and clicks are 0', () => {
    expect(shouldShowWonderChestProgress(true, 0, 700)).toBe(true);
  });

  it('should show progress when week slot is used while grinding', () => {
    expect(shouldShowWonderChestProgress(true, 350, 700)).toBe(true);
  });

  it('should show progress when week slot is used and clicks reach required', () => {
    expect(shouldShowWonderChestProgress(true, 700, 700)).toBe(true);
  });

  it('should return 0 fill when clicks are 0', () => {
    expect(wonderChestFillRatio(0, 700)).toBe(0);
  });

  it('should return half fill when clicks are half of required', () => {
    expect(wonderChestFillRatio(350, 700)).toBe(0.5);
  });

  it('should return full fill when clicks equal required', () => {
    expect(wonderChestFillRatio(700, 700)).toBe(1);
  });

  it('should clamp fill to 1 when clicks exceed required', () => {
    expect(wonderChestFillRatio(800, 700)).toBe(1);
  });

  it('should return 0 fill when required is 0', () => {
    expect(wonderChestFillRatio(100, 0)).toBe(0);
  });
});
