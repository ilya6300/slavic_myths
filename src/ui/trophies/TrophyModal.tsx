import { observer } from 'mobx-react-lite';
import {
  getTrophyUrl,
  gradeFrames,
  quizSceneBackgrounds,
} from '../../config/assetRegistry';
import { settingsUiContent, gradeLabels } from '../../data/dialogContent';
import { getSpiritById } from '../../data/spirits';
import { resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { trophyUiStore } from '../../store/trophyUiStore';
import { ModalCloseButton } from '../common/ModalCloseButton';
import { WoodQuestButton } from '../common/WoodQuestButton';

export const TrophyModal = observer(function TrophyModal() {
  const { locale } = useLocale();
  const spiritId = trophyUiStore.activeSpiritId;
  if (!spiritId) return null;

  const spirit = getSpiritById(spiritId);
  if (!spirit) return null;

  const frameSrc = gradeFrames[spirit.grade];
  const isEmpty = trophyUiStore.isEmptySlot;

  const handleClose = () => {
    trophyUiStore.close();
  };

  return (
    <div className="game-modal trophy-modal layer-modal" role="dialog" aria-modal="true">
      <div className="game-modal__backdrop" aria-hidden onClick={handleClose} />
      <div className="game-modal__panel trophy-modal__panel">
        <ModalCloseButton onClick={handleClose} />
        <h2 className="game-modal__title trophy-modal__title">{spirit.name}</h2>

        <div
          className={`game-modal__scene trophy-modal__scene${isEmpty ? ' trophy-modal__scene--empty' : ''}`}
        >
          <img
            className="game-modal__scene-bg"
            src={quizSceneBackgrounds.trophyTale}
            alt=""
            draggable={false}
          />
          {!isEmpty && (
            <div className="trophy-modal__frame-wrap">
              <img
                className="trophy-modal__trophy"
                data-spirit-id={spiritId}
                src={getTrophyUrl(spiritId)}
                alt=""
                draggable={false}
              />
              <img
                className="trophy-modal__frame"
                src={frameSrc}
                alt=""
                draggable={false}
              />
            </div>
          )}
        </div>

        {isEmpty ? (
          <p className="trophy-modal__hint">
            {resolveText(settingsUiContent.trophyNotMet, locale)}
          </p>
        ) : (
          <>
            <p className="trophy-modal__grade">
              {resolveText(gradeLabels[spirit.grade], locale)}
            </p>
            <p className="trophy-modal__tale">{spirit.trophyDescription}</p>
          </>
        )}

        <WoodQuestButton
          className="trophy-modal__close-btn"
          label={resolveText(settingsUiContent.dialogClose, locale)}
          onClick={handleClose}
        />
      </div>
    </div>
  );
});
