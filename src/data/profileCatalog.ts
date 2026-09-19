import {
  brownieSkins,
  catSkins,
  getCatSkinById,
  houseSkins,
  viewSkins,
  type BrownieSkinId,
  type HouseSkinId,
  type ViewSkinId,
} from '../config/assetRegistry';
import { STARTER_PACK_CAT_SKIN_ID } from '../config/gameConstants';
import type { Grade } from '../domain/grade';
import { getWindowSkinDisplayGrade } from './skinPools';
import { titles, type TitleDefinition } from './titles';

const GRADE_SORT_ORDER: Record<Grade, number> = {
  common: 0,
  rare: 1,
  epic: 2,
  epoch: 3,
};

function sortProfileSkinEntries(entries: ProfileSkinEntry[]): ProfileSkinEntry[] {
  return [...entries].sort((a, b) => {
    const byGrade = GRADE_SORT_ORDER[a.grade] - GRADE_SORT_ORDER[b.grade];
    if (byGrade !== 0) return byGrade;
    if (a.id === STARTER_PACK_CAT_SKIN_ID) return -1;
    if (b.id === STARTER_PACK_CAT_SKIN_ID) return 1;
    return a.id.localeCompare(b.id);
  });
}

function toProfileCatEntry(skin: (typeof catSkins)[number]): ProfileSkinEntry {
  return {
    id: skin.id,
    category: 'cat',
    grade: skin.grade,
    previewSrc: skin.sit,
    label: skin.id,
  };
}

export type ProfileSkinCategory = 'cat' | 'izba' | 'window' | 'brownie';

export interface ProfileSkinEntry {
  id: string;
  category: ProfileSkinCategory;
  grade: Grade;
  previewSrc: string;
  label: string;
}

const DEFAULT_OWNED_SKINS = new Set([
  'cat_standart',
  'brownie_standart',
  'hut_standart',
  'landscape_standart',
]);

export function isDefaultOwnedSkin(skinId: string): boolean {
  return DEFAULT_OWNED_SKINS.has(skinId);
}

/** Все скины кота в профиле, включая IAP «Путник» (не в сундуке). */
export function getProfileCatSkins(): ProfileSkinEntry[] {
  const byId = new Map<string, ProfileSkinEntry>();
  for (const s of catSkins) {
    byId.set(s.id, toProfileCatEntry(s));
  }
  const pilgrim = getCatSkinById(STARTER_PACK_CAT_SKIN_ID);
  if (pilgrim && !byId.has(STARTER_PACK_CAT_SKIN_ID)) {
    byId.set(STARTER_PACK_CAT_SKIN_ID, toProfileCatEntry(pilgrim));
  }
  return sortProfileSkinEntries([...byId.values()]);
}

export function getProfileIzbaSkins(): ProfileSkinEntry[] {
  const grades: Record<HouseSkinId, Grade> = {
    hut_standart: 'common',
    hut_rate: 'rare',
    hut_the_age_of_miracles: 'epoch',
    hut_harmony: 'epic',
    hut_cyberpank: 'epoch',
  };
  return (Object.keys(houseSkins) as HouseSkinId[]).map((id) => ({
    id,
    category: 'izba',
    grade: grades[id],
    previewSrc: houseSkins[id],
    label: id,
  }));
}

export function getProfileWindowSkins(): ProfileSkinEntry[] {
  return (Object.keys(viewSkins) as ViewSkinId[]).map((id) => ({
    id,
    category: 'window',
    grade: getWindowSkinDisplayGrade(id) ?? 'common',
    previewSrc: viewSkins[id],
    label: id,
  }));
}

export function getProfileBrownieSkins(): ProfileSkinEntry[] {
  const grades: Record<BrownieSkinId, Grade> = {
    brownie_standart: 'common',
    brownie_rate: 'rare',
    brownie_epic: 'epic',
    the_age_of_miracles_brownie: 'epoch',
  };
  return (Object.keys(brownieSkins) as BrownieSkinId[]).map((id) => ({
    id,
    category: 'brownie',
    grade: grades[id],
    previewSrc: brownieSkins[id],
    label: id,
  }));
}

export function getProfileSkinsForTab(
  tab: ProfileSkinCategory,
): ProfileSkinEntry[] {
  switch (tab) {
    case 'cat':
      return getProfileCatSkins();
    case 'izba':
      return getProfileIzbaSkins();
    case 'window':
      return getProfileWindowSkins();
    case 'brownie':
      return getProfileBrownieSkins();
    default:
      return [];
  }
}

export function getAllProfileTitles(): TitleDefinition[] {
  return titles;
}

export function skinStoreKey(category: ProfileSkinCategory): keyof import('../domain/GameSave').GameSkins {
  if (category === 'brownie') return 'domovoy';
  return category;
}
