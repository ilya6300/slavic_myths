/**
 * Ролл и применение лута Сундука чудес.
 * Канон: loot_tables.md §«Сундук чудес», scenario.md §5.4
 */

import type { SpiritId } from '../config/assetRegistry';
import {
  duplicateHandling,
  fragmentRequirements,
  miracleSpiritKeyTargets,
  pickMiracleConsolation,
  rollFragmentMiracle,
  type MiracleConsolationReward,
} from '../config/lootTables';
import { getSkinIdsForCategory } from '../data/skinPools';
import { getChestPoolTitles, getMiracleChestTitles } from '../data/titles';
import {
  applyChestLoot,
  type ChestLootItem,
  type ChestLootPatch,
  type ChestRollState,
} from './chestLoot';
import type { GameSkins } from './GameSave';

export interface MiracleRollResult {
  loot: ChestLootItem;
  gotFragment: boolean;
  nextPityCounter: number;
}

const FRAGMENT_SPIRIT_IDS = Object.keys(fragmentRequirements) as SpiritId[];

const MAX_REROLL_ATTEMPTS = 12;

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

function pickUnowned<T extends string>(
  pool: T[],
  owned: string[],
  rng: () => number,
): T | null {
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

function resolveTitleDuplicate(rng: () => number): ChestLootItem {
  if (rng() < 0.5) {
    return {
      kind: 'consolation_obereg',
      wasDuplicate: true,
      itemId: String(duplicateHandling.duplicateTitleOberegBonus),
    };
  }
  return { kind: 'obereg', wasDuplicate: true };
}

function rollConsolationReward(
  state: ChestRollState,
  reward: MiracleConsolationReward,
  rng: () => number,
): ChestLootItem {
  switch (reward) {
    case 'obereg_x2':
      return { kind: 'obereg_x2' };
    case 'smetana_full':
      return { kind: 'smetana' };
    case 'regular_chest_key':
      return { kind: 'spare_chest_key' };
    case 'spirit_key': {
      const locked = miracleSpiritKeyTargets.filter(
        (id) => state.spiritStatuses[id] === 'locked',
      );
      if (!locked.length) {
        return { kind: 'obereg' };
      }
      const spiritId = locked[Math.floor(rng() * locked.length)]!;
      return { kind: 'spirit_key', itemId: spiritId };
    }
    case 'title_epic': {
      const pool = getChestPoolTitles().filter((t) => t.grade === 'epic');
      const titleId = pickUnowned(
        pool.map((t) => t.id),
        state.ownedTitleIds,
        rng,
      );
      if (!titleId) return resolveTitleDuplicate(rng);
      return { kind: 'title', itemId: titleId, grade: 'epic' };
    }
    case 'title_epoch': {
      const pool = getMiracleChestTitles();
      const titleId = pickUnowned(
        pool.map((t) => t.id),
        state.ownedTitleIds,
        rng,
      );
      if (!titleId) return resolveTitleDuplicate(rng);
      return { kind: 'title', itemId: titleId, grade: 'epoch' };
    }
    case 'izba_skin_epic': {
      const pool = getSkinIdsForCategory('izba', 'epic');
      const skinId = pickUnowned(pool, state.ownedSkinIds, rng);
      if (!skinId) return { kind: 'spare_chest_key', wasDuplicate: true };
      return { kind: 'izba_skin', itemId: skinId, grade: 'epic' };
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
    if (loot.kind === 'spirit_key' && loot.itemId) {
      if (state.spiritStatuses[loot.itemId] !== 'locked') continue;
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
    spareChestKeys: number;
    skins: GameSkins;
    firstChestOpened: boolean;
    chestReadyAt: number | null;
  },
  now: number = Date.now(),
): ChestLootPatch & { firstChestOpened?: boolean; chestReadyAt?: number | null } {
  if (loot.kind === 'spare_chest_key' && !loot.wasDuplicate) {
    if (
      state.firstChestOpened &&
      state.chestReadyAt != null &&
      state.chestReadyAt > now
    ) {
      return applyChestLoot(loot, state);
    }
    return {
      firstChestOpened: true,
      chestReadyAt: now,
    };
  }

  return applyChestLoot(loot, state);
}
