/**
 * Таблицы дропа и шансов — редактируемый баланс в коде.
 * Зеркало: instruction/dev/loot_tables.md
 * Геймдизайн: instruction/scenario.md §5.4, §6
 */

import type { Grade } from '../domain/grade';

/** Базовый размер пула весов (система удачи домового: до +10% к rare+). */
export const LOOT_POOL_TOTAL = 10_000;

/** Бонус удачи к весам rare / epic / epoch (0.1 = +10%). */
export const LUCK_BONUS_RARE_PLUS = 0.1;

// --- Обычный сундук (3 ч) ---

export const regularChest = {
  cooldownHours: 3,
  firstOpenInstant: true,
  /** Шанс фрагмента Эпохи на выбранного locked-духа (0–1). */
  fragmentChance: 0.05,
  /** Титулы epoch из сундука чудес — не выпадают здесь. */
  epochTitlesAllowed: false,
} as const;

/**
 * Веса грейдов внутри обычного сундука (сумма = LOOT_POOL_TOTAL).
 * Удача домового умножает rare/epic/epoch на (1 + LUCK_BONUS_RARE_PLUS).
 */
export const regularChestGradeWeights: Record<Grade, number> = {
  common: 5_300,
  rare: 3_000,
  epic: 1_500,
  epoch: 200,
};

export type RegularChestRewardType =
  | 'cat_skin'
  | 'brownie_skin'
  | 'izba_skin'
  | 'window_skin'
  | 'title_common'
  | 'title_rare'
  | 'title_epic'
  | 'spirit_key'
  | 'energy_bonus'
  | 'obereg'
  | 'fragment'
  | 'chest_key';

// --- Сундук чудес (еженедельный) ---

export const miracleChest = {
  weekStartsMonday: true,
  requiresSusedkoDefeated: true,
  requiresMinOneRareSpirit: true,
  firstOpenInCycleFree: true,
  clicksToOpen: 700,
  /** Шанс фрагмента на выбранного locked-духа (0–1). */
  fragmentChance: 0.25,
  /** Гарант фрагмента на N-м открытии подряд без фрагмента. */
  fragmentPityEvery: 8,
} as const;

export type MiracleConsolationReward =
  | 'obereg_x2'
  | 'energy_full'
  | 'chest_key'
  | 'spirit_key'
  | 'title_epic'
  | 'izba_skin_epic'
  | 'title_epoch';

/**
 * Утешительный пул Сундука чудес (если не выпал фрагмент).
 * Веса относительные — чем больше, тем чаще. Сумма не обязана = LOOT_POOL_TOTAL.
 */
export const miracleConsolationWeights: Record<MiracleConsolationReward, number> = {
  obereg_x2: 2800,
  energy_full: 2600,
  chest_key: 700,
  spirit_key: 900,
  title_epic: 600,
  izba_skin_epic: 500,
  /** Самый редкий среди утешительных */
  title_epoch: 100,
};

/** Духи, на которых может выпасть ключ из утешительного пула. */
export const miracleSpiritKeyTargets = [
  'poludnica',
  'dedushka_toptygin',
  'rusalka',
] as const;

// --- Фрагменты Эпохи чудес ---

export const fragmentRequirements: Record<string, number> = {
  lada: 3,
  baba_yaga: 3,
  veles: 6,
  koschei_immortal: 5,
  chudo_yudo: 6,
};

export const fragmentBonusSources = {
  regularChestMaxChance: 0.05,
  duplicateSkinOrTitle: 1,
  rarePlusSpiritVictory: 1,
} as const;

/** Разовый бонус фрагмента за победу над rare+ (loot_tables.md) */
export const fragmentVictoryBonusSpiritIds = [
  'leshiy',
  'vodyanoy',
  'dedushka_toptygin',
  'poludnica',
  'rusalka',
] as const;

// --- Дубликаты ---

export const duplicateHandling = {
  /** Если всё собрано — утешительный приз */
  fallbackEnergy: 30,
  fallbackObereg: 1,
  duplicateTitleOberegBonus: 2,
} as const;

// --- Хелперы ---

export function applyLuckToGradeWeights(
  weights: Record<Grade, number>,
  luckBonus = LUCK_BONUS_RARE_PLUS,
): Record<Grade, number> {
  const mult = 1 + luckBonus;
  return {
    common: weights.common,
    rare: Math.round(weights.rare * mult),
    epic: Math.round(weights.epic * mult),
    epoch: Math.round(weights.epoch * mult),
  };
}

export function rollFragmentMiracle(
  pityCounter: number,
  rng: () => number = Math.random,
): boolean {
  if (pityCounter >= miracleChest.fragmentPityEvery - 1) {
    return true;
  }
  return rng() < miracleChest.fragmentChance;
}

export function rollFragmentRegular(rng: () => number = Math.random): boolean {
  return rng() < regularChest.fragmentChance;
}

/**
 * Выбор награды из утешительного пула Сундука чудес по весам.
 */
export function pickMiracleConsolation(
  rng: () => number = Math.random,
): MiracleConsolationReward {
  const entries = Object.entries(miracleConsolationWeights) as [
    MiracleConsolationReward,
    number,
  ][];
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = rng() * total;
  for (const [reward, weight] of entries) {
    roll -= weight;
    if (roll <= 0) {
      return reward;
    }
  }
  return entries[entries.length - 1][0];
}

/**
 * Веса типов награды внутри грейда (обычный сундук 3 ч).
 * Сумма весов по грейду ≈ доля грейда в regularChestGradeWeights.
 * Epoch-титулы в обычный сундук не входят (scenario.md §5.4).
 */
export const regularChestTypeWeightsByGrade: Record<
  Grade,
  Partial<Record<RegularChestRewardType, number>>
> = {
  common: {
    cat_skin: 2500,
    title_common: 1500,
    energy_bonus: 600,
    obereg: 400,
    brownie_skin: 200,
    window_skin: 100,
  },
  rare: {
    cat_skin: 1200,
    title_rare: 1000,
    brownie_skin: 400,
    izba_skin: 300,
    spirit_key: 100,
  },
  epic: {
    cat_skin: 500,
    title_epic: 400,
    izba_skin: 300,
    brownie_skin: 200,
    spirit_key: 100,
  },
  epoch: {
    cat_skin: 80,
    izba_skin: 60,
    window_skin: 40,
    brownie_skin: 20,
  },
};

/** Доп. роллы вне грейда (фрагмент ≤5%) */
export const regularChestExtraRolls = {
  fragment: 50,
} as const;

export function pickRegularChestTypeForGrade(
  grade: Grade,
  rng: () => number = Math.random,
): RegularChestRewardType | null {
  const weights = regularChestTypeWeightsByGrade[grade];
  const entries = Object.entries(weights) as [RegularChestRewardType, number][];
  if (!entries.length) return null;
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = rng() * total;
  for (const [type, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return type;
  }
  return entries[entries.length - 1]![0];
}
