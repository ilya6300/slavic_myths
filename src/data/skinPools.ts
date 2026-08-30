import {
  catSkins,
  type BrownieSkinId,
  type HouseSkinId,
} from '../config/assetRegistry';
import type { Grade } from '../domain/grade';

const HOUSE_SKIN_GRADES: Record<HouseSkinId, Grade> = {
  hut_standart: 'common',
  hut_rate: 'rare',
  hut_epic: 'epic',
  hut_the_age_of_miracles: 'epoch',
};

const BROWNIE_SKIN_GRADES: Record<BrownieSkinId, Grade> = {
  brownie_standart: 'common',
  brownie_rate: 'rare',
  brownie_epic: 'epic',
  the_age_of_miracles_brownie: 'epoch',
};

export type SkinCategory = 'cat' | 'brownie' | 'izba' | 'window';

export function getCatSkinIdsByGrade(grade: Grade): string[] {
  return catSkins.filter((s) => s.grade === grade).map((s) => s.id);
}

export function getBrownieSkinIdsByGrade(grade: Grade): string[] {
  return (Object.entries(BROWNIE_SKIN_GRADES) as [BrownieSkinId, Grade][])
    .filter(([, g]) => g === grade)
    .map(([id]) => id);
}

export function getIzbaSkinIdsByGrade(grade: Grade): string[] {
  return (Object.entries(HOUSE_SKIN_GRADES) as [HouseSkinId, Grade][])
    .filter(([, g]) => g === grade)
    .map(([id]) => id);
}

export function getWindowSkinIdsByGrade(_grade: Grade): string[] {
  return [];
}

export function getSkinIdsForCategory(
  category: SkinCategory,
  grade: Grade,
): string[] {
  switch (category) {
    case 'cat':
      return getCatSkinIdsByGrade(grade);
    case 'brownie':
      return getBrownieSkinIdsByGrade(grade);
    case 'izba':
      return getIzbaSkinIdsByGrade(grade);
    case 'window':
      return getWindowSkinIdsByGrade(grade);
    default:
      return [];
  }
}

export function getSkinGrade(
  category: SkinCategory,
  skinId: string,
): Grade | null {
  if (category === 'cat') {
    return catSkins.find((s) => s.id === skinId)?.grade ?? null;
  }
  if (category === 'brownie') {
    return BROWNIE_SKIN_GRADES[skinId as BrownieSkinId] ?? null;
  }
  if (category === 'izba') {
    return HOUSE_SKIN_GRADES[skinId as HouseSkinId] ?? null;
  }
  return null;
}
