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

  if (save.version < 4) {
    const completed = save.completedSpirits ?? [];

    if (
      completed.includes('poludnica') &&
      (save.poludnicaCoinBonusPercent ?? 0) > 0
    ) {
      save.maxEnergy = (save.maxEnergy ?? 120) + 15;
      save.energy = Math.min((save.energy ?? 0) + 15, save.maxEnergy);
      save.poludnicaCoinBonusPercent = 0;
    }

    if (completed.includes('rusalka')) {
      let owned = [...(save.ownedTitleIds ?? ['novenkiy'])];
      owned = owned.map((id) =>
        id === 'lunnyy_slushatel' ? 'kot_u_berega' : id,
      );
      if (!owned.includes('kot_u_berega')) {
        owned.push('kot_u_berega');
      }
      save.ownedTitleIds = owned;
      if (save.titleId === 'lunnyy_slushatel') {
        save.titleId = 'kot_u_berega';
      }
      save.rusalkaZhirdyayReductionPercent = 0;
    }

    save.version = 4;
  }

  if (save.version < 5) {
    if (save.spiritStatuses?.baba_yaga === 'defeated') {
      const owned = [...(save.ownedSkinIds ?? [])];
      if (!owned.includes('landscape_yaga')) {
        owned.push('landscape_yaga');
      }
      save.ownedSkinIds = owned;
    }
    save.version = 5;
  }

  if (save.version < 6) {
    if (save.spiritStatuses?.lada === 'defeated') {
      const owned = [...(save.ownedSkinIds ?? [])];
      if (!owned.includes('hut_harmony')) {
        owned.push('hut_harmony');
      }
      save.ownedSkinIds = owned;
    }
    save.version = 6;
  }

  if (save.version < 7) {
    save.zhirdyayDefeatedCount = save.zhirdyayDefeatedCount ?? 0;
    save.version = 7;
  }

  if (save.version < 8) {
    save.regularChestEpochPityCounter = save.regularChestEpochPityCounter ?? 0;
    save.version = 8;
  }

  if (save.version < 9) {
    save.starterPackPurchased = save.starterPackPurchased ?? false;
    save.yardGrass = save.yardGrass ?? 0;
    save.yardOberegCraftedDayId = save.yardOberegCraftedDayId ?? null;
    save.yardGrassSpawnDayId = save.yardGrassSpawnDayId ?? null;
    save.version = 9;
  }

  save.version = SAVE_VERSION;

  return save;

}

