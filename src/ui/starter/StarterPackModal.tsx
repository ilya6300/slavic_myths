import { observer } from 'mobx-react-lite';

import { bookUi, furniture, getCatSkinById, hudIcons } from '../../config/assetRegistry';
import {
  STARTER_PACK_CAT_SKIN_ID,
  STARTER_PACK_PRICE_RUB,
} from '../../config/gameConstants';
import { settingsUiContent } from '../../data/dialogContent';
import { resolveSkinName } from '../../data/skinContent';
import { formatLocalizedTemplate, resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { paymentsService } from '../../services/paymentsService';
import { gameStore } from '../../store/GameStore';
import { starterPackUiStore } from '../../store/starterPackUiStore';
import { ModalCloseButton } from '../common/ModalCloseButton';

export const StarterPackModal = observer(function StarterPackModal() {
  const { locale } = useLocale();

  if (!starterPackUiStore.isOpen) return null;

  const catSkin = getCatSkinById(STARTER_PACK_CAT_SKIN_ID);
  const alreadyOwned = gameStore.starterPackPurchased;

  const handlePay = async () => {
    const result = await paymentsService.purchaseStarterPack();
    if (result === 'success') {
      starterPackUiStore.close();
    }
  };

  const handleClose = () => {
    starterPackUiStore.close();
  };

  return (
    <div
      className="game-modal starter-pack-modal layer-modal"
      role="dialog"
      aria-modal="true"
    >
      <div className="game-modal__backdrop" aria-hidden onClick={handleClose} />
      <div className="game-modal__panel starter-pack-modal__panel">
        <ModalCloseButton onClick={handleClose} />
        <h2 className="game-modal__title starter-pack-modal__title">
          {resolveText(settingsUiContent.starterPackTitle, locale)}
        </h2>
        <p className="starter-pack-modal__lore">
          {resolveText(settingsUiContent.starterPackLore, locale)}
        </p>

        <div className="starter-pack-modal__hero">
          <img
            className="starter-pack-modal__casket"
            src={furniture.starterCasket}
            alt=""
            draggable={false}
          />
        </div>

        <ul className="starter-pack-modal__rewards">
          <li>
            <span className="starter-pack-modal__reward-icon">
              <img src={hudIcons.energy} alt="" draggable={false} />
            </span>
            <span className="starter-pack-modal__reward-label">+100</span>
          </li>
          <li>
            <span className="starter-pack-modal__reward-icon">
              <img src={hudIcons.obereg} alt="" draggable={false} />
            </span>
            <span className="starter-pack-modal__reward-label">×5</span>
          </li>
          <li>
            <span className="starter-pack-modal__reward-icon">
              {catSkin && (
                <img
                  src={catSkin.sit}
                  alt=""
                  className="starter-pack-modal__cat-preview"
                  draggable={false}
                />
              )}
            </span>
            <span className="starter-pack-modal__reward-label">
              {catSkin ? resolveSkinName('cat', catSkin.id, locale) : '…'}
            </span>
          </li>
        </ul>

        {alreadyOwned ? (
          <p className="starter-pack-modal__owned">
            {resolveText(settingsUiContent.starterPackOwned, locale)}
          </p>
        ) : (
          <button
            type="button"
            className="starter-pack-modal__pay wood-quest-btn"
            onClick={handlePay}
          >
            <img
              className="wood-quest-btn__bg"
              src={bookUi.questBtn}
              alt=""
              draggable={false}
            />
            <span className="wood-quest-btn__label">
              {formatLocalizedTemplate(settingsUiContent.starterPackPay, locale, {
                price: STARTER_PACK_PRICE_RUB,
              })}
            </span>
          </button>
        )}

        <button type="button" className="starter-pack-modal__later" onClick={handleClose}>
          {resolveText(settingsUiContent.starterPackLater, locale)}
        </button>
      </div>
    </div>
  );
});
