export const YARD_GRASS_PER_CRAFT = 3;
/** Максимум пучков травы одновременно на дворе */
export const YARD_GRASS_FIELD_SLOT_COUNT = 5;

export const YARD_GRASS_SPAWN_INTERVAL_MS = 3 * 60 * 60 * 1000;
export const YARD_GRASS_SPAWN_CHANCE = 0.25;
/** Пучков за календарный день на дворе (канон `street_layout.md`). */
export const YARD_GRASS_DAILY_SPAWN_MIN = 1;
export const YARD_GRASS_DAILY_SPAWN_MAX = 2;

export function yardGrassFieldMaxPatches(): number {
  return YARD_GRASS_FIELD_SLOT_COUNT;
}

export function canCollectYardGrass(): boolean {
  return true;
}

export function canCraftYardObereg(yardGrass: number): boolean {
  return yardGrass >= YARD_GRASS_PER_CRAFT;
}

/** Один пучок в свободный слот на дворе (до {@link YARD_GRASS_FIELD_SLOT_COUNT}). */
export function tryAddYardGrassPatch(
  slots: number[],
  rng: () => number = Math.random,
): number[] | null {
  const max = yardGrassFieldMaxPatches();
  if (slots.length >= max) return null;
  const pool: number[] = [];
  for (let s = 0; s < YARD_GRASS_FIELD_SLOT_COUNT; s++) {
    if (!slots.includes(s)) pool.push(s);
  }
  if (pool.length === 0) return null;
  const pick = pool[Math.floor(rng() * pool.length)]!;
  return [...slots, pick];
}

/**
 * Раз в календарный день — 1–2 пучка на дворе (если есть свободные слоты).
 */
export function applyDailyYardGrassSpawn(
  fieldSlots: number[],
  lastSpawnDayId: string | null,
  calendarDayId: string,
  rng: () => number = Math.random,
): { fieldSlots: number[]; lastSpawnDayId: string } {
  if (lastSpawnDayId === calendarDayId) {
    return { fieldSlots: [...fieldSlots], lastSpawnDayId: calendarDayId };
  }

  const extra =
    YARD_GRASS_DAILY_SPAWN_MIN +
    Math.floor(
      rng() * (YARD_GRASS_DAILY_SPAWN_MAX - YARD_GRASS_DAILY_SPAWN_MIN + 1),
    );
  let slots = [...fieldSlots];
  for (let i = 0; i < extra; i++) {
    const next = tryAddYardGrassPatch(slots, rng);
    if (!next) break;
    slots = next;
  }

  return { fieldSlots: slots, lastSpawnDayId: calendarDayId };
}

/**
 * Каждые 3 ч — один бросок 25% на пучок на дворе (в т.ч. пока игрок оффлайн).
 */
export function advanceYardGrassSpawn(
  fieldSlots: number[],
  lastSpawnCheckAt: number | null,
  now: number,
  rng: () => number = Math.random,
): { fieldSlots: number[]; lastSpawnCheckAt: number } {
  if (lastSpawnCheckAt == null) {
    return { fieldSlots: [...fieldSlots], lastSpawnCheckAt: now };
  }

  const elapsed = now - lastSpawnCheckAt;
  const ticks = Math.floor(elapsed / YARD_GRASS_SPAWN_INTERVAL_MS);
  if (ticks <= 0) {
    return { fieldSlots: [...fieldSlots], lastSpawnCheckAt };
  }

  let slots = [...fieldSlots];
  for (let i = 0; i < ticks; i++) {
    if (rng() < YARD_GRASS_SPAWN_CHANCE) {
      const next = tryAddYardGrassPatch(slots, rng);
      if (next) slots = next;
    }
  }

  return {
    fieldSlots: slots,
    lastSpawnCheckAt: lastSpawnCheckAt + ticks * YARD_GRASS_SPAWN_INTERVAL_MS,
  };
}
