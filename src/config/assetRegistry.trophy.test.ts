import { describe, expect, it } from 'vitest';
import { getTrophyUrl, trophyAssetPaths } from './assetRegistry';
import { spirits } from '../data/spirits';

describe('getTrophyUrl', () => {
  it('should return dedicated 3D trophy asset when available', () => {
    const url = getTrophyUrl('susedko');
    expect(url).toBe(trophyAssetPaths.susedko);
    expect(url).toContain('susedko_chest');
  });

  it('should fall back to portrait for spirits without trophy file', () => {
    const url = getTrophyUrl('brownie');
    expect(url).toContain('creatures_in_the_book/brownie');
  });

  it('should map every trophy spirit to assets/trophies including yarilo and perun', () => {
    const trophySpirits = spirits.filter((s) => s.hasTrophy);
    expect(trophySpirits).toHaveLength(17);
    for (const spirit of trophySpirits) {
      const url = getTrophyUrl(spirit.id);
      expect(url).toBe(trophyAssetPaths[spirit.id]);
      expect(url).toContain('/trophies/');
    }
  });
});
