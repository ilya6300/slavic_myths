import { describe, expect, it } from 'vitest';
import {
  resolveCatClickDialog,
  shouldShowClickFootnote,
} from './catClick';

describe('catClick', () => {
  it('should show footnote on every 5th click', () => {
    expect(shouldShowClickFootnote(5)).toBe(true);
    expect(shouldShowClickFootnote(10)).toBe(true);
    expect(shouldShowClickFootnote(4)).toBe(false);
    expect(shouldShowClickFootnote(6)).toBe(false);
  });

  it('should return footnote text on 5th click in ru', () => {
    const result = resolveCatClickDialog(5, 'ru', () => 0);
    expect(result.kind).toBe('footnote');
    expect(result.text).toBeTruthy();
  });

  it('should rotate footnote lines on 10th click', () => {
    const fifth = resolveCatClickDialog(5, 'ru', () => 0);
    const tenth = resolveCatClickDialog(10, 'ru', () => 0);
    expect(fifth.text).not.toBe(tenth.text);
  });

  it('should localize footnote to en', () => {
    const result = resolveCatClickDialog(5, 'en', () => 0);
    expect(result.kind).toBe('footnote');
    expect(result.text).toMatch(/click|luck|Five/i);
  });
});
