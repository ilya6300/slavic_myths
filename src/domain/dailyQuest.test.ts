import { describe, expect, it } from 'vitest';

import { createDefaultSpiritStatuses } from './GameSave';
import {
  canClaimDailyFragmentReward,
  shouldClearStaleDailyQuestRewardClaim,
  isDailyQuestTaleSpiritEligible,
  isDailyQuestUnlocked,
  listDailyQuestTaleSpiritCandidates,
  pickDailyTaleSpiritId,
  shouldShowDailyQuestPanel,
  syncDailyQuestForCalendarDay,
} from './dailyQuest';

describe('dailyQuest', () => {
  it('should unlock daily quest only after bannik defeated', () => {
    const statuses = createDefaultSpiritStatuses();
    expect(isDailyQuestUnlocked(statuses)).toBe(false);
    statuses.bannik = 'defeated';
    expect(isDailyQuestUnlocked(statuses)).toBe(true);
  });

  it('should hide panel when fragment chain is complete', () => {
    const statuses = { ...createDefaultSpiritStatuses(), bannik: 'defeated', perun: 'defeated' };
    const counts = {
      baba_yaga: 3,
      lada: 3,
      veles: 6,
      koschei_immortal: 5,
      chudo_yudo: 8,
      yarilo: 8,
      perun: 10,
    };
    expect(shouldShowDailyQuestPanel(statuses, counts)).toBe(false);
  });

  it('should not repeat tale spirit on consecutive days when two defeated', () => {
    const defeated = ['brownie', 'susedko'] as const;
    const first = pickDailyTaleSpiritId([...defeated], null, () => 0);
    const second = pickDailyTaleSpiritId([...defeated], first, () => 0);
    expect(second).not.toBe(first);
  });

  it('should only pick defeated spirits with tale and quiz', () => {
    const statuses = {
      ...createDefaultSpiritStatuses(),
      bannik: 'defeated',
      brownie: 'defeated',
      kikimora: 'locked',
    };
    const candidates = listDailyQuestTaleSpiritCandidates(statuses);
    expect(candidates).toContain('brownie');
    expect(candidates).toContain('bannik');
    expect(candidates).not.toContain('kikimora');
    expect(isDailyQuestTaleSpiritEligible('kikimora')).toBe(true);
  });

  it('should replace invalid tale spirit on same calendar day', () => {
    const statuses = {
      ...createDefaultSpiritStatuses(),
      bannik: 'defeated',
      brownie: 'defeated',
    };
    const day = syncDailyQuestForCalendarDay(
      {
        dayId: '2026-09-20',
        taleSpiritId: 'kikimora',
        clickProgress: 10,
        taleQuizCorrect: false,
        rewardClaimed: false,
      },
      statuses,
      new Date('2026-09-20T12:00:00'),
      () => 0,
    );
    expect(day.taleSpiritId).not.toBe('kikimora');
    expect(day.clickProgress).toBe(10);
  });

  it('should reset progress on new calendar day', () => {
    const statuses = { ...createDefaultSpiritStatuses(), bannik: 'defeated', brownie: 'defeated' };
    const day1 = syncDailyQuestForCalendarDay(
      null,
      statuses,
      new Date('2026-09-20T12:00:00'),
      () => 0,
    );
    const busy = { ...day1, clickProgress: 50, taleQuizCorrect: true };
    const day2 = syncDailyQuestForCalendarDay(
      busy,
      statuses,
      new Date('2026-09-21T12:00:00'),
      () => 0,
    );
    expect(day2.dayId).toBe('2026-09-21');
    expect(day2.clickProgress).toBe(0);
    expect(day2.taleQuizCorrect).toBe(false);
    expect(day2.rewardClaimed).toBe(false);
  });

  it('should allow fragment claim when both tasks done and not claimed', () => {
    const state = {
      dayId: '2026-09-20',
      taleSpiritId: 'brownie' as const,
      clickProgress: 100,
      taleQuizCorrect: true,
      rewardClaimed: false,
    };
    expect(canClaimDailyFragmentReward(state)).toBe(true);
  });

  it('should clear stale reward claim when day tasks are incomplete', () => {
    expect(
      shouldClearStaleDailyQuestRewardClaim(
        '2026-09-20',
        '2026-09-20',
        0,
        false,
      ),
    ).toBe(true);
    expect(
      shouldClearStaleDailyQuestRewardClaim(
        '2026-09-20',
        '2026-09-20',
        100,
        true,
      ),
    ).toBe(false);
  });
});
