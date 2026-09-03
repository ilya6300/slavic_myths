import type { GameSave } from '../domain/GameSave';

import {

  DEFAULT_BROWNIE_SKIN,

  DEFAULT_CAT_SKIN_ID,

  DEFAULT_HOUSE_SKIN,

  DEFAULT_VIEW_SKIN,

} from '../config/assetRegistry';

import { SAVE_VERSION } from '../config/gameConstants';



const DEFAULT_OWNED_SKINS = [

  DEFAULT_CAT_SKIN_ID,

  DEFAULT_BROWNIE_SKIN,

  DEFAULT_HOUSE_SKIN,

  DEFAULT_VIEW_SKIN,

] as const;



type LegacySave = GameSave & {

  smetanaCount?: number;

  spareChestKeys?: number;

};



/** Миграции схемы GameSave при загрузке */

export function migrateSave(raw: GameSave): GameSave {

  let save = { ...raw } as LegacySave;



  if (save.version < 1) {

    save.version = 1;

  }



  if (save.version === 1) {

    save.energyRegenBonusPercent = save.energyRegenBonusPercent ?? 0;

    save.poludnicaCoinBonusPercent = save.poludnicaCoinBonusPercent ?? 0;

    save.rusalkaZhirdyayReductionPercent = save.rusalkaZhirdyayReductionPercent ?? 0;

    save.luckCoinsCapBonus = save.luckCoinsCapBonus ?? 0;

    save.zhirdyayActive = save.zhirdyayActive ?? false;

    save.zhirdyayClickProgress = save.zhirdyayClickProgress ?? 0;

    save.zhirdyayClicksRequired = save.zhirdyayClicksRequired ?? 0;

    save.fragmentVictoryBonusGranted = save.fragmentVictoryBonusGranted ?? [];

    save.cloudBannerDismissed = save.cloudBannerDismissed ?? false;

    save.lastSusedkoStealAt = save.lastSusedkoStealAt ?? null;

    save.illustrationRevealed = save.illustrationRevealed ?? [];

  }



  if (save.version < 2) {

    delete save.smetanaCount;

    delete save.spareChestKeys;

    save.ownedSkinIds = [

      ...new Set([...DEFAULT_OWNED_SKINS, ...(save.ownedSkinIds ?? [])]),

    ];

    save.version = 2;

  }



  if (save.version < 3) {
    if (save.maxEnergy <= 100) {
      save.maxEnergy = 120;
      save.energy = Math.min(save.energy + 20, 120);
    }
    save.dailyFindClaimedDayId = save.dailyFindClaimedDayId ?? null;
    save.folktaleIntroShown = save.folktaleIntroShown ?? false;
    save.version = 3;
  }

  save.version = SAVE_VERSION;

  return save;

}

