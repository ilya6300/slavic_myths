import { describe, expect, it } from 'vitest';

import {
  SUSEDKO_STEAL_COIN_INTERVAL_MS,
  SUSEDKO_STEAL_START_DELAY_MS,
  SUSEDKO_STEAL_WARNING_MS,
} from '../config/gameConstants';
import { createDefaultSave, getNightId } from '../domain/GameSave';
import { eventUiStore } from './eventUiStore';
import { gameStore } from './GameStore';
import { sceneUiStore } from './sceneUiStore';

function setupSusedkoSteal(luckCoins = 50, baseNow = Date.now()): number {
  const save = createDefaultSave(baseNow);
  save.onboardingCompleted = true;
  save.firstChestOpened = true;
  save.luckCoins = luckCoins;
  save.lastSusedkoStealAt = null;
  save.zhirdyayActive = false;
  save.zhirdyaySeenThisNight = true;
  save.nightId = getNightId(new Date(baseNow));
  gameStore.hydrate(save);

  sceneUiStore.enterAfkSleep();
  sceneUiStore.activeRoom = 1;
  eventUiStore.resetSusedkoSteal();
  eventUiStore.stealSuppressedThisSleep = false;
  eventUiStore.stealWarningShown = false;
  eventUiStore.catSleepedAt = null;
  eventUiStore.zhirdyaySpawnAttemptedForNight = getNightId(new Date(baseNow));
  eventUiStore.onCatFellAsleep(baseNow);
  return baseNow;
}

function tickUntilStealing(baseNow: number): number {
  const stealAt =
    baseNow + SUSEDKO_STEAL_WARNING_MS + SUSEDKO_STEAL_START_DELAY_MS;
  for (let t = baseNow + 1_000; t <= stealAt; t += 1_000) {
    eventUiStore.tick(t);
  }
  return stealAt;
}

describe('eventUiStore susedko steal', () => {
  it('should not reset stealing phase when cooldown not elapsed yet', () => {
    const baseNow = setupSusedkoSteal(50);
    const stealAt = tickUntilStealing(baseNow);
    expect(eventUiStore.susedkoPhase).toBe('stealing');

    eventUiStore.tick(stealAt + 1_000);
    expect(eventUiStore.susedkoPhase).toBe('stealing');
  });

  it('should decrease luckCoins after 3 seconds of stealing', () => {
    const baseNow = setupSusedkoSteal(50);
    const stealAt = tickUntilStealing(baseNow);
    expect(gameStore.luckCoins).toBe(50);

    eventUiStore.tick(stealAt + SUSEDKO_STEAL_COIN_INTERVAL_MS);
    expect(gameStore.luckCoins).toBe(49);
  });
});
