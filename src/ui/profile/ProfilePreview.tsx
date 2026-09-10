import { observer } from 'mobx-react-lite';
import {
  brownieSkins,
  getCatSkinById,
  houseSkins,
  viewSkins,
  type BrownieSkinId,
  type HouseSkinId,
  type ViewSkinId,
} from '../../config/assetRegistry';
import { resolveTitleName } from '../../data/titleContent';
import { getTitleById } from '../../data/titles';
import { isNightTime } from '../../domain/nightTime';
import { useLocale } from '../../i18n/LocaleContext';
import { gameStore } from '../../store/GameStore';
import { profileUiStore } from '../../store/profileUiStore';

const TITLE_GRADE_CLASS: Record<string, string> = {
  common: 'hud-title--common',
  rare: 'hud-title--rare',
  epic: 'hud-title--epic',
  epoch: 'hud-title--epoch',
};

function resolveHouseUrl(skinId: string): string {
  return houseSkins[skinId as HouseSkinId] ?? houseSkins.hut_standart;
}

function resolveViewUrl(skinId: string): string {
  return viewSkins[skinId as ViewSkinId] ?? viewSkins.landscape_standart;
}

function resolveBrownieUrl(skinId: string): string {
  return brownieSkins[skinId as BrownieSkinId] ?? brownieSkins.brownie_standart;
}

/** Одна вкладка — один слой превью, без композита сцены. */
export const ProfilePreview = observer(function ProfilePreview() {
  const { locale } = useLocale();
  const tab = profileUiStore.activeTab;
  const selectedId = profileUiStore.selectedItemId;
  const isNight = isNightTime();

  if (tab === 'titles') {
    const catSkin = getCatSkinById(gameStore.skins.cat);
    const titleId = selectedId ?? gameStore.titleId ?? 'novenkiy';
    const title = getTitleById(titleId);
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

  if (tab === 'stats' || tab === 'settings' || tab === 'cat') {
    const catId =
      tab === 'stats' || tab === 'settings'
        ? gameStore.skins.cat
        : (selectedId ?? gameStore.skins.cat);
    const catSkin = getCatSkinById(catId);
    if (!catSkin) return <div className="profile-modal__preview-stage" />;
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

  if (tab === 'izba') {
    const izbaId = selectedId ?? gameStore.skins.izba;
    return (
      <div className="profile-modal__preview-stage">
        <img
          className="profile-modal__preview-solo profile-modal__preview-solo--izba"
          src={resolveHouseUrl(izbaId)}
          alt=""
          draggable={false}
        />
      </div>
    );
  }

  if (tab === 'window') {
    const windowId = selectedId ?? gameStore.skins.window;
    const nightClass = isNight ? ' profile-modal__preview-stage--night' : '';
    return (
      <div className={`profile-modal__preview-stage${nightClass}`}>
        <img
          className="profile-modal__preview-solo profile-modal__preview-solo--forest"
          src={resolveViewUrl(windowId)}
          alt=""
          draggable={false}
        />
      </div>
    );
  }

  if (tab === 'brownie') {
    const brownieId = selectedId ?? gameStore.skins.domovoy;
    return (
      <div className="profile-modal__preview-stage">
        <img
          className="profile-modal__preview-solo profile-modal__preview-solo--brownie"
          src={resolveBrownieUrl(brownieId)}
          alt=""
          draggable={false}
        />
      </div>
    );
  }

  return <div className="profile-modal__preview-stage" />;
});
