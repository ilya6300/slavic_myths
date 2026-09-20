import { describe, expect, it } from 'vitest';

import { SPIRIT_ORDER } from './spirits';
import generated from './divinationAnswers.generated.json';
import { getDivinationAnswerPair } from './divinationAnswers';

describe('divinationAnswers', () => {
  it('should have 8 answer pairs per spirit in generated data', () => {
    for (const id of SPIRIT_ORDER) {
      const pairs = (generated as Record<string, string[][]>)[id];
      expect(pairs, id).toHaveLength(8);
    }
  });

  it('should resolve localized pair for brownie q0', () => {
    const [a] = getDivinationAnswerPair('brownie', 0);
    expect(a.ru).toContain('Добрый');
  });
});
