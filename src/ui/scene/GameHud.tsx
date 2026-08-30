import { observer } from 'mobx-react-lite';

import { hudIcons, getCatSkinById, gradeFrames } from '../../config/assetRegistry';

import { resolveTitleName } from '../../data/titleContent';
import { getTitleById } from '../../data/titles';

import { canInteract } from '../../domain/onboardingGuards';

import type { Grade } from '../../domain/grade';

import { formatLocalizedTemplate } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { settingsUiContent } from '../../data/dialogContent';
import { gameStore } from '../../store/GameStore';
import { profileUiStore } from '../../store/profileUiStore';
import { sceneUiStore } from '../../store/sceneUiStore';



const TITLE_GRADE_CLASS: Record<Grade, string> = {

  common: 'hud-title--common',

  rare: 'hud-title--rare',

  epic: 'hud-title--epic',

  epoch: 'hud-title--epoch',

};



export const GameHud = observer(function GameHud() {
  const { locale } = useLocale();

  const catSkin = getCatSkinById(gameStore.skins.cat);

  const frameUrl = gradeFrames[catSkin?.grade ?? 'common'];

  const title = getTitleById(gameStore.titleId ?? 'novenkiy');

  const titleGradeClass = TITLE_GRADE_CLASS[title?.grade ?? 'common'];

  const profileAllowed = canInteract(
    gameStore.onboardingStep,
    gameStore.onboardingCompleted,
    'profile',
  );

  const handleProfileOpen = () => {
    if (!profileAllowed) return;
    profileUiStore.open();
    sceneUiStore.panBlocked = true;
  };

  const showMiracleHud =
    gameStore.isWonderChestVisible() && gameStore.wonderChestWeekSlotUsed;



  return (

    <header className="layer-hud">

      <button

        type="button"

        className="hud-profile"

        disabled={!profileAllowed}

        onClick={handleProfileOpen}

        aria-label={`Profile. ${title ? resolveTitleName(title, locale) : ''}`}

      >

        <span className="hud-avatar">

          <img

            className="hud-avatar__face"

            src={catSkin?.sit}

            alt=""

            draggable={false}

          />

          <img className="hud-avatar__frame" src={frameUrl} alt="" draggable={false} />

        </span>

        <span className={`hud-title ${titleGradeClass}`}>

          {title ? resolveTitleName(title, locale) : '…'}

        </span>

      </button>



      <div className="hud-resources">

        <span className="hud-stat" title="Energy">

          <span className="hud-stat__icon" aria-hidden>

            ⚡

          </span>

          {gameStore.energy}

        </span>

        <span className="hud-stat" title="Luck coins">

          <img className="hud-stat__img" src={hudIcons.coin} alt="" />

          {gameStore.luckCoins}

        </span>

        <span className="hud-stat" title="Talismans">

          <img className="hud-stat__img" src={hudIcons.obereg} alt="" />

          {gameStore.talismans}

        </span>

        {showMiracleHud && (
          <span className="hud-miracle" title="Miracle chest">
            {formatLocalizedTemplate(
              settingsUiContent.hudMiracleProgress,
              locale,
              {
                progress: gameStore.getWonderChestClickProgress(),
                total: gameStore.getWonderChestClicksRequired(),
              },
            )}
          </span>
        )}

      </div>

    </header>

  );

});


