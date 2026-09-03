import { observer } from 'mobx-react-lite';

import { gradeFrames } from '../../config/assetRegistry';

import {
  getAllProfileTitles,
  getProfileSkinsForTab,
  skinStoreKey,
  type ProfileSkinCategory,
} from '../../data/profileCatalog';

import { resolveSkinName } from '../../data/skinContent';
import { resolveTitleName } from '../../data/titleContent';

import { gradeLabels, settingsUiContent } from '../../data/dialogContent';

import { getTitleById } from '../../data/titles';

import { resolveText } from '../../i18n/resolve';

import { useLocale } from '../../i18n/LocaleContext';

import { gameStore } from '../../store/GameStore';

import { profileUiStore, type ProfileTab } from '../../store/profileUiStore';

import { sceneUiStore } from '../../store/sceneUiStore';

import { ProfilePreview } from './ProfilePreview';

import { SettingsPanel } from '../SettingsPanel';



const TABS: { id: ProfileTab; labelKey: keyof typeof settingsUiContent }[] = [

  { id: 'cat', labelKey: 'profileTabCat' },

  { id: 'izba', labelKey: 'profileTabIzba' },

  { id: 'window', labelKey: 'profileTabWindow' },

  { id: 'brownie', labelKey: 'profileTabBrownie' },

  { id: 'titles', labelKey: 'profileTabTitles' },

  { id: 'settings', labelKey: 'profileTabSettings' },

];



const TITLE_GRADE_CLASS: Record<string, string> = {

  common: 'hud-title--common',

  rare: 'hud-title--rare',

  epic: 'hud-title--epic',

  epoch: 'hud-title--epoch',

};



function getPreviewItemName(

  tab: ProfileTab,

  selectedId: string | null,

  locale: import('../../i18n/types').Locale,

): string | null {

  if (!selectedId) return null;

  if (tab === 'titles') {

    const title = getTitleById(selectedId);

    return title ? resolveTitleName(title, locale) : null;

  }

  const skin = getProfileSkinsForTab(tab as ProfileSkinCategory).find(
    (s) => s.id === selectedId,
  );
  return skin ? resolveSkinName(tab as ProfileSkinCategory, skin.id, locale) : null;

}



function getEquippedId(tab: ProfileTab): string | null {
  if (tab === 'titles') return gameStore.titleId;
  if (tab === 'cat') return gameStore.skins.cat;
  if (tab === 'izba') return gameStore.skins.izba;
  if (tab === 'window') return gameStore.skins.window;
  if (tab === 'brownie') return gameStore.skins.domovoy;
  return null;
}

export const ProfileModal = observer(function ProfileModal() {

  const { locale } = useLocale();

  if (!profileUiStore.isOpen) return null;



  const tab = profileUiStore.activeTab;

  const selectedId = profileUiStore.selectedItemId;



  const handleClose = () => {

    profileUiStore.close();

    sceneUiStore.panBlocked = false;

  };



  const handleEquip = () => {

    if (!selectedId) return;

    if (tab === 'titles') {

      gameStore.equipTitle(selectedId);

      return;

    }

    const storeKey = skinStoreKey(tab as ProfileSkinCategory);

    gameStore.equipSkin(storeKey, selectedId);

  };



  const selectedOwned =

    selectedId != null &&

    (tab === 'titles'

      ? gameStore.isTitleOwned(selectedId)

      : gameStore.isSkinOwned(selectedId));

  const isEquipped =
    selectedId != null && selectedId === getEquippedId(tab);

  const previewName = getPreviewItemName(tab, selectedId, locale);



  return (

    <div className="layer-modal profile-modal" role="dialog" aria-modal="true">

      <div className="profile-modal__panel">

        <button

          type="button"

          className="profile-modal__close"

          onClick={handleClose}

          aria-label={resolveText(settingsUiContent.profileClose, locale)}

        >

          ×

        </button>



        <h2 className="profile-modal__heading">

          {resolveText(settingsUiContent.profileHeading, locale)}

        </h2>



        <div className={`profile-modal__layout${tab === 'settings' ? ' profile-modal__layout--settings' : ''}`}>

          {tab !== 'settings' && (
          <div className="profile-modal__preview">

            <ProfilePreview />

            {previewName && (

              <p className="profile-modal__preview-name">{previewName}</p>

            )}

            {selectedOwned ? (
              isEquipped ? (
                <p className="profile-modal__equipped">
                  {resolveText(settingsUiContent.profileEquipped, locale)}
                </p>
              ) : (
              <button

                type="button"

                className="profile-modal__equip"

                onClick={handleEquip}

              >

                {resolveText(settingsUiContent.profileEquip, locale)}

              </button>
              )
            ) : (

              <p className="profile-modal__locked">

                {resolveText(settingsUiContent.profileLocked, locale)}

              </p>

            )}

          </div>
          )}



          <div className="profile-modal__main">

            <div className="profile-tabs" role="tablist">

              {TABS.map(({ id, labelKey }) => (

                <button

                  key={id}

                  type="button"

                  role="tab"

                  className={`profile-tabs__btn${tab === id ? ' profile-tabs__btn--active' : ''}`}

                  onClick={() => profileUiStore.setTab(id)}

                >

                  {resolveText(settingsUiContent[labelKey], locale)}

                </button>

              ))}

            </div>



            <div className="profile-grid">

              {tab === 'settings' ? (
                <SettingsPanel embedded />
              ) : tab === 'titles'

                ? getAllProfileTitles().map((title) => {

                    const owned = gameStore.isTitleOwned(title.id);

                    const selected = selectedId === title.id;

                    return (

                      <button

                        key={title.id}

                        type="button"

                        className={`profile-grid__cell${selected ? ' profile-grid__cell--selected' : ''}${!owned ? ' profile-grid__cell--locked' : ''}`}

                        onClick={() => profileUiStore.selectItem(title.id)}

                      >

                        <span

                          className={`profile-grid__title ${TITLE_GRADE_CLASS[title.grade] ?? ''}`}

                        >

                          {resolveTitleName(title, locale)}

                        </span>

                        <span className="profile-grid__meta">

                          {resolveText(gradeLabels[title.grade], locale)}

                        </span>

                      </button>

                    );

                  })

                : getProfileSkinsForTab(tab as ProfileSkinCategory).map((skin) => {

                    const owned = gameStore.isSkinOwned(skin.id);

                    const selected = selectedId === skin.id;

                    return (

                      <button

                        key={skin.id}

                        type="button"

                        className={`profile-grid__cell profile-grid__cell--${tab}${selected ? ' profile-grid__cell--selected' : ''}${!owned ? ' profile-grid__cell--locked' : ''}`}

                        onClick={() => profileUiStore.selectItem(skin.id)}

                      >

                        <img

                          className="profile-grid__thumb"

                          src={skin.previewSrc}

                          alt=""

                          draggable={false}

                        />

                        <img

                          className="profile-grid__frame"

                          src={gradeFrames[skin.grade]}

                          alt=""

                          draggable={false}

                        />

                      </button>

                    );

                  })}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

});

