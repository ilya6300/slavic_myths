import { describe, expect, it } from 'vitest';
import { createDefaultSpiritStatuses } from './GameSave';
import {
  applyDefeatAndUnlock,
  countDefeatedSpirits,
  findNextAvailableSpirit,
  spiritsToUnlockAfterDefeat,
} from './spiritQueue';

describe('spiritQueue', () => {
  it('unlocks susedko after brownie defeat', () => {
    const statuses = createDefaultSpiritStatuses();
    const next = applyDefeatAndUnlock('brownie', statuses, {});
    expect(next.brownie).toBe('defeated');
    expect(next.susedko).toBe('available');
    expect(next.bannik).toBe('locked');
  });

  it('unlocks bannik after susedko defeat', () => {
    const statuses = createDefaultSpiritStatuses();
    statuses.brownie = 'defeated';
    statuses.susedko = 'available';
    const next = applyDefeatAndUnlock('susedko', statuses, {});
    expect(next.susedko).toBe('defeated');
    expect(next.bannik).toBe('available');
  });

  it('does not unlock chest_key spirits automatically', () => {
    const statuses = createDefaultSpiritStatuses();
    for (const id of ['brownie', 'susedko', 'bannik', 'kikimora', 'poludnik', 'ovinnik', 'leshiy', 'vodyanoy']) {
      statuses[id] = 'defeated';
    }
    const unlocks = spiritsToUnlockAfterDefeat('vodyanoy', statuses, {});
    expect(unlocks).not.toContain('poludnica');
    expect(unlocks).not.toContain('dedushka_toptygin');
    expect(unlocks).not.toContain('rusalka');
  });

  it('finds next available spirit in order', () => {
    const statuses = createDefaultSpiritStatuses();
    expect(findNextAvailableSpirit(statuses)).toBe('brownie');
    statuses.brownie = 'defeated';
    statuses.susedko = 'available';
    expect(findNextAvailableSpirit(statuses)).toBe('susedko');
  });

  it('counts defeated spirits', () => {
    const statuses = createDefaultSpiritStatuses();
    statuses.brownie = 'defeated';
    statuses.susedko = 'defeated';
    expect(countDefeatedSpirits(statuses)).toBe(2);
  });
});
