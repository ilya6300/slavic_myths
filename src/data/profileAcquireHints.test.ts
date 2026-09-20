import { describe, expect, it } from 'vitest';
import {
  resolveSkinAcquireHint,
  resolveTitleAcquireHint,
} from './profileAcquireHints';

describe('profileAcquireHints', () => {
  it('should return chest hint for locked cat skin from loot pool', () => {
    expect(resolveSkinAcquireHint('cat', 'mace', 'ru')).toBe('Сундук (каждые 3 ч)');
  });

  it('should return miracle chest hint for epic and epoch cat skins', () => {
    expect(resolveSkinAcquireHint('cat', 'epic_hero', 'ru')).toBe('Сундук чудес');
    expect(resolveSkinAcquireHint('cat', 'purple_mage', 'ru')).toBe('Лавка Яги');
  });

  it('should return null for default-owned skin id', () => {
    expect(resolveSkinAcquireHint('cat', 'cat_standart', 'ru')).toBeNull();
  });

  it('should return Lada quest hint for hut_harmony', () => {
    expect(resolveSkinAcquireHint('izba', 'hut_harmony', 'ru')).toBe(
      'После победы над Ладой',
    );
  });

  it('should return chest hint for kot_okhrannik title', () => {
    expect(resolveTitleAcquireHint('kot_okhrannik', 'ru')).toBe('Сундук');
  });

  it('should return Yaga quest hint for kogot_yagi title', () => {
    expect(resolveTitleAcquireHint('kogot_yagi', 'ru')).toBe(
      'После победы над Бабой-Ягой',
    );
  });

  it('should return zhirdyay event hint for groza_zhirdyaev title', () => {
    expect(resolveTitleAcquireHint('groza_zhirdyaev', 'ru')).toBe(
      'Первый прогнанный Жирдяй',
    );
  });

  it('should not show hint for starter title novenkiy', () => {
    expect(resolveTitleAcquireHint('novenkiy', 'ru')).toBeNull();
  });
});
