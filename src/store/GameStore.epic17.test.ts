import { afterEach, describe, expect, it, vi } from 'vitest';

import { createDefaultSave } from '../domain/GameSave';
import { GameStore } from './GameStore';
import { adsUiStore } from './adsUiStore';
import { divinationUiStore } from './divinationUiStore';

const MIN = 60 * 1000;
const HOUR = 60 * MIN;

function makeStore(partial?: Partial<ReturnType<typeof createDefaultSave>>): GameStore {
  const store = new GameStore();
  store.hydrate({ ...createDefaultSave(), ...partial });
  return store;
}

function callStore(store: GameStore, name: string, ...args: unknown[]): unknown {
  const fn = (store as unknown as Record<string, unknown>)[name];
  if (typeof fn !== 'function') {
    throw new Error(`missing behavior: GameStore.${name}`);
  }
  return (fn as (...a: unknown[]) => unknown).apply(store, args);
}

function field(store: GameStore, name: string): unknown {
  return (store as unknown as Record<string, unknown>)[name];
}

function saved(store: GameStore, name: string): unknown {
  return (store.toSave() as unknown as Record<string, unknown>)[name];
}

function yagaOpen() {
  return {
    ...createDefaultSave().spiritStatuses,
    baba_yaga: 'defeated' as const,
    brownie: 'defeated' as const,
  };
}

function bannikOpen() {
  return {
    ...createDefaultSave().spiritStatuses,
    bannik: 'defeated' as const,
    brownie: 'defeated' as const,
  };
}

describe('GameStore epic 17 rewarded limits', () => {
  afterEach(() => {
    if (adsUiStore.isWaitVisible) {
      vi.useFakeTimers();
      vi.advanceTimersByTime(10_000);
    }
    vi.useRealTimers();
    divinationUiStore.closeAll();
  });

  it('should show the chest skip when the chest was opened, cooldown remains, and charges remain', () => {
    const now = 1_000_000;
    const store = makeStore({
      firstChestOpened: true,
      chestReadyAt: now + 3 * HOUR,
    });
    expect(callStore(store, 'canSkipChestCooldownWithRewarded', now)).toBe(true);
  });

  it('should hide the chest skip when charges are 0', () => {
    const now = 1_000_000;
    const store = makeStore({
      firstChestOpened: true,
      chestReadyAt: now + 3 * HOUR,
    });
    (store as unknown as { chestRewardedCharges: number }).chestRewardedCharges = 0;
    expect(callStore(store, 'canSkipChestCooldownWithRewarded', now)).toBe(false);
  });

  it('should hide the chest skip when the chest is already ready', () => {
    const now = 1_000_000;
    const store = makeStore({
      firstChestOpened: true,
      chestReadyAt: now,
    });
    expect(callStore(store, 'canSkipChestCooldownWithRewarded', now)).toBe(false);
  });

  it('should hide the chest skip before the first open', () => {
    const now = 1_000_000;
    const store = makeStore({ firstChestOpened: false, chestReadyAt: null });
    expect(callStore(store, 'canSkipChestCooldownWithRewarded', now)).toBe(false);
  });

  it('should spend one charge and 90 minutes when the chest rewarded ad succeeds', () => {
    vi.useFakeTimers();
    const now = 1_000_000;
    const readyAt = now + 3 * HOUR;
    const store = makeStore({
      firstChestOpened: true,
      chestReadyAt: readyAt,
      candles: 3,
    });
    store.skipChestCooldownWithRewarded(now);
    vi.advanceTimersByTime(10_000);

    expect(store.chestReadyAt).toBe(readyAt - 90 * MIN);
    expect(field(store, 'chestRewardedCharges')).toBe(3);
    expect(field(store, 'chestRewardedNaturalRefillAt')).toBeNull();
    expect(store.candles).toBe(3);
    expect(saved(store, 'divinationRewardedDayId')).toBeNull();
    expect(saved(store, 'dailyQuestRewardedResetDayId')).toBeNull();
  });

  it('should leave time and charges unchanged when the chest rewarded ad is cancelled', () => {
    vi.useFakeTimers();
    const now = 1_000_000;
    const readyAt = now + 3 * HOUR;
    const store = makeStore({ firstChestOpened: true, chestReadyAt: readyAt });
    store.skipChestCooldownWithRewarded(now);
    vi.advanceTimersByTime(1_000);
    adsUiStore.cancel();

    expect(store.chestReadyAt).toBe(readyAt);
    expect(saved(store, 'chestRewardedCharges')).toBe(4);
  });

  it('should not start a chest ad when charges are already 0', () => {
    vi.useFakeTimers();
    const now = 1_000_000;
    const readyAt = now + 3 * HOUR;
    const store = makeStore({ firstChestOpened: true, chestReadyAt: readyAt });
    (store as unknown as { chestRewardedCharges: number }).chestRewardedCharges = 0;
    store.skipChestCooldownWithRewarded(now);

    expect(adsUiStore.isWaitVisible).toBe(false);
    expect(store.chestReadyAt).toBe(readyAt);
    expect(field(store, 'chestRewardedCharges')).toBe(0);
  });

  it('should clear one full cooldown in two skips and the next one in two more when four charges are spent', () => {
    vi.useFakeTimers();
    const now = 1_000_000;
    const store = makeStore({
      firstChestOpened: true,
      chestReadyAt: now + 3 * HOUR,
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        susedko: 'defeated',
      },
    });

    store.skipChestCooldownWithRewarded(now);
    vi.advanceTimersByTime(10_000);
    store.skipChestCooldownWithRewarded(now);
    vi.advanceTimersByTime(10_000);

    expect(store.isChestReady(now)).toBe(true);
    expect(field(store, 'chestRewardedCharges')).toBe(2);

    expect(store.openChest(() => 0.5, now)).toBe(true);
    store.dismissChestLoot();
    expect(store.chestReadyAt).toBe(now + 3 * HOUR);
    expect(field(store, 'chestRewardedCharges')).toBe(2);

    store.skipChestCooldownWithRewarded(now);
    vi.advanceTimersByTime(10_000);
    store.skipChestCooldownWithRewarded(now);
    vi.advanceTimersByTime(10_000);

    expect(store.isChestReady(now)).toBe(true);
    expect(field(store, 'chestRewardedCharges')).toBe(0);
    expect(field(store, 'chestRewardedNaturalRefillAt')).toBeNull();
  });

  it('should run the next cooldown without a skip when the fourth charge was already spent', () => {
    vi.useFakeTimers();
    const now = 1_000_000;
    const store = makeStore({
      firstChestOpened: true,
      chestReadyAt: now,
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        susedko: 'defeated',
      },
    });
    (store as unknown as { chestRewardedCharges: number }).chestRewardedCharges = 0;
    expect(store.openChest(() => 0.5, now)).toBe(true);
    store.dismissChestLoot();
    const readyAt = store.chestReadyAt;

    store.skipChestCooldownWithRewarded(now);

    expect(adsUiStore.isWaitVisible).toBe(false);
    expect(store.chestReadyAt).toBe(readyAt);
    expect(field(store, 'chestRewardedCharges')).toBe(0);
    expect(field(store, 'chestRewardedNaturalRefillAt')).toBe(readyAt);
  });

  it('should restore 4 charges after the armed 3 hour wait when the chest becomes ready without a skip', () => {
    const openedAt = 1_000_000;
    const store = makeStore({
      firstChestOpened: true,
      chestReadyAt: openedAt,
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        susedko: 'defeated',
      },
    });
    (store as unknown as { chestRewardedCharges: number }).chestRewardedCharges = 0;
    expect(store.openChest(() => 0.5, openedAt)).toBe(true);
    store.dismissChestLoot();

    const later = openedAt + 3 * HOUR;
    expect(callStore(store, 'canSkipChestCooldownWithRewarded', later)).toBe(false);
    expect(field(store, 'chestRewardedCharges')).toBe(4);
    expect(field(store, 'chestRewardedNaturalRefillAt')).toBeNull();
  });

  it('should keep remaining charges when cooldown ends by itself', () => {
    const now = 1_000_000;
    const store = makeStore({
      firstChestOpened: true,
      chestReadyAt: now + HOUR,
    });
    (store as unknown as { chestRewardedCharges: number }).chestRewardedCharges = 2;
    expect(callStore(store, 'canSkipChestCooldownWithRewarded', now + HOUR)).toBe(false);
    expect(field(store, 'chestRewardedCharges')).toBe(2);
  });

  it('should make the chest ready and spend one charge when less than 90 minutes remain', () => {
    vi.useFakeTimers();
    const now = 1_000_000;
    const store = makeStore({
      firstChestOpened: true,
      chestReadyAt: now + 20 * MIN,
    });
    store.skipChestCooldownWithRewarded(now);
    vi.advanceTimersByTime(10_000);

    expect(store.chestReadyAt).toBe(now);
    expect(store.isChestReady(now)).toBe(true);
    expect(field(store, 'chestRewardedCharges')).toBe(3);
  });

  it('should keep chest charges in the save when the game is reloaded', () => {
    vi.useFakeTimers();
    const now = 1_000_000;
    const readyAt = now + 3 * HOUR;
    const store = makeStore({ firstChestOpened: true, chestReadyAt: readyAt });
    store.skipChestCooldownWithRewarded(now);
    vi.advanceTimersByTime(10_000);

    const restored = new GameStore();
    restored.hydrate(store.toSave());
    expect(field(restored, 'chestRewardedCharges')).toBe(3);
    expect(restored.chestReadyAt).toBe(readyAt - 90 * MIN);
  });

  it('should clamp broken chest charges into 0..4 when a save is read', () => {
    const high = makeStore();
    high.hydrate({
      ...createDefaultSave(),
      ...({ chestRewardedCharges: 9 } as object),
    } as ReturnType<typeof createDefaultSave>);
    const low = makeStore();
    low.hydrate({
      ...createDefaultSave(),
      ...({ chestRewardedCharges: -3 } as object),
    } as ReturnType<typeof createDefaultSave>);

    expect(field(high, 'chestRewardedCharges')).toBe(4);
    expect(field(low, 'chestRewardedCharges')).toBe(0);
  });

  it('should not change chest charges when the energy rewarded ad succeeds', () => {
    vi.useFakeTimers();
    const store = makeStore({
      onboardingCompleted: true,
      energy: 0,
      lastEnergyAt: 1_000_000,
    });
    const before = store.energy;
    store.restoreEnergyWithRewarded();
    vi.advanceTimersByTime(10_000);

    expect(store.energy).toBeGreaterThan(before);
    expect(saved(store, 'chestRewardedCharges')).toBe(4);
    expect(saved(store, 'chestRewardedNaturalRefillAt')).toBeNull();
  });

  it('should not change chest charges when the wonder chest opens', () => {
    const store = makeStore({
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        susedko: 'defeated',
        leshiy: 'defeated',
      },
      wonderChestClickProgress: 700,
      wonderChestWeekSlotUsed: false,
    });
    expect(store.openWonderChest(() => 0.5, 1_000_000)).toBe(true);
    expect(saved(store, 'chestRewardedCharges')).toBe(4);
    expect(saved(store, 'chestRewardedNaturalRefillAt')).toBeNull();
  });

  it('should open the mirror threshold without spending the day when candles are 0 and the look is free', () => {
    const store = makeStore({
      onboardingCompleted: true,
      candles: 0,
      spiritStatuses: yagaOpen(),
    });
    store.clickMirror();

    expect(divinationUiStore.phase).toBe('threshold');
    expect(store.candles).toBe(0);
    expect(saved(store, 'divinationRewardedDayId')).toBeNull();
    expect(saved(store, 'chestRewardedCharges')).toBe(4);
  });

  it('should spend a candle and leave the rewarded day unused when candles remain', () => {
    const store = makeStore({
      onboardingCompleted: true,
      candles: 1,
      spiritStatuses: yagaOpen(),
    });
    store.clickMirror();
    store.confirmDivinationAsk();

    expect(store.candles).toBe(0);
    expect(divinationUiStore.phase).toBe('smoke');
    expect(saved(store, 'divinationRewardedDayId')).toBeNull();
  });

  it('should start a session without a candle and write today when the rewarded look succeeds', () => {
    vi.useFakeTimers();
    const now = new Date('2026-09-20T15:00:00');
    const store = makeStore({
      onboardingCompleted: true,
      candles: 0,
      spiritStatuses: yagaOpen(),
    });
    store.clickMirror();
    callStore(store, 'confirmDivinationRewardedLook', now);
    vi.advanceTimersByTime(10_000);

    expect(store.candles).toBe(0);
    expect(saved(store, 'divinationRewardedDayId')).toBe('2026-09-20');
    expect(divinationUiStore.phase).not.toBe('threshold');
    expect(divinationUiStore.phase).not.toBe('idle');
    expect(saved(store, 'chestRewardedCharges')).toBe(4);
  });

  it('should not start a session or write the day when the mirror ad is cancelled', () => {
    vi.useFakeTimers();
    const now = new Date('2026-09-20T15:00:00');
    const store = makeStore({
      onboardingCompleted: true,
      candles: 0,
      spiritStatuses: yagaOpen(),
    });
    store.clickMirror();
    callStore(store, 'confirmDivinationRewardedLook', now);
    vi.advanceTimersByTime(1_000);
    adsUiStore.cancel();

    expect(divinationUiStore.phase).toBe('threshold');
    expect(saved(store, 'divinationRewardedDayId')).toBeNull();
    expect(store.candles).toBe(0);
  });

  it('should not write the rewarded day when the player chooses not now', () => {
    const store = makeStore({
      onboardingCompleted: true,
      candles: 0,
      spiritStatuses: yagaOpen(),
    });
    store.clickMirror();
    store.closeDivination();

    expect(divinationUiStore.phase).toBe('idle');
    expect(saved(store, 'divinationRewardedDayId')).toBeNull();
  });

  it('should not offer a second rewarded look on the same day', () => {
    const now = new Date('2026-09-20T15:00:00');
    vi.useFakeTimers();
    vi.setSystemTime(now);
    const store = makeStore({
      onboardingCompleted: true,
      candles: 0,
      spiritStatuses: yagaOpen(),
    });
    (store as unknown as { divinationRewardedDayId: string }).divinationRewardedDayId =
      '2026-09-20';
    store.clickMirror();

    expect(divinationUiStore.phase).toBe('idle');
    expect(callStore(store, 'confirmDivinationRewardedLook', now)).toBeUndefined();
    expect(adsUiStore.isWaitVisible).toBe(false);
  });

  it('should still allow a candle session on a day when the rewarded look was used', () => {
    const store = makeStore({
      onboardingCompleted: true,
      candles: 1,
      spiritStatuses: yagaOpen(),
    });
    (store as unknown as { divinationRewardedDayId: string }).divinationRewardedDayId =
      '2026-09-20';
    store.clickMirror();
    store.confirmDivinationAsk();

    expect(store.candles).toBe(0);
    expect(divinationUiStore.phase).toBe('smoke');
    expect(saved(store, 'divinationRewardedDayId')).toBe('2026-09-20');
  });

  it('should not start a mirror session before Yaga is defeated', () => {
    const store = makeStore({
      onboardingCompleted: true,
      candles: 0,
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        baba_yaga: 'available',
      },
    });
    store.clickMirror();
    expect(divinationUiStore.phase).toBe('idle');
    expect(adsUiStore.isWaitVisible).toBe(false);
    expect(saved(store, 'divinationRewardedDayId')).toBeNull();
  });

  it('should reset today quest once when the rewarded ad succeeds after the reward', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-20T18:00:00'));
    const now = new Date('2026-09-20T18:00:00');
    const store = makeStore({
      spiritStatuses: bannikOpen(),
      dailyQuestDayId: '2026-09-20',
      dailyQuestTaleSpiritId: 'bannik',
      dailyQuestClickProgress: 100,
      dailyQuestTaleCorrect: true,
    });
    expect(store.claimDailyQuestFragment(now)).toBe(true);
    const fragments = store.fragmentCounts.baba_yaga;

    callStore(store, 'resetDailyQuestWithRewarded', now);
    vi.advanceTimersByTime(10_000);

    expect(store.dailyQuestDayId).toBe('2026-09-20');
    expect(store.dailyQuestTaleSpiritId).toBe('bannik');
    expect(store.dailyQuestClickProgress).toBe(0);
    expect(store.dailyQuestTaleCorrect).toBe(false);
    expect(store.dailyQuestFragmentGrantedDayId).toBeNull();
    expect(store.dailyQuestRewardClaimedDayId).toBeNull();
    expect(field(store, 'dailyQuestRewardedResetDayId')).toBe('2026-09-20');
    expect(store.fragmentCounts.baba_yaga).toBe(fragments);
    expect(saved(store, 'chestRewardedCharges')).toBe(4);
    expect(saved(store, 'divinationRewardedDayId')).toBeNull();
  });

  it('should grant the same fragment drop when the repeated daily quest is claimed', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-20T18:00:00'));
    const now = new Date('2026-09-20T18:00:00');
    const store = makeStore({
      spiritStatuses: bannikOpen(),
      dailyQuestDayId: '2026-09-20',
      dailyQuestTaleSpiritId: 'bannik',
      dailyQuestClickProgress: 100,
      dailyQuestTaleCorrect: true,
    });
    expect(store.claimDailyQuestFragment(now)).toBe(true);
    callStore(store, 'resetDailyQuestWithRewarded', now);
    vi.advanceTimersByTime(10_000);

    store.dailyQuestClickProgress = 100;
    store.dailyQuestTaleCorrect = true;
    expect(store.claimDailyQuestFragment(now)).toBe(true);
    expect(store.fragmentCounts.baba_yaga).toBe(2);
  });

  it('should not reset the daily quest when the rewarded ad is cancelled', () => {
    vi.useFakeTimers();
    const now = new Date('2026-09-20T18:00:00');
    vi.setSystemTime(now);
    const store = makeStore({
      spiritStatuses: bannikOpen(),
      dailyQuestDayId: '2026-09-20',
      dailyQuestTaleSpiritId: 'bannik',
      dailyQuestClickProgress: 100,
      dailyQuestTaleCorrect: true,
      dailyQuestFragmentGrantedDayId: '2026-09-20',
      dailyQuestRewardClaimedDayId: '2026-09-20',
    });
    callStore(store, 'resetDailyQuestWithRewarded', now);
    vi.advanceTimersByTime(1_000);
    adsUiStore.cancel();

    expect(store.dailyQuestClickProgress).toBe(100);
    expect(store.dailyQuestFragmentGrantedDayId).toBe('2026-09-20');
    expect(saved(store, 'dailyQuestRewardedResetDayId')).toBeNull();
  });

  it('should not offer a daily reset before the reward, before Bannik, or after the reset was used', () => {
    vi.useFakeTimers();
    const now = new Date('2026-09-20T18:00:00');
    vi.setSystemTime(now);
    const beforeReward = makeStore({
      spiritStatuses: bannikOpen(),
      dailyQuestDayId: '2026-09-20',
      dailyQuestTaleSpiritId: 'bannik',
      dailyQuestClickProgress: 10,
      dailyQuestTaleCorrect: false,
    });
    callStore(beforeReward, 'resetDailyQuestWithRewarded', now);
    expect(adsUiStore.isWaitVisible).toBe(false);
    expect(beforeReward.dailyQuestClickProgress).toBe(10);

    const locked = makeStore({
      dailyQuestFragmentGrantedDayId: '2026-09-20',
    });
    callStore(locked, 'resetDailyQuestWithRewarded', now);
    expect(adsUiStore.isWaitVisible).toBe(false);

    const used = makeStore({
      spiritStatuses: bannikOpen(),
      dailyQuestDayId: '2026-09-20',
      dailyQuestFragmentGrantedDayId: '2026-09-20',
      dailyQuestClickProgress: 100,
      dailyQuestTaleCorrect: true,
    });
    (used as unknown as { dailyQuestRewardedResetDayId: string }).dailyQuestRewardedResetDayId =
      '2026-09-20';
    callStore(used, 'resetDailyQuestWithRewarded', now);
    expect(adsUiStore.isWaitVisible).toBe(false);
    expect(used.dailyQuestClickProgress).toBe(100);
  });

  it('should clear the daily reset flag on the next calendar day and not stack missed resets', () => {
    const store = makeStore({
      spiritStatuses: bannikOpen(),
      dailyQuestDayId: '2026-09-20',
      dailyQuestTaleSpiritId: 'bannik',
      dailyQuestClickProgress: 100,
      dailyQuestTaleCorrect: true,
      dailyQuestFragmentGrantedDayId: '2026-09-20',
    });
    (store as unknown as { dailyQuestRewardedResetDayId: string }).dailyQuestRewardedResetDayId =
      '2026-09-20';

    store.ensureDailyQuestDaySynced(new Date('2026-09-21T12:00:00'), () => 0);

    expect(field(store, 'dailyQuestRewardedResetDayId')).toBeNull();
    expect(store.dailyQuestClickProgress).toBe(0);
    expect(callStore(store, 'canResetDailyQuestWithRewarded', new Date('2026-09-21T12:00:00'))).toBe(
      false,
    );
  });

  it('should keep the daily reset flag in the save when the game is reloaded', () => {
    const store = makeStore({
      spiritStatuses: bannikOpen(),
      dailyQuestDayId: '2026-09-20',
    });
    (store as unknown as { dailyQuestRewardedResetDayId: string }).dailyQuestRewardedResetDayId =
      '2026-09-20';
    const restored = new GameStore();
    restored.hydrate(store.toSave());
    expect(field(restored, 'dailyQuestRewardedResetDayId')).toBe('2026-09-20');
  });

  it('should not write tomorrow reset flag when the calendar day changes during the daily ad', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-20T23:59:50'));
    const store = makeStore({
      spiritStatuses: bannikOpen(),
      dailyQuestDayId: '2026-09-20',
      dailyQuestTaleSpiritId: 'bannik',
      dailyQuestClickProgress: 100,
      dailyQuestTaleCorrect: true,
      dailyQuestFragmentGrantedDayId: '2026-09-20',
      dailyQuestRewardClaimedDayId: '2026-09-20',
    });
    callStore(store, 'resetDailyQuestWithRewarded', new Date('2026-09-20T23:59:50'));
    vi.setSystemTime(new Date('2026-09-21T00:00:05'));
    vi.advanceTimersByTime(10_000);

    expect(field(store, 'dailyQuestRewardedResetDayId')).not.toBe('2026-09-21');
    expect(store.dailyQuestFragmentGrantedDayId).not.toBe('2026-09-21');
  });
});
