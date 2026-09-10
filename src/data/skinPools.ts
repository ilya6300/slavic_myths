import {
  catSkins,
  type BrownieSkinId,
  type HouseSkinId,
  type ViewSkinId,
} from '../config/assetRegistry';
import type { Grade } from '../domain/grade';

const HOUSE_SKIN_GRADES: Record<HouseSkinId, Grade> = {
  hut_standart: 'common',
  hut_rate: 'rare',
  hut_epic: 'epic',
  hut_the_age_of_miracles: 'epoch',
  hut_harmony: 'epic',
};

const BROWNIE_SKIN_GRADES: Record<BrownieSkinId, Grade> = {
  brownie_standart: 'common',
  brownie_rate: 'rare',
  brownie_epic: 'epic',
  the_age_of_miracles_brownie: 'epoch',
};

/** Скины окна в регулярном сундуке (дефолт `landscape_standart` — только старт; `landscape_yaga` — только квест Яги). */
const WINDOW_SKIN_CHEST_GRADES: Record<
  Exclude<ViewSkinId, 'landscape_standart' | 'landscape_yaga'>,
  Grade[]
> = {
  landscape_temnyy_les: ['rare'],
  landscape_omut: ['common', 'epoch'],
  landscape_cyber_city: ['epoch'],
};

const WINDOW_SKIN_DISPLAY_GRADE: Record<ViewSkinId, Grade> = {
  landscape_standart: 'common',
  landscape_temnyy_les: 'rare',
  landscape_omut: 'common',
  landscape_cyber_city: 'epoch',
  landscape_yaga: 'epoch',
};

export type SkinCategory = 'cat' | 'brownie' | 'izba' | 'window';

/** Только IAP / квест — не в сундуке */
const CAT_SKIN_CHEST_EXCLUDED = new Set(['cat_pilgrim']);

export function getCatSkinIdsByGrade(grade: Grade): string[] {
  return catSkins
    .filter((s) => s.grade === grade && !CAT_SKIN_CHEST_EXCLUDED.has(s.id))
    .map((s) => s.id);
}

export function getBrownieSkinIdsByGrade(grade: Grade): string[] {
  return (Object.entries(BROWNIE_SKIN_GRADES) as [BrownieSkinId, Grade][])
    .filter(([, g]) => g === grade)
    .map(([id]) => id);
}

export function getIzbaSkinIdsByGrade(grade: Grade): string[] {
  return (Object.entries(HOUSE_SKIN_GRADES) as [HouseSkinId, Grade][])
    .filter(([id, g]) => g === grade && id !== 'hut_harmony')
    .map(([id]) => id);
}

export function getWindowSkinIdsByGrade(grade: Grade): string[] {
  return (
    Object.entries(WINDOW_SKIN_CHEST_GRADES) as [
      Exclude<ViewSkinId, 'landscape_standart'>,
      Grade[],
    ][]
  )
    .filter(([, grades]) => grades.includes(grade))
    .map(([id]) => id);
}

export function getWindowSkinDisplayGrade(skinId: string): Grade | null {
  return WINDOW_SKIN_DISPLAY_GRADE[skinId as ViewSkinId] ?? null;
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
  if (category === 'window') {
    return getWindowSkinDisplayGrade(skinId);
  }
  return null;
}
