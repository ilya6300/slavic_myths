import { describe, expect, it } from 'vitest';
import { getTrophyUrl, trophyAssetPaths } from './assetRegistry';

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
});
