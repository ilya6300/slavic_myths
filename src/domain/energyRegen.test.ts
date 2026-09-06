import { describe, expect, it } from 'vitest';
import { applyEnergyRegen } from './energyRegen';

describe('applyEnergyRegen', () => {
  it('should add 1 energy per minute elapsed', () => {
    const start = 1_000_000;
    const result = applyEnergyRegen(50, 100, start, start + 60_000);
    expect(result.energy).toBe(51);
  });

  it('should not exceed maxEnergy', () => {
    const start = 0;
    const result = applyEnergyRegen(99, 100, start, start + 5 * 60_000);
    expect(result.energy).toBe(100);
  });

  it('should not regen when already at cap', () => {
    const start = 0;
    const result = applyEnergyRegen(100, 100, start, start + 60_000);
    expect(result.energy).toBe(100);
    expect(result.lastEnergyAt).toBeGreaterThan(start);
  });

  it('should apply regen bonus percent from spirit rewards', () => {
    const start = 0;
    const result = applyEnergyRegen(0, 100, start, start + 50 * 60_000, 5);
    expect(result.energy).toBe(63);
  });
});
