import type { Grade } from './grade';
import { BROWNIE_LUCK_BY_SKIN_GRADE } from '../config/gameConstants';
import type { BrownieSkinId } from '../config/assetRegistry';

const BROWNIE_SKIN_GRADE: Record<BrownieSkinId, Grade> = {
  brownie_standart: 'common',
  brownie_rate: 'rare',
  brownie_epic: 'epic',
  the_age_of_miracles_brownie: 'epoch',
};

/** Бонус к весам rare+ в обычном сундуке (%), канон: +1/+2/+3/+5%. */
export function getBrownieLuckBonusPercent(domovoySkinId: string): number {
  const grade = BROWNIE_SKIN_GRADE[domovoySkinId as BrownieSkinId] ?? 'common';
  return BROWNIE_LUCK_BY_SKIN_GRADE[grade] ?? BROWNIE_LUCK_BY_SKIN_GRADE.common;
}

export function getBrownieLuckMultiplier(domovoySkinId: string): number {
  return getBrownieLuckBonusPercent(domovoySkinId) / 100;
}
