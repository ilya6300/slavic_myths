import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { furniture } from '../../config/assetRegistry';
import { settingsUiContent } from '../../data/dialogContent';
import { resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { gameStore } from '../../store/GameStore';
import { chestUiStore } from '../../store/chestUiStore';
import { formatCooldownMs } from './formatCooldown';

export const ChestCooldownModal = observer(function ChestCooldownModal() {
  const { locale } = useLocale();
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    if (!chestUiStore.cooldownOpen) return;

    const tick = () => {
      const ms = gameStore.getChestCooldownRemainingMs();
      setRemainingMs(ms);
      if (ms <= 0) {
        chestUiStore.closeCooldown();
      }
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [chestUiStore.cooldownOpen, gameStore.chestReadyAt]);

  if (!chestUiStore.cooldownOpen) return null;

  const handleHurry = () => {
    gameStore.skipChestCooldownWithRewarded();
  };

  const handleClose = () => {
    chestUiStore.closeCooldown();
  };

  return (
    <div className="chest-modal chest-modal--cooldown" role="dialog" aria-modal="true">
      <div
        className="chest-modal__backdrop"
        aria-hidden
        onClick={handleClose}
      />
      <div className="chest-modal__panel">
        <h2 className="chest-modal__title">
          {resolveText(settingsUiContent.chestCooldown, locale)}
        </h2>

        <div className="chest-modal__reward">
          <img
            className="chest-modal__chest-closed"
            src={furniture.boxClosed}
            alt=""
            draggable={false}
          />
          <p className="chest-modal__timer chest-modal__timer--large">
            {formatCooldownMs(remainingMs)}
          </p>
        </div>

        <div className="chest-modal__cooldown">
          <button
            type="button"
            className="chest-modal__hurry"
            onClick={handleHurry}
          >
            {resolveText(settingsUiContent.chestHurryLuck, locale)}
          </button>
        </div>

        <button
          type="button"
          className="chest-modal__take"
          onClick={handleClose}
        >
          {resolveText(settingsUiContent.chestLootTake, locale)}
        </button>
      </div>
    </div>
  );
});
