import { describe, expect, it } from 'vitest';
import { stripLegacyDevFragmentSeedFromCounts } from './gameBootstrap';

describe('stripLegacyDevFragmentSeedFromCounts', () => {
  it('should remove counts exactly equal to legacy dev seed floor', () => {
    const { counts, changed } = stripLegacyDevFragmentSeedFromCounts({
      lada: 2,
      veles: 2,
      koschei_immortal: 1,
    });
    expect(changed).toBe(true);
    expect(counts.lada).toBeUndefined();
    expect(counts.veles).toBeUndefined();
    expect(counts.koschei_immortal).toBe(1);
  });

  it('should keep counts above legacy dev seed floor', () => {
    const { counts, changed } = stripLegacyDevFragmentSeedFromCounts({
      lada: 3,
    });
    expect(changed).toBe(false);
    expect(counts.lada).toBe(3);
  });
});
