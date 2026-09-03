import { describe, expect, it } from 'vitest';
import { pickIzbaItemLine } from './izbaItemDialog';

describe('izbaItemDialog', () => {
  it('should not repeat the same line twice in a row for one object', () => {
    const first = pickIzbaItemLine('stove', 'ru', {
      lastTag: null,
      lastLineIndex: 0,
    });
    const second = pickIzbaItemLine('stove', 'ru', first.nextState, () => 0);
    expect(second.text).not.toBe(first.text);
  });
});
