import {
  brownieSkins,
  catSkins,
  houseSkins,
  viewSkins,
  type BrownieSkinId,
  type HouseSkinId,
  type ViewSkinId,
} from '../config/assetRegistry';
import type { Grade } from '../domain/grade';
import { titles, type TitleDefinition } from './titles';

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

export function getProfileCatSkins(): ProfileSkinEntry[] {
  return catSkins.map((s) => ({
    id: s.id,
    category: 'cat',
    grade: s.grade,
    previewSrc: s.sit,
    label: s.id,
  }));
}

export function getProfileIzbaSkins(): ProfileSkinEntry[] {
  const grades: Record<HouseSkinId, Grade> = {
    hut_standart: 'common',
    hut_rate: 'rare',
    hut_epic: 'epic',
    hut_the_age_of_miracles: 'epoch',
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
    grade: 'common' as Grade,
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
