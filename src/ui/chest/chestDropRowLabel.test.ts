import { describe, expect, it } from 'vitest';

import { formatChestDropRowLabel } from './chestDropRowLabel';

describe('formatChestDropRowLabel', () => {
  it('should show localized grade for ru common cat skin', () => {
    const label = formatChestDropRowLabel('cat_skin', 'common', 'ru');
    expect(label).toBe('Скин кота (Обычный)');
    expect(label).not.toContain('common');
  });

  it('should show localized grade for en common cat skin', () => {
    const label = formatChestDropRowLabel('cat_skin', 'common', 'en');
    expect(label).toBe('Cat skin (Common)');
    expect(label).not.toContain('(common)');
  });

  it('should show title once with localized grade', () => {
    const label = formatChestDropRowLabel('title_common', 'common', 'ru');
    expect(label).toBe('Титул (Обычный)');
    expect(label).not.toMatch(/обычный.*Обычный/i);
  });
});
