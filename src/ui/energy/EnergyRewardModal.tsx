import { observer } from 'mobx-react-lite';
import { getCatPoseUrl, hudIcons } from '../../config/assetRegistry';
import { REWARDED_ENERGY_BONUS } from '../../config/gameConstants';
import { settingsUiContent } from '../../data/dialogContent';
import { formatLocalizedTemplate, resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { gameStore } from '../../store/GameStore';
import { energyUiStore } from '../../store/energyUiStore';
import { ModalCloseButton } from '../common/ModalCloseButton';
import { WoodQuestButton } from '../common/WoodQuestButton';

export const EnergyRewardModal = observer(function EnergyRewardModal() {
  const { locale } = useLocale();

  if (!energyUiStore.isOpen) return null;

  const catSleepSrc = getCatPoseUrl(gameStore.skins.cat, 'sleep');
  const bonusLabel = `+${REWARDED_ENERGY_BONUS}`;

  const handleWatch = () => {
    gameStore.restoreEnergyWithRewarded();
  };

  const handleClose = () => {
    energyUiStore.close();
  };

  return (
    <div
      className="game-modal chest-modal chest-modal--energy layer-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="energy-reward-title"
    >
      <div
        className="game-modal__backdrop"
        aria-hidden
        onClick={handleClose}
      />
      <div className="game-modal__panel chest-modal__panel">
        <ModalCloseButton onClick={handleClose} />
        <h2
          id="energy-reward-title"
          className="game-modal__title chest-modal__title"
        >
          {resolveText(settingsUiContent.energyRewardTitle, locale)}
        </h2>

        <div
          className="game-modal__scene game-modal__scene--plain chest-modal__scene chest-modal__scene--energy"
        >
          <img
            className="energy-modal__cat"
            src={catSleepSrc}
            alt=""
            draggable={false}
          />
          <div className="energy-modal__bonus" aria-hidden>
            <img
              className="energy-modal__bonus-icon"
              src={hudIcons.energy}
              alt=""
              draggable={false}
            />
            <span className="energy-modal__bonus-amount">{bonusLabel}</span>
          </div>
        </div>

        <p className="chest-modal__loot-text energy-modal__pitch">
          {resolveText(settingsUiContent.energyRewardText, locale)}
        </p>

        <WoodQuestButton
          className="chest-modal__hurry energy-modal__watch"
          label={formatLocalizedTemplate(
            settingsUiContent.energyRewardWatch,
            locale,
            { amount: REWARDED_ENERGY_BONUS },
          )}
          onClick={handleWatch}
        />

        <button
          type="button"
          className="chest-modal__drops-toggle energy-modal__dismiss"
          onClick={handleClose}
        >
          {resolveText(settingsUiContent.energyRewardClose, locale)}
        </button>
      </div>
    </div>
  );
});
