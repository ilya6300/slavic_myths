import { describe, expect, it } from 'vitest';
import { getOnboardingLine, getQuestHook, getSpiritLockedHint, pickCatLine } from './catDialogs';
import { onboardingLines } from './dialogContent';
import { resolveText } from '../i18n/resolve';

describe('catDialogs i18n', () => {
  it('should have 7 onboarding lines per scenario §4.3', () => {
    expect(onboardingLines).toHaveLength(7);
    expect(getOnboardingLine(0, 'ru')).toContain('Ого, человек');
    expect(getOnboardingLine(6, 'en')).toContain('night');
    expect(getOnboardingLine(6, 'tr')).toContain('bırakma');
  });

  it('should return localized bank lines', () => {
    const ru = pickCatLine('chest_ready', 'ru');
    const en = pickCatLine('chest_ready', 'en');
    expect(ru).toContain('Сундук');
    expect(en).toContain('chest');
  });

  it('should return spirit quest hooks and locked hints', () => {
    expect(getQuestHook('susedko', 'ru')).toContain('шуршание');
    expect(getSpiritLockedHint('bannik', 'en')).toContain('Susedko');
  });
});

describe('dialogContent', () => {
  it('should have non-empty click_footnote bank in all locales', () => {
    for (const locale of ['ru', 'en', 'tr'] as const) {
      const line = resolveText(onboardingLines[0]!, locale);
      expect(line.length).toBeGreaterThan(5);
    }
  });
});
