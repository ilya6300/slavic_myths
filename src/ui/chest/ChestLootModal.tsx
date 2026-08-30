import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import {
  furniture,
  getCatSkinById,
  gradeFrames,
  type SpiritId,
} from '../../config/assetRegistry';
import { settingsUiContent } from '../../data/dialogContent';
import { resolveTitleName } from '../../data/titleContent';
import { getTitleById } from '../../data/titles';
import { getSpiritById } from '../../data/spirits';
import type { ChestLootItem } from '../../domain/chestLoot';
import { resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { gameStore } from '../../store/GameStore';
import { chestUiStore } from '../../store/chestUiStore';
import { formatCooldownMs } from './formatCooldown';

function resolveLootLabel(
  loot: ChestLootItem,
  locale: Parameters<typeof resolveText>[1],
): string {
  const dup = loot.wasDuplicate
    ? ` (${resolveText(settingsUiContent.chestDuplicate, locale)})`
    : '';

  switch (loot.kind) {
    case 'cat_skin': {
      const skin = loot.itemId ? getCatSkinById(loot.itemId) : null;
      return `${resolveText(settingsUiContent.chestRewardCatSkin, locale)}: ${skin?.id ?? loot.itemId ?? ''}${dup}`;
    }
    case 'brownie_skin':
      return `${resolveText(settingsUiContent.chestRewardBrownieSkin, locale)}: ${loot.itemId ?? ''}${dup}`;
    case 'izba_skin':
      return `${resolveText(settingsUiContent.chestRewardIzbaSkin, locale)}: ${loot.itemId ?? ''}${dup}`;
    case 'window_skin':
      return `${resolveText(settingsUiContent.chestRewardWindowSkin, locale)}: ${loot.itemId ?? ''}${dup}`;
    case 'title': {
      const title = loot.itemId ? getTitleById(loot.itemId) : null;
      return `${resolveText(settingsUiContent.chestRewardTitle, locale)}: ${title ? resolveTitleName(title, locale) : loot.itemId ?? ''}${dup}`;
    }
    case 'spirit_key': {
      const spirit = loot.itemId
        ? getSpiritById(loot.itemId as SpiritId)
        : null;
      return `${resolveText(settingsUiContent.chestRewardSpiritKey, locale)}: ${spirit?.name ?? loot.itemId ?? ''}`;
    }
    case 'smetana':
      return resolveText(settingsUiContent.chestRewardSmetana, locale);
    case 'obereg':
      return resolveText(settingsUiContent.chestRewardObereg, locale);
    case 'obereg_x2':
      return resolveText(settingsUiContent.chestRewardOberegX2, locale);
    case 'fragment': {
      const spirit = loot.itemId
        ? getSpiritById(loot.itemId as SpiritId)
        : null;
      return `${resolveText(settingsUiContent.chestRewardFragment, locale)}: ${spirit?.name ?? loot.itemId ?? ''}${dup}`;
    }
    case 'spare_chest_key':
      return resolveText(settingsUiContent.chestRewardSpareKey, locale);
    case 'consolation_energy':
      return resolveText(settingsUiContent.chestRewardEnergy, locale);
    case 'consolation_obereg':
      return resolveText(settingsUiContent.chestRewardOberegFallback, locale);
    default:
      return '';
  }
}

export const ChestLootModal = observer(function ChestLootModal() {
  const { locale } = useLocale();
  const loot = chestUiStore.lastLoot;
  const isMiracle = chestUiStore.source === 'miracle';
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    if (!chestUiStore.isOpen || isMiracle) return;
    const tick = () => {
      setRemainingMs(gameStore.getChestCooldownRemainingMs());
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [chestUiStore.isOpen, gameStore.chestReadyAt]);

  if (!chestUiStore.isOpen || !loot) return null;

  const grade = loot.grade ?? (loot.kind === 'fragment' ? 'epoch' : 'common');
  const frameSrc = gradeFrames[grade];
  const showHurry = !isMiracle && remainingMs > 0;
  const chestOpenSrc = isMiracle ? furniture.miracleChestOpen : furniture.boxOpen;

  const handleTake = () => {
    gameStore.dismissChestLoot();
  };

  const handleHurry = () => {
    gameStore.skipChestCooldownWithRewarded();
  };

  return (
    <div className={`chest-modal${isMiracle ? ' chest-modal--miracle' : ''}`} role="dialog" aria-modal="true">
      <div className="chest-modal__backdrop" aria-hidden />
      <div className="chest-modal__panel">
        <h2 className="chest-modal__title">
          {resolveText(
            isMiracle
              ? settingsUiContent.miracleLootTitle
              : settingsUiContent.chestLootTitle,
            locale,
          )}
        </h2>

        <div className="chest-modal__reward">
          <div className="chest-modal__frame-wrap">
            <img
              className="chest-modal__frame"
              src={frameSrc}
              alt=""
              draggable={false}
            />
            <img
              className={`chest-modal__chest-open${isMiracle ? ' chest-modal__chest-open--miracle' : ''}`}
              src={chestOpenSrc}
              alt=""
              draggable={false}
            />
          </div>
          <p className="chest-modal__loot-text">{resolveLootLabel(loot, locale)}</p>
        </div>

        {showHurry && (
          <div className="chest-modal__cooldown">
            <p className="chest-modal__timer">
              {resolveText(settingsUiContent.chestCooldown, locale)}:{' '}
              {formatCooldownMs(remainingMs)}
            </p>
            <button
              type="button"
              className="chest-modal__hurry"
              onClick={handleHurry}
            >
              {resolveText(settingsUiContent.chestHurryLuck, locale)}
            </button>
          </div>
        )}

        <button
          type="button"
          className="chest-modal__take"
          onClick={handleTake}
        >
          {resolveText(
            isMiracle
              ? settingsUiContent.miracleLootTake
              : settingsUiContent.chestLootTake,
            locale,
          )}
        </button>
      </div>
    </div>
  );
});
