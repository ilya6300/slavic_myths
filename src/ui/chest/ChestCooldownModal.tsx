import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { furniture } from '../../config/assetRegistry';
import { settingsUiContent } from '../../data/dialogContent';
import { resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { gameStore } from '../../store/GameStore';
import { chestUiStore } from '../../store/chestUiStore';
import { ModalCloseButton } from '../common/ModalCloseButton';
import { WoodQuestButton } from '../common/WoodQuestButton';
import { ChestDropChancesPanel, ChestDropChancesToggle } from './ChestDropChancesPanel';
import { formatCooldownMs } from './formatCooldown';

export const ChestCooldownModal = observer(function ChestCooldownModal() {
  const { locale } = useLocale();
  const [remainingMs, setRemainingMs] = useState(0);
  const [dropsExpanded, setDropsExpanded] = useState(false);

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

  const cooldownLabel = resolveText(settingsUiContent.chestCooldown, locale);

  return (
    <div
      className="game-modal chest-modal chest-modal--cooldown layer-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chest-cooldown-time"
    >
      <div
        className="game-modal__backdrop"
        aria-hidden
        onClick={handleClose}
      />
      <div className="game-modal__panel chest-modal__panel">
        <ModalCloseButton onClick={handleClose} />
        <div
          className="game-modal__scene game-modal__scene--plain chest-modal__scene chest-modal__scene--cooldown"
        >
          <img
            className="chest-modal__chest-closed"
            src={furniture.boxClosed}
            alt=""
            draggable={false}
          />
        </div>

        <div className="chest-modal__cooldown-hero">
          <p className="chest-modal__cooldown-label">{cooldownLabel}</p>
          <p
            id="chest-cooldown-time"
            className="chest-modal__cooldown-time chest-modal__timer--large"
          >
            {formatCooldownMs(remainingMs)}
          </p>
        </div>

        <div className="chest-modal__drops-section">
          <ChestDropChancesToggle
            expanded={dropsExpanded}
            onToggle={() => setDropsExpanded((v) => !v)}
          />
          {dropsExpanded && (
            <ChestDropChancesPanel preview={gameStore.getChestDropPreview('regular')} />
          )}
        </div>

        {gameStore.canSkipChestCooldownWithRewarded() && (
          <WoodQuestButton
            className="chest-modal__hurry"
            label={resolveText(settingsUiContent.chestHurryLuck, locale)}
            onClick={handleHurry}
          />
        )}
      </div>
    </div>
  );
});
