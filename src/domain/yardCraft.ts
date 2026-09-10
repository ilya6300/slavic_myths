export const YARD_GRASS_CAP = 3;
export const YARD_GRASS_PER_CRAFT = 3;

export function canCollectYardGrass(yardGrass: number): boolean {
  return yardGrass < YARD_GRASS_CAP;
}

export function canCraftYardObereg(
  yardGrass: number,
  craftedDayId: string | null,
  todayId: string,
): boolean {
  return (
    yardGrass >= YARD_GRASS_PER_CRAFT && craftedDayId !== todayId
  );
}

export function hasCraftedOberegToday(
  craftedDayId: string | null,
  todayId: string,
): boolean {
  return craftedDayId === todayId;
}

/** Иногда днём, не каждый заход — шанс 40% при новом дне. */
export function shouldSpawnYardGrassToday(
  spawnDayId: string | null,
  todayId: string,
  rng: () => number = Math.random,
): boolean {
  if (spawnDayId === todayId) return false;
  return rng() < 0.4;
}

export function yardGrassSpawnCount(rng: () => number = Math.random): number {
  return rng() < 0.5 ? 1 : 2;
}
