/**

 * Применение наград духов §5.5 scenario.md

 */



import {

  LUCK_COINS_CAP,

  START_ENERGY,

  START_MAX_ENERGY,

} from '../config/gameConstants';

import type { GameSkins } from './GameSave';

import type { SpiritReward } from '../data/spirits';

import { addRewardEnergy } from './rewardEnergy';



export interface RewardState {

  energy: number;

  maxEnergy: number;

  talismans: number;

  luckCoins: number;

  luckCoinsCapBonus: number;

  titleId: string | null;

  ownedTitleIds: string[];

  ownedSkinIds: string[];

  skins: GameSkins;

  trophiesUnlocked: string[];

  energyRegenBonusPercent: number;

  poludnicaCoinBonusPercent: number;

  rusalkaZhirdyayReductionPercent: number;

}



export type RewardPatch = Partial<RewardState>;



function addOwnedTitle(ids: string[], titleId: string): string[] {

  return ids.includes(titleId) ? ids : [...ids, titleId];

}



export function applySpiritReward(

  reward: SpiritReward,

  state: RewardState,

): RewardPatch {

  switch (reward.kind) {

    case 'domovoy_on_scene':

    case 'chest_appears':

      return {};



    case 'max_energy': {

      const bonus = reward.amount ?? 0;

      const maxEnergy = state.maxEnergy + bonus;

      return {

        maxEnergy,

        energy: Math.min(state.energy + bonus, maxEnergy),

      };

    }



    case 'obereg': {

      const amount = reward.amount ?? 1;

      return { talismans: state.talismans + amount };

    }



    case 'title_and_energy': {

      const titleId = reward.titleId!;

      const energyBonus = reward.amount ?? 0;

      return {

        ownedTitleIds: addOwnedTitle(state.ownedTitleIds, titleId),

        energy: addRewardEnergy(state.energy, energyBonus),

      };

    }



    case 'reward_energy': {

      const amount = reward.amount ?? 0;

      return { energy: addRewardEnergy(state.energy, amount) };

    }



    case 'regen_percent':

      return {

        energyRegenBonusPercent:

          state.energyRegenBonusPercent + (reward.percent ?? 0),

      };



    case 'title_only': {

      const titleId = reward.titleId!;

      return { ownedTitleIds: addOwnedTitle(state.ownedTitleIds, titleId) };

    }



    case 'luck_cap_and_title': {

      const titleId = reward.titleId!;

      const capBonus = reward.amount ?? 0;

      const newCap = LUCK_COINS_CAP + capBonus;

      return {

        ownedTitleIds: addOwnedTitle(state.ownedTitleIds, titleId),

        luckCoinsCapBonus: state.luckCoinsCapBonus + capBonus,

        luckCoins: Math.min(state.luckCoins, newCap),

      };

    }



    case 'day_coin_bonus':

      return {

        poludnicaCoinBonusPercent: reward.percent ?? 0,

      };



    case 'night_zhirdyay_reduction':

      return {

        rusalkaZhirdyayReductionPercent: reward.percent ?? 0,

      };



    default:

      return {};

  }

}



export function createRewardStateFromStore(store: {

  energy: number;

  maxEnergy: number;

  talismans: number;

  luckCoins: number;

  luckCoinsCapBonus: number;

  titleId: string | null;

  ownedTitleIds: string[];

  ownedSkinIds: string[];

  skins: GameSkins;

  trophiesUnlocked: string[];

  energyRegenBonusPercent: number;

  poludnicaCoinBonusPercent: number;

  rusalkaZhirdyayReductionPercent: number;

}): RewardState {

  return {

    energy: store.energy,

    maxEnergy: store.maxEnergy,

    talismans: store.talismans,

    luckCoins: store.luckCoins,

    luckCoinsCapBonus: store.luckCoinsCapBonus,

    titleId: store.titleId,

    ownedTitleIds: [...store.ownedTitleIds],

    ownedSkinIds: [...store.ownedSkinIds],

    skins: { ...store.skins },

    trophiesUnlocked: [...store.trophiesUnlocked],

    energyRegenBonusPercent: store.energyRegenBonusPercent,

    poludnicaCoinBonusPercent: store.poludnicaCoinBonusPercent,

    rusalkaZhirdyayReductionPercent: store.rusalkaZhirdyayReductionPercent,

  };

}



export function getDefaultRewardState(): RewardState {

  return {

    energy: START_ENERGY,

    maxEnergy: START_MAX_ENERGY,

    talismans: 3,

    luckCoins: 0,

    luckCoinsCapBonus: 0,

    titleId: 'novenkiy',

    ownedTitleIds: ['novenkiy'],

    ownedSkinIds: [],

    skins: {

      cat: 'cat_standart',

      domovoy: 'brownie_standart',

      izba: 'hut_standart',

      window: 'landscape_standart',

    },

    trophiesUnlocked: [],

    energyRegenBonusPercent: 0,

    poludnicaCoinBonusPercent: 0,

    rusalkaZhirdyayReductionPercent: 0,

  };

}

