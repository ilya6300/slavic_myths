import { ENERGY_REGEN_PER_MINUTE, LUCK_COIN_GRADE_WEIGHT_BONUS_PER_COIN } from '../config/gameConstants';
import { getBrownieLuckBonusPercent } from './brownieLuck';

export interface CatStatsSnapshot {
  maxEnergy: number;
  energyRegenBonusPercent: number;
  luckCoins: number;
  luckCoinsCap: number;
  domovoySkinId: string;
  zhirdyayDefeatedCount: number;
  equippedCatSkinId: string;
}

export interface ChestLuckBonusBreakdown {
  totalPercent: number;
  domovoiPercent: number;
  coinsPercent: number;
}

/** Суммарный бонус к весу rare/epic/epoch: домовой + монеты × 0.05%. */
export function getChestLuckBonusPercent(
  domovoySkinId: string,
  luckCoins: number,
): ChestLuckBonusBreakdown {
  const domovoiPercent = getBrownieLuckBonusPercent(domovoySkinId);
  const coinsPercent = luckCoins * LUCK_COIN_GRADE_WEIGHT_BONUS_PER_COIN * 100;
  return {
    totalPercent: domovoiPercent + coinsPercent,
    domovoiPercent,
    coinsPercent,
  };
}

export function getEnergyRegenPerMinute(energyRegenBonusPercent: number): number {
  return ENERGY_REGEN_PER_MINUTE * (1 + energyRegenBonusPercent / 100);
}

export function buildCatStatsSnapshot(store: {
  maxEnergy: number;
  energyRegenBonusPercent: number;
  luckCoins: number;
  luckCoinsCap: number;
  skins: { domovoy: string; cat: string };
  zhirdyayDefeatedCount: number;
}): CatStatsSnapshot {
  return {
    maxEnergy: store.maxEnergy,
    energyRegenBonusPercent: store.energyRegenBonusPercent,
    luckCoins: store.luckCoins,
    luckCoinsCap: store.luckCoinsCap,
    domovoySkinId: store.skins.domovoy,
    zhirdyayDefeatedCount: store.zhirdyayDefeatedCount,
    equippedCatSkinId: store.skins.cat,
  };
}
