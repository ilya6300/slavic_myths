import { describe, expect, it } from 'vitest';
import { spiritIllustrationPaths } from '../../config/assetRegistry';
import type { SpiritId } from '../../config/assetRegistry';
import { SPIRIT_ORDER } from '../../data/spirits';
import { spiritIllustrationUrl } from './spiritIllustrationUrl';

describe('spiritIllustrationUrl', () => {
  it('should return illustration_book 3D for every spirit regardless of status', () => {
    for (const spiritId of SPIRIT_ORDER) {
      const url = spiritIllustrationUrl(spiritId);
      expect(url).toBe(spiritIllustrationPaths[spiritId]);
      expect(url).toContain('illustration_book');
      expect(url).not.toContain('creatures_in_the_book');
    }
  });

  it('should point brownie to illustration_book not brownie_standart', () => {
    const url = spiritIllustrationUrl('brownie');
    expect(url).toContain('illustration_book/brownie');
    expect(url).not.toContain('brownie_standart');
  });

  it('should cover all 16 spirits in illustration paths', () => {
    expect(SPIRIT_ORDER).toHaveLength(16);
    for (const spiritId of SPIRIT_ORDER as SpiritId[]) {
      expect(spiritIllustrationPaths[spiritId]).toBeDefined();
    }
  });
});
