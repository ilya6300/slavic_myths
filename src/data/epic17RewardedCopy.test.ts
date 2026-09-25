import { describe, expect, it } from 'vitest';

import { dailyQuestContent } from './dailyQuestContent';
import { settingsUiContent } from './dialogContent';
import { divinationUi } from './divinationContent';

describe('epic 17 rewarded copy (TASK-057, TASK-059, TASK-061)', () => {
  it('should say 1.5 hours in ru en tr when the chest hurry label is shown', () => {
    expect(settingsUiContent.chestHurryLuck).toEqual({
      ru: 'Посмотри сказку -\nсними 1,5 часа',
      en: 'Watch a tale -\nskip 1.5 hours',
      tr: 'Masal izle -\n1,5 saat atla',
    });
    const joined = [
      settingsUiContent.chestHurryLuck.ru,
      settingsUiContent.chestHurryLuck.en,
      settingsUiContent.chestHurryLuck.tr,
    ].join('\n');
    expect(joined).not.toMatch(/30|−30|реклам|\bad\b|reklam/i);
  });

  it('should use the candle-out tale line in ru en tr when the mirror look is offered', () => {
    const line = (divinationUi as Record<string, { ru: string; en: string; tr: string }>)
      .rewardedLookLine;
    expect(line).toEqual({
      ru: 'Свеча кончилась. Короткая сказка — и стекло ответит.',
      en: 'The candle is out. A short tale, and the glass will answer.',
      tr: 'Mum bitti. Kısa bir masal — cam cevap verecek.',
    });
  });

  it('should offer hear-the-tale copy in ru en tr when the mirror look is offered', () => {
    expect(Object.values(divinationUi)).toContainEqual({
      ru: 'Послушай сказку',
      en: 'Hear the tale',
      tr: 'Masalı dinle',
    });
  });

  it('should offer go-again copy in ru en tr when the daily reset is offered', () => {
    expect(Object.values(dailyQuestContent)).toContainEqual({
      ru: 'Послушай сказку — пройди ещё раз',
      en: 'Hear the tale — go again',
      tr: 'Masalı dinle — bir daha geç',
    });
  });
});
