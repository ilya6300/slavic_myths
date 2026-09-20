import { observer } from 'mobx-react-lite';

import { hudIcons } from '../../config/assetRegistry';
import { settingsUiContent } from '../../data/dialogContent';
import { allYagaShopCrumbItems } from '../../data/yagaShop';
import { formatLocalizedTemplate, resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { paymentsService } from '../../services/paymentsService';
import { gameStore } from '../../store/GameStore';
import { sceneUiStore } from '../../store/sceneUiStore';
import { yagaShopUiStore } from '../../store/yagaShopUiStore';
import { ModalCloseButton } from '../common/ModalCloseButton';

export const YagaShopModal = observer(function YagaShopModal() {
  const { locale } = useLocale();

  if (!yagaShopUiStore.isOpen) return null;

  const handleClose = () => {
    yagaShopUiStore.close();
    sceneUiStore.panBlocked = false;
  };

  const handleBuyCrumbs = (shopItemId: string) => {
    gameStore.purchaseYagaShopItem(shopItemId);
  };

  const handleBuyCandle = async () => {
    await paymentsService.purchaseCandlePack();
  };

  const tab = yagaShopUiStore.activeTab;

  return (
    <div className="game-modal yaga-shop-modal layer-modal" role="dialog" aria-modal="true">
      <div className="game-modal__backdrop" aria-hidden onClick={handleClose} />
      <div className="game-modal__panel game-modal__panel--wide yaga-shop-modal__panel">
        <ModalCloseButton onClick={handleClose} />
        <h2 className="game-modal__title">
          {resolveText(settingsUiContent.yagaShopTitle, locale)}
        </h2>

        <div className="yaga-shop-modal__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            className={`yaga-shop-modal__tab${tab === 'crumbs' ? ' yaga-shop-modal__tab--active' : ''}`}
            onClick={() => yagaShopUiStore.setTab('crumbs')}
          >
            {resolveText(settingsUiContent.yagaShopTabCrumbs, locale)}
          </button>
          <button
            type="button"
            role="tab"
            className={`yaga-shop-modal__tab${tab === 'candles' ? ' yaga-shop-modal__tab--active' : ''}`}
            onClick={() => yagaShopUiStore.setTab('candles')}
          >
            {resolveText(settingsUiContent.yagaShopTabCandles, locale)}
          </button>
        </div>

        {tab === 'crumbs' ? (
          <ul className="yaga-shop-modal__list">
            {allYagaShopCrumbItems.map((item) => {
              const owned = gameStore.isYagaShopItemOwned(item.id);
              const canBuy = gameStore.truthCrumbs >= item.priceCrumbs;
              return (
                <li key={item.id} className="yaga-shop-modal__row">
                  <span className="yaga-shop-modal__name">
                    {resolveText(item.name, locale)}
                  </span>
                  <span className="yaga-shop-modal__price">
                    <img src={hudIcons.truthCrumb} alt="" draggable={false} />
                    {item.priceCrumbs}
                  </span>
                  {owned ? (
                    <span className="yaga-shop-modal__owned">
                      {resolveText(settingsUiContent.yagaShopOwned, locale)}
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="quiz-answer yaga-shop-modal__buy"
                      disabled={!canBuy}
                      onClick={() => handleBuyCrumbs(item.id)}
                    >
                      {resolveText(settingsUiContent.yagaShopBuy, locale)}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="yaga-shop-modal__iap">
            <p className="yaga-shop-modal__iap-line">
              {resolveText(settingsUiContent.yagaShopCandleLore, locale)}
            </p>
            <button
              type="button"
              className="quiz-answer"
              onClick={() => handleBuyCandle()}
            >
              {resolveText(settingsUiContent.yagaShopCandleCta, locale)}
            </button>
            <p className="yaga-shop-modal__iap-note">
              {formatLocalizedTemplate(
                settingsUiContent.yagaShopCandlePriceFromSdk,
                locale,
                { price: paymentsService.getCandlePackPriceLabel(locale) },
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});
