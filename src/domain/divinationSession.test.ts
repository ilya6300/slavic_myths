import { describe, expect, it } from 'vitest';

import {
  buildDivinationNamePool,
  isDivinationUnlocked,
  pickDivinationSpiritId,
} from './divinationSession';
import { createDefaultSpiritStatuses } from './GameSave';

describe('divinationSession', () => {
  it('should unlock after baba_yaga defeated', () => {
    const s = createDefaultSpiritStatuses();
    expect(isDivinationUnlocked(s)).toBe(false);
    s.baba_yaga = 'defeated';
    expect(isDivinationUnlocked(s)).toBe(true);
  });

  it('should pick 8 names with correct included when pool is large', () => {
    const defeated = [
      'brownie',
      'susedko',
      'bannik',
      'kikimora',
      'poludnik',
      'ovinnik',
      'leshiy',
      'vodyanoy',
      'dedushka_toptygin',
    ] as const;
    const pool = buildDivinationNamePool('brownie', [...defeated], () => 0.1);
    expect(pool).toHaveLength(8);
    expect(pool).toContain('brownie');
  });

  it('should pick spirit from defeated pool', () => {
    expect(
      pickDivinationSpiritId(['brownie', 'susedko'], () => 0),
    ).toBe('brownie');
  });
});
