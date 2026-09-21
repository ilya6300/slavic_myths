import { observer } from 'mobx-react-lite';

import {
  getCatSkinById,
  getCompanionPetPoseUrl,
  gradeFrames,
  hudIcons,
} from '../../config/assetRegistry';
import { gradeLabels, settingsUiContent } from '../../data/dialogContent';
import { getIzbaEffectById, resolveIzbaEffectName } from '../../data/izbaEffects';
import { getPetById } from '../../data/pets';
import {
  findYagaShopItem,
  getYagaShopItemsForTab,
  type YagaShopItem,
} from '../../data/yagaShop';
import { getYagaShopCatSkinArt } from '../../data/yagaShopCatSkinArt';
import { resolveSkinName } from '../../data/skinContent';
import { resolveTitleName } from '../../data/titleContent';
import { getTitleById } from '../../data/titles';
import { formatLocalizedTemplate, resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { paymentsService } from '../../services/paymentsService';
import { gameStore } from '../../store/GameStore';
import { sceneUiStore } from '../../store/sceneUiStore';
import { yagaShopUiStore, type YagaShopTab } from '../../store/yagaShopUiStore';
import { ModalCloseButton } from '../common/ModalCloseButton';
import { WoodQuestButton } from '../common/WoodQuestButton';
import { YagaShopPreview } from './YagaShopPreview';

const TABS: { id: YagaShopTab; labelKey: keyof typeof settingsUiContent }[] = [
  { id: 'cat', labelKey: 'profileTabCat' },
  { id: 'titles', labelKey: 'profileTabTitles' },
  { id: 'pets', labelKey: 'profileTabPets' },
  { id: 'atmosphere', labelKey: 'profileTabAtmosphere' },
  { id: 'candles', labelKey: 'yagaShopTabCandles' },
];

const TITLE_GRADE_CLASS: Record<string, string> = {
  common: 'hud-title--common',
  rare: 'hud-title--rare',
  epic: 'hud-title--epic',
  epoch: 'hud-title--epoch',
};

function previewNameForItem(item: YagaShopItem, locale: import('../../i18n/types').Locale): string {
  if (item.kind === 'title') {
    const title = getTitleById(item.refId);
    return title ? resolveTitleName(title, locale) : resolveText(item.name, locale);
  }
  if (item.kind === 'izba_effect') {
    const fx = getIzbaEffectById(item.refId);
    return fx ? resolveIzbaEffectName(item.refId, locale) : resolveText(item.name, locale);
  }
  return resolveText(item.name, locale);
}

export const YagaShopModal = observer(function YagaShopModal() {
  const { locale } = useLocale();

  if (!yagaShopUiStore.isOpen) return null;

  const handleClose = () => {
    yagaShopUiStore.close();
    sceneUiStore.panBlocked = false;
  };

  const tab = yagaShopUiStore.activeTab;
  const selectedId = yagaShopUiStore.selectedShopItemId;
  const selectedItem = selectedId ? findYagaShopItem(selectedId) : undefined;

  const handleBuyCrumbs = () => {
    if (!selectedId) return;
    gameStore.purchaseYagaShopItem(selectedId);
  };

  const handleBuyCandle = async () => {
    await paymentsService.purchaseCandlePack();
  };

  const owned =
    selectedId != null && tab !== 'candles' && gameStore.isYagaShopItemOwned(selectedId);
  const canBuy =
    selectedItem != null && !owned && gameStore.truthCrumbs >= selectedItem.priceCrumbs;

  const previewName =
    tab === 'candles'
      ? resolveText(settingsUiContent.yagaShopTabCandles, locale)
      : selectedItem
        ? previewNameForItem(selectedItem, locale)
        : null;

  const catSkinArt =
    selectedItem?.kind === 'cat_skin' ? getYagaShopCatSkinArt(selectedItem.refId) : undefined;
  const catSkinTagline = catSkinArt ? resolveText(catSkinArt.tagline, locale) : null;

  return (
    <div
      className="game-modal yaga-shop-modal profile-modal layer-modal"
      role="dialog"
      aria-modal="true"
    >
      <div className="game-modal__backdrop" aria-hidden onClick={handleClose} />
      <div className="game-modal__panel game-modal__panel--wide profile-modal__panel yaga-shop-modal__panel">
        <ModalCloseButton onClick={handleClose} />
        <h2 className="game-modal__title profile-modal__heading">
          {resolveText(settingsUiContent.yagaShopTitle, locale)}
        </h2>
        <p className="yaga-shop-modal__balance">
          <img src={hudIcons.truthCrumb} alt="" draggable={false} />
          {gameStore.truthCrumbs}
        </p>

        <div className="profile-modal__layout">
          <div className="profile-modal__preview">
            <YagaShopPreview />
            {previewName && <p className="profile-modal__preview-name">{previewName}</p>}
            {catSkinTagline && (
              <p className="profile-modal__bonus-line yaga-shop-modal__cat-tagline">
                {catSkinTagline}
              </p>
            )}

            {tab === 'candles' ? (
              <>
                <p className="profile-modal__bonus-line">
                  {resolveText(settingsUiContent.yagaShopCandleLore, locale)}
                </p>
                <WoodQuestButton
                  className="profile-modal__equip"
                  label={resolveText(settingsUiContent.yagaShopCandleCta, locale)}
                  onClick={() => handleBuyCandle()}
                />
                <p className="profile-modal__acquire-hint">
                  {formatLocalizedTemplate(
                    settingsUiContent.yagaShopCandlePriceFromSdk,
                    locale,
                    { price: paymentsService.getCandlePackPriceLabel(locale) },
                  )}
                </p>
              </>
            ) : selectedItem ? (
              owned ? (
                <p className="profile-modal__equipped">
                  {resolveText(settingsUiContent.yagaShopOwned, locale)}
                </p>
              ) : (
                <>
                  <p className="yaga-shop-modal__price">
                    <img src={hudIcons.truthCrumb} alt="" draggable={false} />
                    {selectedItem.priceCrumbs}
                  </p>
                  <WoodQuestButton
                    className="profile-modal__equip"
                    label={resolveText(settingsUiContent.yagaShopBuy, locale)}
                    onClick={handleBuyCrumbs}
                    disabled={!canBuy}
                  />
                </>
              )
            ) : null}
          </div>

          <div className="profile-modal__main">
            <div className="profile-tabs" role="tablist">
              {TABS.map(({ id, labelKey }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  className={`profile-tabs__btn${tab === id ? ' profile-tabs__btn--active' : ''}`}
                  onClick={() => yagaShopUiStore.setTab(id)}
                >
                  {resolveText(settingsUiContent[labelKey], locale)}
                </button>
              ))}
            </div>

            <div className="profile-grid">
              {tab === 'candles' ? (
                <p className="profile-grid__full yaga-shop-modal__candles-hint">
                  {resolveText(settingsUiContent.yagaShopCandleLore, locale)}
                </p>
              ) : (
                getYagaShopItemsForTab(tab).map((item) => {
                  const selected = selectedId === item.id;
                  if (item.kind === 'cat_skin') {
                    const catSkin = getCatSkinById(item.refId);
                    const grade = catSkin?.grade ?? 'epoch';
                    const skinLabel = resolveSkinName('cat', item.refId, locale);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`profile-grid__cell profile-grid__cell--cat${selected ? ' profile-grid__cell--selected' : ''}`}
                        onClick={() => yagaShopUiStore.selectItem(item.id)}
                        title={skinLabel}
                      >
                        {catSkin && (
                          <img
                            className="profile-grid__thumb"
                            src={catSkin.sit}
                            alt=""
                            draggable={false}
                          />
                        )}
                        <img
                          className="profile-grid__frame"
                          src={gradeFrames[grade]}
                          alt=""
                          draggable={false}
                        />
                        <span className="profile-grid__meta yaga-shop-modal__cat-label">
                          {skinLabel}
                        </span>
                      </button>
                    );
                  }

                  if (item.kind === 'title') {
                    const title = getTitleById(item.refId);
                    const grade = title?.grade ?? 'epoch';
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`profile-grid__cell${selected ? ' profile-grid__cell--selected' : ''}`}
                        onClick={() => yagaShopUiStore.selectItem(item.id)}
                      >
                        <span className={`profile-grid__title ${TITLE_GRADE_CLASS[grade] ?? ''}`}>
                          {title ? resolveTitleName(title, locale) : resolveText(item.name, locale)}
                        </span>
                        <span className="profile-grid__meta">
                          {resolveText(gradeLabels[grade], locale)}
                        </span>
                      </button>
                    );
                  }

                  if (item.kind === 'pet') {
                    const pet = getPetById(item.refId);
                    const petThumbUrl = getCompanionPetPoseUrl(item.refId, 'sid');
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`profile-grid__cell profile-grid__cell--pet${selected ? ' profile-grid__cell--selected' : ''}`}
                        onClick={() => yagaShopUiStore.selectItem(item.id)}
                      >
                        {petThumbUrl ? (
                          <img
                            className="profile-grid__pet-thumb"
                            src={petThumbUrl}
                            alt=""
                            draggable={false}
                          />
                        ) : (
                          <span
                            className={`profile-grid__pet-silhouette profile-grid__pet-silhouette--icon ${pet?.sceneClassName ?? ''}`}
                            aria-hidden
                          />
                        )}
                        <span className="profile-grid__title hud-title--epoch">
                          {resolveText(item.name, locale)}
                        </span>
                      </button>
                    );
                  }

                  const effect = getIzbaEffectById(item.refId);
                  const grade = effect?.grade ?? 'epoch';
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`profile-grid__cell profile-grid__cell--atmosphere${selected ? ' profile-grid__cell--selected' : ''}`}
                      onClick={() => yagaShopUiStore.selectItem(item.id)}
                    >
                      <span
                        className={`profile-grid__atmosphere-swatch ${effect?.sceneClassName ?? ''}`}
                        aria-hidden
                      />
                      <span className={`profile-grid__title ${TITLE_GRADE_CLASS[grade] ?? ''}`}>
                        {effect
                          ? resolveIzbaEffectName(item.refId, locale)
                          : resolveText(item.name, locale)}
                      </span>
                      <span className="profile-grid__meta">
                        {resolveText(gradeLabels[grade], locale)}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
