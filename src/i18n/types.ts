/** Поддерживаемые языки интерфейса и реплик */
export type Locale = 'ru' | 'en' | 'tr';

export const LOCALES: readonly Locale[] = ['ru', 'en', 'tr'] as const;

export const DEFAULT_LOCALE: Locale = 'ru';

export const LOCALE_LABELS: Record<Locale, string> = {
  ru: 'Русский',
  en: 'English',
  tr: 'Türkçe',
};

/** Одна фраза на три языка */
export type LocalizedText = Record<Locale, string>;

/** Банк фраз — каждая строка локализована */
export type LocalizedLines = readonly LocalizedText[];
