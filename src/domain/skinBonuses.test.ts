import { describe, expect, it } from 'vitest';
import { getSkinBonusLines } from './skinBonuses';

describe('getSkinBonusLines', () => {
  it('should return luck bonus line for brownie skins', () => {
    const lines = getSkinBonusLines('brownie', 'brownie_standart', 'ru');
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatch(/\+1%/);
  });

  it('should return empty array for cosmetic cat skins', () => {
    expect(getSkinBonusLines('cat', 'cat_standart', 'ru')).toEqual([]);
  });

  it('should return empty array for cosmetic izba skins', () => {
    expect(getSkinBonusLines('izba', 'hut_standart', 'ru')).toEqual([]);
  });
});
