import { describe, expect, it } from 'vitest';

import {

  SUSEDKO_STEAL_COIN_INTERVAL_MS,

  SUSEDKO_STEAL_COOLDOWN_MS,

} from '../config/gameConstants';

import {

  canStartSusedkoSteal,

  canStealCoins,

  countCoinsStolenOverTicks,

  isSusedkoStealCooldownElapsed,

  shouldStopStealing,

} from './susedkoSteal';



describe('susedkoSteal', () => {

  it('should allow steal when cat sleeps after chest', () => {

    expect(

      canStartSusedkoSteal({

        onboardingCompleted: true,

        firstChestOpened: true,

        catSleeping: true,

        activeRoom: 1,

        zhirdyayActive: false,

      }),

    ).toBe(true);

  });



  it('should block steal during onboarding', () => {

    expect(

      canStartSusedkoSteal({

        onboardingCompleted: false,

        firstChestOpened: true,

        catSleeping: true,

        activeRoom: 1,

        zhirdyayActive: false,

      }),

    ).toBe(false);

  });



  it('should stop stealing below stop-loss', () => {

    expect(shouldStopStealing(14)).toBe(true);

    expect(shouldStopStealing(15)).toBe(false);

  });



  it('should allow steal only with enough coins', () => {

    expect(canStealCoins(15)).toBe(true);

    expect(canStealCoins(14)).toBe(false);

  });



  it('should enforce 30 minute cooldown between steal events', () => {

    const lastAt = 1_000_000;

    expect(isSusedkoStealCooldownElapsed(lastAt, null)).toBe(true);

    expect(isSusedkoStealCooldownElapsed(lastAt + SUSEDKO_STEAL_COOLDOWN_MS - 1, lastAt)).toBe(

      false,

    );

    expect(isSusedkoStealCooldownElapsed(lastAt + SUSEDKO_STEAL_COOLDOWN_MS, lastAt)).toBe(

      true,

    );

  });



  it('should steal at most 1 coin per 3 seconds over simulated ticks', () => {

    const stealStartedAt = 0;

    const tickTimes: number[] = [];

    for (let t = 0; t <= 60_000; t += 1_000) {

      tickTimes.push(t);

    }



    const stolen = countCoinsStolenOverTicks(200, stealStartedAt, tickTimes);

    expect(stolen).toBeLessThanOrEqual(21);

    expect(stolen).toBeGreaterThanOrEqual(19);

  });



  it('should not double-steal when two ticks share the same timestamp', () => {

    const stealStartedAt = 10_000;

    const at = stealStartedAt + SUSEDKO_STEAL_COIN_INTERVAL_MS;

    const stolen = countCoinsStolenOverTicks(200, stealStartedAt, [at, at, at]);

    expect(stolen).toBe(1);

  });

});

