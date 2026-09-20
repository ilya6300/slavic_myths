import { describe, expect, it } from 'vitest';

import {
  divinationCrumbsReward,
  grantFirstVictoryCandle,
  spendCandle,
} from './candles';

describe('candles', () => {
  it('should grant one candle only on first victory per spirit', () => {
    const first = grantFirstVictoryCandle('brownie', []);
    expect(first.candlesDelta).toBe(1);
    const second = grantFirstVictoryCandle('brownie', first.nextGranted);
    expect(second.candlesDelta).toBe(0);
  });

  it('should award 10 or 3 truth crumbs for divination', () => {
    expect(divinationCrumbsReward(true)).toBe(10);
    expect(divinationCrumbsReward(false)).toBe(3);
  });

  it('should not spend below zero candles', () => {
    expect(spendCandle(0)).toBe(0);
    expect(spendCandle(2)).toBe(1);
  });
});
