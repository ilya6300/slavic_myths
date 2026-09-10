import { describe, expect, it } from 'vitest';
import {
  canCollectYardGrass,
  canCraftYardObereg,
  shouldSpawnYardGrassToday,
  YARD_GRASS_CAP,
} from './yardCraft';

describe('yardCraft', () => {
  it('caps grass collection at 3', () => {
    expect(canCollectYardGrass(0)).toBe(true);
    expect(canCollectYardGrass(YARD_GRASS_CAP - 1)).toBe(true);
    expect(canCollectYardGrass(YARD_GRASS_CAP)).toBe(false);
  });

  it('requires 3 grass and daily limit for craft', () => {
    expect(canCraftYardObereg(3, null, '2026-09-10')).toBe(true);
    expect(canCraftYardObereg(2, null, '2026-09-10')).toBe(false);
    expect(canCraftYardObereg(3, '2026-09-10', '2026-09-10')).toBe(false);
  });

  it('spawns at most once per day with rng', () => {
    expect(shouldSpawnYardGrassToday('2026-09-10', '2026-09-10', () => 0.99)).toBe(
      false,
    );
    expect(shouldSpawnYardGrassToday(null, '2026-09-10', () => 0)).toBe(true);
    expect(shouldSpawnYardGrassToday(null, '2026-09-10', () => 0.99)).toBe(false);
  });
});
