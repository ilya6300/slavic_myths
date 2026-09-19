import { observer } from 'mobx-react-lite';

import {
  furniture,
  getCatSkinById,
  gradeFrames,
  hudIcons,
} from '../../config/assetRegistry';
import { STARTER_PACK_CAT_SKIN_ID } from '../../config/gameConstants';

import { resolveTitleName } from '../../data/titleContent';
import { getTitleById } from '../../data/titles';
import { settingsUiContent } from '../../data/dialogContent';

import { canInteract } from '../../domain/onboardingGuards';
import { YARD_GRASS_PER_CRAFT } from '../../domain/yardCraft';

import type { Grade } from '../../domain/grade';

import { resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { gameStore } from '../../store/GameStore';
import { eventUiStore } from '../../store/eventUiStore';
import { kikimoraCraftUiStore } from '../../store/kikimoraCraftUiStore';
import { profileUiStore } from '../../store/profileUiStore';
import { sceneUiStore } from '../../store/sceneUiStore';
import { starterPackUiStore } from '../../store/starterPackUiStore';

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

  const showStarterOffer = gameStore.isStarterPackOfferVisible();
  const starterPackCatSkin = getCatSkinById(STARTER_PACK_CAT_SKIN_ID);
  const showKikimoraRail =
    gameStore.isKikimoraCraftAvailable() && sceneUiStore.activeRoom !== 'street';

  const kikimoraReady = gameStore.yardGrass >= YARD_GRASS_PER_CRAFT;
  const kikimoraLabel = kikimoraReady
    ? resolveText(settingsUiContent.kikimoraRailWeave, locale)
    : resolveText(settingsUiContent.kikimoraRailName, locale);

  const showGrassChip = gameStore.onboardingCompleted;
  return (
    <header className="layer-hud">
      <div className="hud-top">
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

        <span
          className={`hud-stat hud-energy${gameStore.energy === 0 ? ' hud-energy--empty' : ''}`}
          title="Energy"
        >
          <img className="hud-stat__img" src={hudIcons.energy} alt="" />
          {gameStore.energy}/{gameStore.maxEnergy}
        </span>

        <div className="hud-resources">
          <span
            className={`hud-stat hud-coins${eventUiStore.susedkoPhase === 'stealing' ? ' hud-coins--stealing' : ''}`}
            title="Luck coins"
          >
            <img className="hud-stat__img" src={hudIcons.coin} alt="" />
            {gameStore.luckCoins}
          </span>

          <span className="hud-stat hud-oberegs" title="Talismans">
            <img className="hud-stat__img" src={hudIcons.obereg} alt="" />
            {gameStore.talismans}
          </span>

          {showGrassChip && (
            <span
              className={`hud-stat hud-grass${sceneUiStore.grassChipShake ? ' hud-grass--shake' : ''}${sceneUiStore.grassChipFlash ? ' hud-grass--flash' : ''}`}
              title={resolveText(settingsUiContent.hudGrassTooltip, locale)}
            >
              <img className="hud-stat__img" src={hudIcons.grass} alt="" />
              {gameStore.yardGrass}
            </span>
          )}
        </div>
      </div>

      {(showStarterOffer || showKikimoraRail) && (
        <aside className="hud-rail" aria-label={resolveText(settingsUiContent.hudRailLabel, locale)}>
          {showStarterOffer && (
            <button
              type="button"
              className="hud-rail__offer hud-rail__offer--available"
              onClick={() => starterPackUiStore.open()}
            >
              <img
                className="hud-rail__offer-img hud-rail__offer-img--pilgrim"
                src={starterPackCatSkin?.sit ?? furniture.starterCasket}
                alt=""
                draggable={false}
              />
              <span className="hud-rail__offer-label">
                {resolveText(settingsUiContent.starterPackRail, locale)}
              </span>
            </button>
          )}

          {showKikimoraRail && (
            <button
              type="button"
              className={`hud-rail__kikimora${kikimoraReady ? ' hud-rail__kikimora--ready' : ''}`}
              onClick={() => kikimoraCraftUiStore.open()}
              aria-label={resolveText(settingsUiContent.kikimoraRailAria, locale)}
            >
              <img
                className="hud-rail__kikimora-img"
                src={furniture.kikimoraWeaving}
                alt=""
                draggable={false}
              />
              <span className="hud-rail__kikimora-label">{kikimoraLabel}</span>
            </button>
          )}
        </aside>
      )}
    </header>
  );
});
