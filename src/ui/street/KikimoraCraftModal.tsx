import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import {
  bookUi,
  furniture,
  hudIcons,
  quizSceneBackgrounds,
} from '../../config/assetRegistry';
import { YARD_GRASS_PER_CRAFT } from '../../domain/yardCraft';
import { settingsUiContent } from '../../data/dialogContent';
import { resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { gameStore } from '../../store/GameStore';
import { kikimoraCraftUiStore } from '../../store/kikimoraCraftUiStore';
import { ModalCloseButton } from '../common/ModalCloseButton';

export const KikimoraCraftModal = observer(function KikimoraCraftModal() {
  const { locale } = useLocale();
  const [crafting, setCrafting] = useState(false);

  if (!kikimoraCraftUiStore.isOpen) return null;

  const canCraft =
    gameStore.yardGrass >= YARD_GRASS_PER_CRAFT && !crafting;

  const handleCraft = () => {
    if (!canCraft) return;
    setCrafting(true);
    window.setTimeout(() => {
      gameStore.craftYardObereg();
      setCrafting(false);
      kikimoraCraftUiStore.close();
    }, 1200);
  };

  const handleClose = () => {
    kikimoraCraftUiStore.close();
  };

  return (
    <div className="kikimora-craft-modal layer-modal" role="dialog" aria-modal="true">
      <div
        className="kikimora-craft-modal__backdrop"
        aria-hidden
        onClick={handleClose}
      />
      <div className="kikimora-craft-modal__panel">
        <ModalCloseButton onClick={handleClose} />
        <h2 className="kikimora-craft-modal__title">
          {resolveText(settingsUiContent.kikimoraCraftTitle, locale)}
        </h2>

        <div className="kikimora-craft-modal__scene">
          <img
            className="kikimora-craft-modal__bg"
            src={quizSceneBackgrounds.kikimoraCraft}
            alt=""
            draggable={false}
          />
          <img
            className={`kikimora-craft-modal__weaver${crafting ? ' kikimora-craft-modal__weaver--active' : ''}`}
            src={furniture.kikimoraWeaving}
            alt=""
            draggable={false}
          />
          {crafting && (
            <img
              className="kikimora-craft-modal__amulet"
              src={hudIcons.obereg}
              alt=""
              draggable={false}
            />
          )}
        </div>

        <div className="kikimora-craft-modal__slots" aria-label="Grass slots">
          {Array.from({ length: YARD_GRASS_PER_CRAFT }, (_, i) => (
            <span
              key={i}
              className={`kikimora-craft-modal__slot${i < Math.min(gameStore.yardGrass, YARD_GRASS_PER_CRAFT) ? ' kikimora-craft-modal__slot--filled' : ''}`}
            >
              {i < Math.min(gameStore.yardGrass, YARD_GRASS_PER_CRAFT) ? (
                <img src={furniture.yardGrass} alt="" draggable={false} />
              ) : null}
            </span>
          ))}
          <span className="kikimora-craft-modal__count">
            {gameStore.yardGrass}
          </span>
        </div>

        <p className="kikimora-craft-modal__hint">
          {resolveText(settingsUiContent.kikimoraCraftHint, locale)}
        </p>

        <button
          type="button"
          className="kikimora-craft-modal__craft wood-quest-btn"
          disabled={!canCraft}
          onClick={handleCraft}
        >
          <img
            className="wood-quest-btn__bg"
            src={bookUi.questBtn}
            alt=""
            draggable={false}
          />
          <span className="wood-quest-btn__label">
            {resolveText(settingsUiContent.kikimoraCraftBtn, locale)}
          </span>
        </button>
      </div>
    </div>
  );
});
