import { observer } from 'mobx-react-lite';

import {
  getCatSkinById,
  getCompanionPetPoseUrl,
  houseSkins,
  hudIcons,
  type HouseSkinId,
} from '../../config/assetRegistry';
import { findYagaShopItem } from '../../data/yagaShop';
import { getIzbaEffectById } from '../../data/izbaEffects';
import { getPetById } from '../../data/pets';
import { resolveTitleName } from '../../data/titleContent';
import { getTitleById } from '../../data/titles';
import { useLocale } from '../../i18n/LocaleContext';
import { resolveText } from '../../i18n/resolve';
import { resolveSkinName } from '../../data/skinContent';
import { gameStore } from '../../store/GameStore';
import { yagaShopUiStore } from '../../store/yagaShopUiStore';

const TITLE_GRADE_CLASS: Record<string, string> = {
  common: 'hud-title--common',
  rare: 'hud-title--rare',
  epic: 'hud-title--epic',
  epoch: 'hud-title--epoch',
};

function resolveHouseUrl(skinId: string): string {
  return houseSkins[skinId as HouseSkinId] ?? houseSkins.hut_standart;
}

export const YagaShopPreview = observer(function YagaShopPreview() {
  const { locale } = useLocale();
  const tab = yagaShopUiStore.activeTab;
  const selectedId = yagaShopUiStore.selectedShopItemId;
  const item = selectedId ? findYagaShopItem(selectedId) : undefined;

  if (tab === 'candles') {
    return (
      <div className="profile-modal__preview-stage">
        <img
          className="profile-modal__preview-solo"
          src={hudIcons.candle}
          alt=""
          draggable={false}
        />
      </div>
    );
  }

  if (!item) {
    return <div className="profile-modal__preview-stage" />;
  }

  if (item.kind === 'cat_skin') {
    const catSkin = getCatSkinById(item.refId);
    const label = resolveSkinName('cat', item.refId, locale);
    if (!catSkin) {
      return (
        <div className="profile-modal__preview-stage profile-modal__preview-stage--titles">
          <span className="profile-modal__preview-title">{label}</span>
        </div>
      );
    }
    return (
      <div className="profile-modal__preview-stage">
        <img
          className="profile-modal__preview-solo profile-modal__preview-solo--cat"
          src={catSkin.sit}
          alt=""
          draggable={false}
        />
      </div>
    );
  }

  if (item.kind === 'title') {
    const title = getTitleById(item.refId);
    const catSkin = getCatSkinById(gameStore.skins.cat);
    const titleGradeClass = TITLE_GRADE_CLASS[title?.grade ?? 'common'];
    return (
      <div className="profile-modal__preview-stage profile-modal__preview-stage--titles">
        {title && (
          <span className={`profile-modal__preview-title ${titleGradeClass}`}>
            {resolveTitleName(title, locale)}
          </span>
        )}
        {catSkin && (
          <img
            className="profile-modal__preview-solo profile-modal__preview-solo--cat"
            src={catSkin.sit}
            alt=""
            draggable={false}
          />
        )}
      </div>
    );
  }

  if (item.kind === 'pet') {
    const pet = getPetById(item.refId);
    const petUrl = pet ? getCompanionPetPoseUrl(pet.id, 'sid') : null;
    return (
      <div className="profile-modal__preview-stage">
        {pet &&
          (petUrl ? (
            <img
              className="profile-modal__preview-solo profile-modal__preview-solo--companion"
              src={petUrl}
              alt=""
              draggable={false}
              title={resolveText(pet.name, locale)}
            />
          ) : (
            <div
              className={`profile-modal__preview-solo-companion-icon ${pet.sceneClassName}`}
              aria-hidden
              title={resolveText(pet.name, locale)}
            />
          ))}
      </div>
    );
  }

  if (item.kind === 'izba_effect') {
    const effect = getIzbaEffectById(item.refId);
    const effectClass = effect?.sceneClassName ?? '';
    return (
      <div
        className={`profile-modal__preview-stage profile-modal__preview-stage--izba-fx${effectClass ? ` ${effectClass}` : ''}`}
      >
        <img
          className="profile-modal__preview-solo profile-modal__preview-solo--izba"
          src={resolveHouseUrl(gameStore.skins.izba)}
          alt=""
          draggable={false}
        />
      </div>
    );
  }

  return <div className="profile-modal__preview-stage" />;
});
