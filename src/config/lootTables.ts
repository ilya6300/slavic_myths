/**
 * Таблицы дропа и шансов — редактируемый баланс в коде.
 * Зеркало: instruction/dev/loot_tables.md
 * Геймдизайн: instruction/scenario.md §5.4, §6
 */

import { LUCK_COIN_GRADE_WEIGHT_BONUS_PER_COIN } from './gameConstants';
import { getBrownieLuckBonusPercent } from '../domain/brownieLuck';
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
  /** Гарант epoch-скина на N-м открытии подряд без epoch/фрагмента. */
  epochPityEvery: 25,
  /** Титулы epoch из сундука чудес — не выпадают здесь. */
  epochTitlesAllowed: false,
} as const;

/**
 * Веса грейдов внутри обычного сундука (сумма = LOOT_POOL_TOTAL).
 * Удача домового умножает rare/epic/epoch на (1 + LUCK_BONUS_RARE_PLUS).
 */
export const regularChestGradeWeights: Record<Grade, number> = {
  common: 4_846,
  rare: 3_122,
  epic: 1_586,
  epoch: 446,
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
  | 'title_epoch'
  | 'cat_skin_epic'
  | 'cat_skin_epoch';

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
  /** Самый редкий среди утешительных */
  title_epoch: 100,
  cat_skin_epic: 650,
  cat_skin_epoch: 160,
};

/** Духи, на которых может выпасть ключ из утешительного пула. */
export const miracleSpiritKeyTargets = [
  'poludnica',
  'dedushka_toptygin',
  'rusalka',
] as const;

// --- Фрагменты Эпохи чудес ---

export const fragmentRequirements: Record<string, number> = {
  baba_yaga: 3,
  lada: 3,
  veles: 6,
  koschei_immortal: 5,
  chudo_yudo: 8,
  yarilo: 8,
  perun: 10,
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

/** Монеты удачи: +0.05% базового веса rare/epic/epoch за 1 монету. */
export function applyLuckCoinsToGradeWeights(
  weights: Record<Grade, number>,
  luckCoins: number,
): Record<Grade, number> {
  const mult = 1 + luckCoins * LUCK_COIN_GRADE_WEIGHT_BONUS_PER_COIN;
  return {
    common: weights.common,
    rare: Math.round(weights.rare * mult),
    epic: Math.round(weights.epic * mult),
    epoch: Math.round(weights.epoch * mult),
  };
}

export function applyChestGradeWeights(
  base: Record<Grade, number>,
  options: { domovoySkinId: string; luckCoins: number },
): Record<Grade, number> {
  const domovoiMult = getBrownieLuckBonusPercent(options.domovoySkinId) / 100;
  const withDomovoi = applyLuckToGradeWeights(base, domovoiMult);
  return applyLuckCoinsToGradeWeights(withDomovoi, options.luckCoins);
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
    cat_skin: 2800,
    title_common: 700,
    energy_bonus: 250,
    obereg: 200,
    brownie_skin: 200,
    window_skin: 450,
  },
  rare: {
    cat_skin: 1400,
    title_rare: 550,
    brownie_skin: 550,
    izba_skin: 500,
    spirit_key: 150,
  },
  epic: {
    title_epic: 150,
    brownie_skin: 300,
    spirit_key: 100,
  },
  epoch: {
    izba_skin: 120,
    window_skin: 80,
    brownie_skin: 90,
  },
};

/** Доп. роллы вне грейда (фрагмент ≤5%) */
export const regularChestExtraRolls = {
  fragment: 363,
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
