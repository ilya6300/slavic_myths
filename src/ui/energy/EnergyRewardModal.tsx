import { observer } from 'mobx-react-lite';
import { hudIcons } from '../../config/assetRegistry';
import { settingsUiContent } from '../../data/dialogContent';
import { resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { gameStore } from '../../store/GameStore';
import { energyUiStore } from '../../store/energyUiStore';

export const EnergyRewardModal = observer(function EnergyRewardModal() {
  const { locale } = useLocale();

  if (!energyUiStore.isOpen) return null;

  const handleWatch = () => {
    gameStore.restoreEnergyWithRewarded();
  };

  const handleClose = () => {
    energyUiStore.close();
  };

  return (
    <div className="chest-modal chest-modal--energy" role="dialog" aria-modal="true">
      <div
        className="chest-modal__backdrop"
        aria-hidden
        onClick={handleClose}
      />
      <div className="chest-modal__panel">
        <h2 className="chest-modal__title">
          {resolveText(settingsUiContent.energyRewardTitle, locale)}
        </h2>

        <div className="chest-modal__reward">
          <img
            className="chest-modal__energy-icon"
            src={hudIcons.energy}
            alt=""
            draggable={false}
          />
          <p className="chest-modal__loot-text">
            {resolveText(settingsUiContent.energyRewardText, locale)}
          </p>
        </div>

        <button
          type="button"
          className="chest-modal__hurry"
          onClick={handleWatch}
        >
          {resolveText(settingsUiContent.energyRewardWatch, locale)}
        </button>

        <button
          type="button"
          className="chest-modal__take"
          onClick={handleClose}
        >
          {resolveText(settingsUiContent.energyRewardClose, locale)}
        </button>
      </div>
    </div>
  );
});
