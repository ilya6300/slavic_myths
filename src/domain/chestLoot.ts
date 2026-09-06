/**

 * Ролл и применение лута обычного сундука (3 ч).

 * Канон: loot_tables.md, scenario.md §5.4, §6

 */



import type { SpiritId } from '../config/assetRegistry';

import { CHEST_ENERGY_BONUS } from '../config/gameConstants';

import {

  LOOT_POOL_TOTAL,

  regularChestExtraRolls,

  regularChestGradeWeights,

  regularChestTypeWeightsByGrade,

  pickRegularChestTypeForGrade,

  type RegularChestRewardType,

} from '../config/lootTables';

import { getChestPoolTitles } from '../data/titles';

import {

  getSkinIdsForCategory,

  type SkinCategory,

} from '../data/skinPools';

import { isDefaultOwnedSkin } from '../data/profileCatalog';

import { applyLuckToGradeWeights } from '../config/lootTables';

import type { Grade } from './grade';

import type { GameSkins, SpiritStatus } from './GameSave';

import { getBrownieLuckMultiplier } from './brownieLuck';

import { addRewardEnergy } from './rewardEnergy';

import { fragmentRequirements, miracleSpiritKeyTargets } from '../config/lootTables';
import { applyChestKeyReward } from './spareChestKey';



export type ChestLootKind =

  | 'cat_skin'

  | 'brownie_skin'

  | 'izba_skin'

  | 'window_skin'

  | 'title'

  | 'spirit_key'
  | 'chest_key'
  | 'energy'

  | 'obereg'

  | 'obereg_x2'

  | 'fragment';



export interface ChestLootItem {

  kind: ChestLootKind;

  itemId?: string;

  grade?: Grade;

  wasDuplicate?: boolean;

  energyAmount?: number;

}



export interface ChestRollState {

  ownedSkinIds: string[];

  ownedTitleIds: string[];

  spiritStatuses: Record<string, SpiritStatus>;

  fragmentCounts: Record<string, number>;

  selectedFragmentSpiritId: string | null;

  domovoySkinId: string;
  firstChestOpened?: boolean;
  chestReadyAt?: number | null;
  spareChestKeys?: number;
}



export interface ChestLootPatch {

  ownedSkinIds?: string[];

  ownedTitleIds?: string[];

  spiritStatuses?: Record<string, SpiritStatus>;

  fragmentCounts?: Record<string, number>;

  energy?: number;

  maxEnergy?: number;

  talismans?: number;

  skins?: GameSkins;
  chestReadyAt?: number | null;
  spareChestKeys?: number;
}



const FRAGMENT_SPIRIT_IDS = Object.keys(fragmentRequirements) as SpiritId[];



const TITLE_GRADE_BY_TYPE: Record<string, Grade> = {

  title_common: 'common',

  title_rare: 'rare',

  title_epic: 'epic',

};



const SKIN_CATEGORY_BY_TYPE: Partial<

  Record<RegularChestRewardType, SkinCategory>

> = {

  cat_skin: 'cat',

  brownie_skin: 'brownie',

  izba_skin: 'izba',

  window_skin: 'window',

};



const MAX_ROLL_ATTEMPTS = 24;



function pickWeightedGrade(

  weights: Record<Grade, number>,

  rng: () => number,

): Grade {

  const entries = Object.entries(weights) as [Grade, number][];

  const total = entries.reduce((sum, [, w]) => sum + w, 0);

  let roll = rng() * total;

  for (const [grade, weight] of entries) {

    roll -= weight;

    if (roll <= 0) return grade;

  }

  return entries[entries.length - 1]![0];

}



function isSkinOwned(skinId: string, owned: string[]): boolean {

  return owned.includes(skinId) || isDefaultOwnedSkin(skinId);

}



function pickUnownedSkin<T extends string>(

  pool: T[],

  owned: string[],

  rng: () => number,

): T | null {

  const available = pool.filter((id) => !isSkinOwned(id, owned));

  if (!available.length) return null;

  return available[Math.floor(rng() * available.length)]!;

}



function pickUnownedTitle(

  pool: string[],

  owned: string[],

  rng: () => number,

): string | null {

  const available = pool.filter((id) => !owned.includes(id));

  if (!available.length) return null;

  return available[Math.floor(rng() * available.length)]!;

}



function pickFragmentTarget(state: ChestRollState): SpiritId | null {

  const selected = state.selectedFragmentSpiritId as SpiritId | null;

  if (

    selected &&

    FRAGMENT_SPIRIT_IDS.includes(selected) &&

    state.spiritStatuses[selected] === 'locked'

  ) {

    return selected;

  }

  for (const id of FRAGMENT_SPIRIT_IDS) {

    if (state.spiritStatuses[id] === 'locked') return id;

  }

  return null;

}



function allFragmentSpiritsUnlocked(state: ChestRollState): boolean {

  return FRAGMENT_SPIRIT_IDS.every(

    (id) => state.spiritStatuses[id] !== 'locked',

  );

}



function rollExtraFragment(

  state: ChestRollState,

  rng: () => number,

): ChestLootItem | null {

  const extraTotal = regularChestExtraRolls.fragment;

  const poolSize = LOOT_POOL_TOTAL + extraTotal;

  const roll = rng() * poolSize;



  if (roll < LOOT_POOL_TOTAL) return null;

  if (allFragmentSpiritsUnlocked(state)) return null;



  const target = pickFragmentTarget(state);

  if (!target) return null;

  return { kind: 'fragment', itemId: target };

}



function rollTypeForGrade(

  grade: Grade,

  state: ChestRollState,

  rng: () => number,

): ChestLootItem | null {

  for (let attempt = 0; attempt < MAX_ROLL_ATTEMPTS; attempt++) {

    const rewardType = pickRegularChestTypeForGrade(grade, rng);

    if (!rewardType) continue;



    if (rewardType === 'energy_bonus') {

      return { kind: 'energy', energyAmount: CHEST_ENERGY_BONUS };

    }

    if (rewardType === 'obereg') {

      return { kind: 'obereg' };

    }

    if (rewardType === 'spirit_key') {

      const locked = miracleSpiritKeyTargets.filter(

        (id) => state.spiritStatuses[id] === 'locked',

      );

      if (!locked.length) continue;

      const spiritId = locked[Math.floor(rng() * locked.length)]!;

      return { kind: 'spirit_key', itemId: spiritId };

    }



    const titleGrade = TITLE_GRADE_BY_TYPE[rewardType];

    if (titleGrade) {

      const pool = getChestPoolTitles().filter((t) => t.grade === titleGrade);

      const titleId = pickUnownedTitle(

        pool.map((t) => t.id),

        state.ownedTitleIds,

        rng,

      );

      if (!titleId) continue;

      return { kind: 'title', itemId: titleId, grade: titleGrade };

    }



    const skinCategory = SKIN_CATEGORY_BY_TYPE[rewardType];

    if (skinCategory) {

      const pool = getSkinIdsForCategory(skinCategory, grade);

      const skinId = pickUnownedSkin(pool, state.ownedSkinIds, rng);

      if (!skinId) continue;

      const kind = `${skinCategory}_skin` as ChestLootKind;

      return { kind, itemId: skinId, grade };

    }

  }



  return { kind: 'obereg' };

}



export function rollRegularChestLoot(

  state: ChestRollState,

  rng: () => number = Math.random,

): ChestLootItem {

  const extra = rollExtraFragment(state, rng);

  if (extra) return extra;



  const luckMult = getBrownieLuckMultiplier(state.domovoySkinId);

  const weights = applyLuckToGradeWeights(

    regularChestGradeWeights,

    luckMult,

  );

  const grade = pickWeightedGrade(weights, rng);

  const result = rollTypeForGrade(grade, state, rng);

  return result ?? { kind: 'obereg' };

}



export function applyChestLoot(

  loot: ChestLootItem,

  state: ChestRollState & {

    energy: number;

    maxEnergy: number;

    talismans: number;

    skins: GameSkins;
    now?: number;

  },

): ChestLootPatch {

  const patch: ChestLootPatch = {};



  switch (loot.kind) {

    case 'cat_skin':

    case 'brownie_skin':

    case 'izba_skin':

    case 'window_skin': {

      if (!loot.itemId) break;

      patch.ownedSkinIds = [...state.ownedSkinIds, loot.itemId];

      break;

    }

    case 'title': {

      if (!loot.itemId) break;

      patch.ownedTitleIds = [...state.ownedTitleIds, loot.itemId];

      break;

    }

    case 'spirit_key': {

      if (!loot.itemId) break;

      patch.spiritStatuses = {

        ...state.spiritStatuses,

        [loot.itemId]: 'available',

      };

      break;

    }

    case 'chest_key': {
      const now = state.now ?? Date.now();
      const result = applyChestKeyReward(
        state.firstChestOpened ?? false,
        state.chestReadyAt ?? null,
        state.spareChestKeys ?? 0,
        now,
      );
      patch.chestReadyAt = result.chestReadyAt;
      patch.spareChestKeys = result.spareChestKeys;
      break;
    }

    case 'energy':

      patch.energy = addRewardEnergy(

        state.energy,

        loot.energyAmount ?? CHEST_ENERGY_BONUS,

      );

      break;

    case 'obereg':

      patch.talismans = state.talismans + 1;

      break;

    case 'obereg_x2':

      patch.talismans = state.talismans + 2;

      break;

    case 'fragment': {

      if (!loot.itemId) break;

      const prev = state.fragmentCounts[loot.itemId] ?? 0;

      patch.fragmentCounts = {

        ...state.fragmentCounts,

        [loot.itemId]: prev + 1,

      };

      break;

    }

    default:

      break;

  }



  return patch;

}



/** Для тестов: epoch-титулы не в пуле обычного сундука */

export function chestTitlePoolExcludesMiracleEpoch(): boolean {

  return getChestPoolTitles().every((t) => t.source === 'chest');

}



/** Для тестов: веса типов не содержат epoch-титулов */

export function chestTypePoolsExcludeEpochTitles(): boolean {

  for (const grade of Object.keys(regularChestTypeWeightsByGrade)) {

    const weights =

      regularChestTypeWeightsByGrade[grade as Grade];

    if ('title_epoch' in weights) return false;

  }

  return true;

}

