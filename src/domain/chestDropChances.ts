import type { SpiritId } from '../config/assetRegistry';
import {
  LOOT_POOL_TOTAL,
  applyChestGradeWeights,
  fragmentRequirements,
  miracleChest,
  miracleConsolationWeights,
  miracleSpiritKeyTargets,
  regularChest,
  regularChestExtraRolls,
  regularChestGradeWeights,
  regularChestTypeWeightsByGrade,
  type MiracleConsolationReward,
  type RegularChestRewardType,
} from '../config/lootTables';
import { getSkinIdsForCategory, getMiracleCatSkinIds, type SkinCategory } from '../data/skinPools';
import { isDefaultOwnedSkin } from '../data/profileCatalog';
import { getChestPoolTitles, getMiracleChestTitles } from '../data/titles';
import { getChestLuckBonusPercent } from './catStats';
import type { ChestRollState } from './chestLoot';
import type { Grade } from './grade';
import { canReceiveSpareChestKey } from './spareChestKey';

export type DropChanceRewardType =
  | RegularChestRewardType
  | MiracleConsolationReward;

export interface DropChanceRow {
  rewardType: DropChanceRewardType;
  percent: number;
  grade?: Grade;
  exhausted?: boolean;
}

export interface ChestDropPreview {
  rows: DropChanceRow[];
  luckBonusPercent: number;
  domovoiLuckPercent: number;
  luckCoinsBonusPercent: number;
  luckCoins: number;
}

const FRAGMENT_SPIRIT_IDS = Object.keys(fragmentRequirements) as SpiritId[];

const SKIN_CATEGORY_BY_TYPE: Partial<Record<RegularChestRewardType, SkinCategory>> = {
  cat_skin: 'cat',
  brownie_skin: 'brownie',
  izba_skin: 'izba',
  window_skin: 'window',
};

const TITLE_GRADE_BY_TYPE: Record<string, Grade> = {
  title_common: 'common',
  title_rare: 'rare',
  title_epic: 'epic',
};

function isSkinOwned(skinId: string, owned: string[]): boolean {
  return owned.includes(skinId) || isDefaultOwnedSkin(skinId);
}

function hasLockedFragmentTarget(state: ChestRollState): boolean {
  return FRAGMENT_SPIRIT_IDS.some((id) => state.spiritStatuses[id] === 'locked');
}

function hasAvailableEpochSkin(state: ChestRollState): boolean {
  for (const category of ['cat', 'brownie', 'izba', 'window'] as SkinCategory[]) {
    const pool = getSkinIdsForCategory(category, 'epoch');
    if (pool.some((id) => !isSkinOwned(id, state.ownedSkinIds))) {
      return true;
    }
  }
  return false;
}

function getEffectiveTypeWeight(
  rewardType: RegularChestRewardType,
  grade: Grade,
  state: ChestRollState,
): number {
  const baseWeight = regularChestTypeWeightsByGrade[grade][rewardType] ?? 0;
  if (!baseWeight) return 0;

  if (rewardType === 'energy_bonus' || rewardType === 'obereg') {
    return baseWeight;
  }

  if (rewardType === 'spirit_key') {
    const locked = miracleSpiritKeyTargets.filter(
      (id) => state.spiritStatuses[id] === 'locked',
    );
    return locked.length ? baseWeight : 0;
  }

  const titleGrade = TITLE_GRADE_BY_TYPE[rewardType];
  if (titleGrade) {
    const pool = getChestPoolTitles().filter((t) => t.grade === titleGrade);
    const available = pool.filter((t) => !state.ownedTitleIds.includes(t.id));
    return available.length ? baseWeight : 0;
  }

  const skinCategory = SKIN_CATEGORY_BY_TYPE[rewardType];
  if (skinCategory) {
    const pool = getSkinIdsForCategory(skinCategory, grade);
    const available = pool.filter((id) => !isSkinOwned(id, state.ownedSkinIds));
    return available.length ? baseWeight : 0;
  }

  return baseWeight;
}

function getMiracleConsolationWeight(
  reward: MiracleConsolationReward,
  state: ChestRollState,
  now: number,
): number {
  const base = miracleConsolationWeights[reward];
  switch (reward) {
    case 'obereg_x2':
    case 'energy_full':
      return base;
    case 'chest_key':
      return canReceiveSpareChestKey(
        state.firstChestOpened ?? false,
        state.chestReadyAt ?? null,
        state.spareChestKeys ?? 0,
        now,
      )
        ? base
        : 0;
    case 'spirit_key': {
      const locked = miracleSpiritKeyTargets.filter(
        (id) => state.spiritStatuses[id] === 'locked',
      );
      return locked.length ? base : 0;
    }
    case 'title_epic': {
      const pool = getChestPoolTitles().filter((t) => t.grade === 'epic');
      const available = pool.filter((t) => !state.ownedTitleIds.includes(t.id));
      return available.length ? base : 0;
    }
    case 'title_epoch': {
      const pool = getMiracleChestTitles();
      const available = pool.filter((t) => !state.ownedTitleIds.includes(t.id));
      return available.length ? base : 0;
    }
    case 'cat_skin_epic': {
      const pool = getMiracleCatSkinIds('epic');
      const available = pool.filter((id) => !isSkinOwned(id, state.ownedSkinIds));
      return available.length ? base : 0;
    }
    case 'cat_skin_epoch': {
      const pool = getMiracleCatSkinIds('epoch');
      const available = pool.filter((id) => !isSkinOwned(id, state.ownedSkinIds));
      return available.length ? base : 0;
    }
    default:
      return base;
  }
}

function buildEpochPityRows(state: ChestRollState): DropChanceRow[] {
  const grade = 'epoch' as Grade;
  const typeWeights = regularChestTypeWeightsByGrade[grade];
  const effectiveEntries = Object.entries(typeWeights).map(([type, weight]) => {
    const effective = getEffectiveTypeWeight(
      type as RegularChestRewardType,
      grade,
      state,
    );
    const exhausted = weight > 0 && effective === 0;
    return {
      type: type as RegularChestRewardType,
      effective,
      exhausted,
      base: weight,
    };
  });
  const typeTotal = effectiveEntries.reduce((sum, e) => sum + e.effective, 0);

  const rows: DropChanceRow[] = [];
  for (const entry of effectiveEntries) {
    if (entry.base <= 0) continue;
    const typeProb = typeTotal > 0 ? entry.effective / typeTotal : 0;
    const percent = typeProb * 100;
    if (percent <= 0 && !entry.exhausted) continue;
    rows.push({
      rewardType: entry.type,
      percent,
      grade,
      exhausted: entry.exhausted,
    });
  }
  return rows;
}

export function getRegularChestDropPreview(
  state: ChestRollState,
  epochPityCounter: number = 0,
): ChestDropPreview {
  const luck = getChestLuckBonusPercent(state.domovoySkinId, state.luckCoins);
  const rows: DropChanceRow[] = [];

  const pityReady =
    epochPityCounter >= regularChest.epochPityEvery - 1 &&
    hasAvailableEpochSkin(state);

  if (pityReady) {
    return {
      rows: buildEpochPityRows(state),
      luckBonusPercent: luck.totalPercent,
      domovoiLuckPercent: luck.domovoiPercent,
      luckCoinsBonusPercent: luck.coinsPercent,
      luckCoins: state.luckCoins,
    };
  }

  const fragmentPoolSize = LOOT_POOL_TOTAL + regularChestExtraRolls.fragment;
  const fragmentChance = hasLockedFragmentTarget(state)
    ? regularChestExtraRolls.fragment / fragmentPoolSize
    : 0;
  const mainChance = 1 - fragmentChance;

  if (fragmentChance > 0) {
    rows.push({
      rewardType: 'fragment',
      percent: fragmentChance * 100,
      grade: 'epoch',
    });
  }

  const gradeWeights = applyChestGradeWeights(regularChestGradeWeights, {
    domovoySkinId: state.domovoySkinId,
    luckCoins: state.luckCoins,
  });
  const gradeTotal = Object.values(gradeWeights).reduce((sum, w) => sum + w, 0);

  for (const grade of Object.keys(regularChestTypeWeightsByGrade) as Grade[]) {
    const gradeProb = gradeWeights[grade] / gradeTotal;
    const typeWeights = regularChestTypeWeightsByGrade[grade];
    const effectiveEntries = Object.entries(typeWeights).map(([type, weight]) => {
      const effective = getEffectiveTypeWeight(
        type as RegularChestRewardType,
        grade,
        state,
      );
      const exhausted = weight > 0 && effective === 0;
      return {
        type: type as RegularChestRewardType,
        effective,
        exhausted,
        base: weight,
      };
    });
    const typeTotal = effectiveEntries.reduce((sum, e) => sum + e.effective, 0);

    for (const entry of effectiveEntries) {
      if (entry.base <= 0) continue;
      const typeProb = typeTotal > 0 ? entry.effective / typeTotal : 0;
      const percent = mainChance * gradeProb * typeProb * 100;
      if (percent <= 0 && !entry.exhausted) continue;
      rows.push({
        rewardType: entry.type,
        percent,
        grade,
        exhausted: entry.exhausted,
      });
    }
  }

  return {
    rows,
    luckBonusPercent: luck.totalPercent,
    domovoiLuckPercent: luck.domovoiPercent,
    luckCoinsBonusPercent: luck.coinsPercent,
    luckCoins: state.luckCoins,
  };
}

export function getMiracleChestDropPreview(
  state: ChestRollState,
  pityCounter: number,
  now: number = Date.now(),
): ChestDropPreview {
  const fragmentChance =
    pityCounter >= miracleChest.fragmentPityEvery - 1
      ? 1
      : miracleChest.fragmentChance;
  const consolationChance = 1 - fragmentChance;
  const rows: DropChanceRow[] = [];

  if (hasLockedFragmentTarget(state)) {
    rows.push({
      rewardType: 'fragment',
      percent: fragmentChance * 100,
      grade: 'epoch',
    });
  }

  const consolationEntries = (
    Object.keys(miracleConsolationWeights) as MiracleConsolationReward[]
  ).map((reward) => {
    const base = miracleConsolationWeights[reward];
    const effective = getMiracleConsolationWeight(reward, state, now);
    return {
      reward,
      effective,
      exhausted: base > 0 && effective === 0,
    };
  });
  const consolationTotal = consolationEntries.reduce((sum, e) => sum + e.effective, 0);

  for (const entry of consolationEntries) {
    const typeProb = consolationTotal > 0 ? entry.effective / consolationTotal : 0;
    const percent = consolationChance * typeProb * 100;
    if (percent <= 0 && !entry.exhausted) continue;
    rows.push({
      rewardType: entry.reward,
      percent,
      exhausted: entry.exhausted,
    });
  }

  return {
    rows,
    luckBonusPercent: 0,
    domovoiLuckPercent: 0,
    luckCoinsBonusPercent: 0,
    luckCoins: state.luckCoins,
  };
}

export function sumDropChancePercents(rows: DropChanceRow[]): number {
  return rows.reduce((sum, row) => sum + row.percent, 0);
}
