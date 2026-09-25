/**
 * Снимает legacy DEV-сиды из localStorage (bootstrap больше не сидит).
 * Канон владения: defaults + награды квестов + IAP + сундук (кот/домовой).
 */

import {
  DEFAULT_BROWNIE_SKIN,
  DEFAULT_CAT_SKIN_ID,
  DEFAULT_HOUSE_SKIN,
  DEFAULT_VIEW_SKIN,
  houseSkins,
  viewSkins,
  type HouseSkinId,
  type ViewSkinId,
} from '../config/assetRegistry';
import { STARTER_PACK_CAT_SKIN_ID } from '../config/gameConstants';
import { isDefaultOwnedSkin } from '../data/profileCatalog';
import type { GameSave, SpiritStatus } from './GameSave';

const LEGACY_DEV_BULK_HOUSE_IDS = (
  Object.keys(houseSkins) as HouseSkinId[]
).filter((id) => id !== DEFAULT_HOUSE_SKIN);

const LEGACY_DEV_BULK_VIEW_IDS = (
  Object.keys(viewSkins) as ViewSkinId[]
).filter((id) => id !== DEFAULT_VIEW_SKIN);

/** Бывший DEV: все избы/леса кроме стандартных разом. */
export function isLegacyDevBulkIzbaWindowUnlock(ownedSkinIds: string[]): boolean {
  const owned = new Set(ownedSkinIds);
  return (
    LEGACY_DEV_BULK_HOUSE_IDS.every((id) => owned.has(id)) &&
    LEGACY_DEV_BULK_VIEW_IDS.every((id) => owned.has(id))
  );
}

function questRewardSkinIds(
  spiritStatuses: Record<string, SpiritStatus>,
): string[] {
  const ids: string[] = [];
  if (spiritStatuses.baba_yaga === 'defeated') {
    ids.push('landscape_yaga');
  }
  if (spiritStatuses.lada === 'defeated') {
    ids.push('hut_harmony');
  }
  return ids;
}

function keepCatBrownieChestSkins(ownedSkinIds: string[]): string[] {
  return ownedSkinIds.filter((id) => {
    if (isDefaultOwnedSkin(id)) return false;
    if (id.startsWith('cat_') || id.startsWith('brownie_')) return true;
    return false;
  });
}

export interface LegacyDevMetaStripInput {
  ownedSkinIds: string[];
  truthCrumbs: number;
  spiritStatuses: Record<string, SpiritStatus>;
  starterPackPurchased: boolean;
  skins: GameSave['skins'];
}

export interface LegacyDevMetaStripResult {
  ownedSkinIds: string[];
  truthCrumbs: number;
  skins: GameSave['skins'];
  changed: boolean;
}

export function stripLegacyDevMetaSeed(
  input: LegacyDevMetaStripInput,
): LegacyDevMetaStripResult {
  if (!isLegacyDevBulkIzbaWindowUnlock(input.ownedSkinIds)) {
    return {
      ownedSkinIds: input.ownedSkinIds,
      truthCrumbs: input.truthCrumbs,
      skins: input.skins,
      changed: false,
    };
  }

  const nextOwned = new Set<string>();
  for (const id of input.ownedSkinIds) {
    if (isDefaultOwnedSkin(id)) nextOwned.add(id);
  }
  for (const id of questRewardSkinIds(input.spiritStatuses)) {
    nextOwned.add(id);
  }
  if (input.starterPackPurchased) {
    nextOwned.add(STARTER_PACK_CAT_SKIN_ID);
  }
  for (const id of keepCatBrownieChestSkins(input.ownedSkinIds)) {
    nextOwned.add(id);
  }

  const ownedSkinIds = [...nextOwned];
  const skins = { ...input.skins };
  if (!ownedSkinIds.includes(skins.izba)) {
    skins.izba = DEFAULT_HOUSE_SKIN;
  }
  if (!ownedSkinIds.includes(skins.window)) {
    skins.window = DEFAULT_VIEW_SKIN;
  }
  if (!ownedSkinIds.includes(skins.cat)) {
    skins.cat = DEFAULT_CAT_SKIN_ID;
  }
  if (!ownedSkinIds.includes(skins.domovoy)) {
    skins.domovoy = DEFAULT_BROWNIE_SKIN;
  }

  const truthCrumbs = 0;

  const changed =
    truthCrumbs !== input.truthCrumbs ||
    ownedSkinIds.length !== input.ownedSkinIds.length ||
    !ownedSkinIds.every((id) => input.ownedSkinIds.includes(id)) ||
    skins.izba !== input.skins.izba ||
    skins.window !== input.skins.window ||
    skins.cat !== input.skins.cat ||
    skins.domovoy !== input.skins.domovoy;

  return { ownedSkinIds, truthCrumbs, skins, changed };
}
