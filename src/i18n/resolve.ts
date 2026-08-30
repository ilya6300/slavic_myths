import type { Locale, LocalizedLines, LocalizedText } from './types';
import { DEFAULT_LOCALE } from './types';

export function resolveText(text: LocalizedText, locale: Locale): string {
  return text[locale] ?? text[DEFAULT_LOCALE];
}

export function resolveLines(lines: LocalizedLines, locale: Locale): string[] {
  return lines.map((line) => resolveText(line, locale));
}

export function pickLocalizedLine(
  lines: LocalizedLines,
  locale: Locale,
  rng: () => number = Math.random,
): string | undefined {
  if (lines.length === 0) return undefined;
  const entry = lines[Math.floor(rng() * lines.length)]!;
  return resolveText(entry, locale);
}

export function pickLocalizedLineExcluding(
  lines: LocalizedLines,
  locale: Locale,
  exclude: string | undefined,
  rng: () => number = Math.random,
): string | undefined {
  const resolved = resolveLines(lines, locale);
  const pool =
    exclude && resolved.length > 1
      ? resolved.filter((line) => line !== exclude)
      : resolved;
  if (pool.length === 0) return undefined;
  return pool[Math.floor(rng() * pool.length)];
}

export function formatLocalizedTemplate(
  template: LocalizedText,
  locale: Locale,
  params: Record<string, string | number>,
): string {
  let result = resolveText(template, locale);
  for (const [key, value] of Object.entries(params)) {
    result = result.replaceAll(`{${key}}`, String(value));
  }
  return result;
}

export function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('tr')) return 'tr';
  if (lang.startsWith('en')) return 'en';
  return 'ru';
}
