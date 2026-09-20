/**

 * Ролл и применение лута Сундука чудес.

 * Канон: loot_tables.md §«Сундук чудес», scenario.md §5.4

 */



import type { SpiritId } from '../config/assetRegistry';

import { CHEST_ENERGY_X2_BONUS } from '../config/gameConstants';

import {

  fragmentRequirements,

  miracleSpiritKeyTargets,

  pickMiracleConsolation,

  rollFragmentMiracle,

  type MiracleConsolationReward,

} from '../config/lootTables';

import { canReceiveSpareChestKey } from './spareChestKey';

import { getMiracleCatSkinIds } from '../data/skinPools';
import { getChestPoolTitles, getMiracleChestTitles } from '../data/titles';

import {

  applyChestLoot,

  type ChestLootItem,

  type ChestLootPatch,

  type ChestRollState,

} from './chestLoot';
import { pickFragmentDropTarget } from './fragmentDrop';

import type { GameSkins } from './GameSave';



export interface MiracleRollResult {

  loot: ChestLootItem;

  gotFragment: boolean;

  nextPityCounter: number;

}



const FRAGMENT_SPIRIT_IDS = Object.keys(fragmentRequirements) as SpiritId[];



const MAX_REROLL_ATTEMPTS = 24;



function pickFragmentTarget(state: ChestRollState): SpiritId | null {
  return pickFragmentDropTarget(state.spiritStatuses, state.fragmentCounts);
}



function allFragmentSpiritsUnlocked(state: ChestRollState): boolean {

  return FRAGMENT_SPIRIT_IDS.every(

    (id) => state.spiritStatuses[id] !== 'locked',

  );

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

function pickUnownedSkin(
  pool: string[],
  owned: string[],
  rng: () => number,
): string | null {
  const available = pool.filter((id) => !owned.includes(id));
  if (!available.length) return null;
  return available[Math.floor(rng() * available.length)]!;
}



function rollFragmentLoot(

  state: ChestRollState,

): ChestLootItem | null {

  if (allFragmentSpiritsUnlocked(state)) return null;

  const target = pickFragmentTarget(state);

  if (!target) return null;

  return { kind: 'fragment', itemId: target };

}



function rollConsolationReward(

  state: ChestRollState,

  reward: MiracleConsolationReward,

  rng: () => number,

): ChestLootItem | null {

  switch (reward) {

    case 'obereg_x2':

      return { kind: 'obereg_x2' };

    case 'energy_full':

      return { kind: 'energy', energyAmount: CHEST_ENERGY_X2_BONUS };

    case 'chest_key':

      return { kind: 'chest_key' };

    case 'spirit_key': {

      const locked = miracleSpiritKeyTargets.filter(

        (id) => state.spiritStatuses[id] === 'locked',

      );

      if (!locked.length) return null;

      const spiritId = locked[Math.floor(rng() * locked.length)]!;

      return { kind: 'spirit_key', itemId: spiritId };

    }

    case 'title_epic': {

      const pool = getChestPoolTitles().filter((t) => t.grade === 'epic');

      const titleId = pickUnownedTitle(

        pool.map((t) => t.id),

        state.ownedTitleIds,

        rng,

      );

      if (!titleId) return null;

      return { kind: 'title', itemId: titleId, grade: 'epic' };

    }

    case 'title_epoch': {
      const pool = getMiracleChestTitles();
      const titleId = pickUnownedTitle(
        pool.map((t) => t.id),
        state.ownedTitleIds,
        rng,
      );
      if (!titleId) return null;
      return { kind: 'title', itemId: titleId, grade: 'epoch' };
    }
    case 'cat_skin_epic': {
      const pool = getMiracleCatSkinIds('epic');
      const skinId = pickUnownedSkin(pool, state.ownedSkinIds, rng);
      if (!skinId) return null;
      return { kind: 'cat_skin', itemId: skinId, grade: 'epic' };
    }
    case 'cat_skin_epoch': {
      const pool = getMiracleCatSkinIds('epoch');
      const skinId = pickUnownedSkin(pool, state.ownedSkinIds, rng);
      if (!skinId) return null;
      return { kind: 'cat_skin', itemId: skinId, grade: 'epoch' };
    }
    default:

      return { kind: 'obereg' };

  }

}



function rollConsolationWithReroll(

  state: ChestRollState,

  rng: () => number,

): ChestLootItem {

  for (let attempt = 0; attempt < MAX_REROLL_ATTEMPTS; attempt++) {

    const reward = pickMiracleConsolation(rng);

    const loot = rollConsolationReward(state, reward, rng);

    if (!loot) continue;

    if (loot.kind === 'spirit_key' && loot.itemId) {

      if (state.spiritStatuses[loot.itemId] !== 'locked') continue;

    }

    if (loot.kind === 'chest_key') {
      if (
        !canReceiveSpareChestKey(
          state.firstChestOpened ?? false,
          state.chestReadyAt ?? null,
          state.spareChestKeys ?? 0,
          Date.now(),
        )
      ) {
        continue;
      }
    }

    return loot;

  }

  return { kind: 'obereg' };

}



export function rollMiracleChestLoot(

  state: ChestRollState,

  pityCounter: number,

  rng: () => number = Math.random,

): MiracleRollResult {

  const fragmentRoll = rollFragmentMiracle(pityCounter, rng);

  if (fragmentRoll) {

    const loot = rollFragmentLoot(state);

    if (loot) {

      return { loot, gotFragment: true, nextPityCounter: 0 };

    }

  }



  const loot = rollConsolationWithReroll(state, rng);

  return {

    loot,

    gotFragment: false,

    nextPityCounter: pityCounter + 1,

  };

}



export function applyMiracleChestLoot(

  loot: ChestLootItem,

  state: ChestRollState & {

    energy: number;

    maxEnergy: number;

    talismans: number;

    skins: GameSkins;
    now?: number;

  },

): ChestLootPatch {

  return applyChestLoot(loot, state);

}

