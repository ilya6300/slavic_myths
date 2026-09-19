import { describe, expect, it } from 'vitest';
import {
  advanceYardGrassSpawn,
  applyDailyYardGrassSpawn,
  canCollectYardGrass,
  canCraftYardObereg,
  tryAddYardGrassPatch,
  YARD_GRASS_FIELD_SLOT_COUNT,
  YARD_GRASS_SPAWN_INTERVAL_MS,
} from './yardCraft';

describe('yardCraft', () => {
  it('allows unlimited grass in inventory', () => {
    expect(canCollectYardGrass()).toBe(true);
  });

  it('adds one patch until field is full', () => {
    expect(tryAddYardGrassPatch([], () => 0)).toEqual([0]);
    const full = [0, 1, 2, 3, 4];
    expect(tryAddYardGrassPatch(full, () => 0)).toBeNull();
    expect(tryAddYardGrassPatch([0, 1, 2], () => 0)).toEqual([0, 1, 2, 3]);
  });

  it('requires 3 grass for craft', () => {
    expect(canCraftYardObereg(3)).toBe(true);
    expect(canCraftYardObereg(2)).toBe(false);
    expect(canCraftYardObereg(10)).toBe(true);
  });

  it('rolls spawn chance once per 3h window while offline', () => {
    const t0 = 1_000_000;
    const rng = () => 0;
    const after12h = advanceYardGrassSpawn(
      [],
      t0,
      t0 + 12 * 60 * 60 * 1000,
      rng,
    );
    expect(after12h.lastSpawnCheckAt).toBe(
      t0 + 4 * YARD_GRASS_SPAWN_INTERVAL_MS,
    );
    expect(after12h.fieldSlots.length).toBe(4);
  });

  it('anchors first spawn check at now when never checked', () => {
    const now = 5_000_000;
    const result = advanceYardGrassSpawn([], null, now, () => 0);
    expect(result.lastSpawnCheckAt).toBe(now);
    expect(result.fieldSlots).toEqual([]);
  });

  it('spawns 1–2 patches once per calendar day', () => {
    const first = applyDailyYardGrassSpawn([], null, '2026-09-14', () => 0);
    expect(first.lastSpawnDayId).toBe('2026-09-14');
    expect(first.fieldSlots.length).toBeGreaterThanOrEqual(1);
    expect(first.fieldSlots.length).toBeLessThanOrEqual(2);

    const sameDay = applyDailyYardGrassSpawn(first.fieldSlots, '2026-09-14', '2026-09-14', () => 0);
    expect(sameDay.fieldSlots).toEqual(first.fieldSlots);

    const nextDay = applyDailyYardGrassSpawn(first.fieldSlots, '2026-09-14', '2026-09-15', () => 0);
    expect(nextDay.fieldSlots.length).toBeGreaterThan(first.fieldSlots.length);
  });

  it('respects max field slots over many ticks', () => {
    const t0 = 0;
    const rng = () => 0;
    const result = advanceYardGrassSpawn(
      [],
      t0,
      t0 + 100 * YARD_GRASS_SPAWN_INTERVAL_MS,
      rng,
    );
    expect(result.fieldSlots.length).toBe(YARD_GRASS_FIELD_SLOT_COUNT);
  });
});
