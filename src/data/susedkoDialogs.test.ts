import { describe, expect, it } from 'vitest';
import {
  getSusedkoFleeLine,
  getSusedkoTauntLines,
  pickSusedkoTaunt,
} from './susedkoDialogs';

describe('susedkoDialogs i18n', () => {
  it('should have 16 taunts in each locale', () => {
    expect(getSusedkoTauntLines('ru')).toHaveLength(16);
    expect(getSusedkoTauntLines('en')).toHaveLength(16);
    expect(getSusedkoTauntLines('tr')).toHaveLength(16);
  });

  it('should not repeat taunt consecutively when excluded', () => {
    const first = pickSusedkoTaunt('ru', undefined, () => 0)!;
    const second = pickSusedkoTaunt('ru', first, () => 0)!;
    expect(second).not.toBe(first);
  });

  it('should localize flee line', () => {
    expect(getSusedkoFleeLine('en')).toContain('back');
    expect(getSusedkoFleeLine('tr')).toContain('dönerim');
  });
});
