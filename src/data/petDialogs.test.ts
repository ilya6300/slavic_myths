import { describe, expect, it } from 'vitest';

import { petBubbleVisibleMs, pickPetClickLine } from './petDialogs';

describe('pickPetClickLine', () => {
  it('should return a line from the pet bank', () => {
    const line = pickPetClickLine('pet_griffin', 'ru', undefined, () => 0);
    expect(line).toBeTruthy();
    expect(line).toContain('Мурлыкать');
  });

  it('should scale bubble duration with line length', () => {
    const short = petBubbleVisibleMs('Мур.');
    const long = petBubbleVisibleMs(
      'Хвост кота махнул — ветерок. Я махнул бы — был бы ураган. Хорошо, что я сдержанный.',
    );
    expect(long).toBeGreaterThan(short);
    expect(short).toBeGreaterThanOrEqual(5500);
  });

  it('should not repeat the same line twice in a row when alternatives exist', () => {
    const first = pickPetClickLine('pet_firebird', 'ru', undefined, () => 0);
    const second = pickPetClickLine('pet_firebird', 'ru', first, () => 0);
    expect(second).toBeTruthy();
    expect(second).not.toBe(first);
  });
});
