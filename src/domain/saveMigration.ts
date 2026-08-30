import type { GameSave } from '../domain/GameSave';
import { SAVE_VERSION } from '../config/gameConstants';

/** Миграции схемы GameSave при загрузке */
export function migrateSave(raw: GameSave): GameSave {
  let save = { ...raw };

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
    return save;
  }

  // Будущие версии — добавлять ветки здесь
  save.version = SAVE_VERSION;
  return save;
}
