import { observer } from 'mobx-react-lite';
import { gradeFrames } from '../../config/assetRegistry';
import { settingsUiContent } from '../../data/dialogContent';
import { getSpiritById } from '../../data/spirits';
import { gradeLabels } from '../../data/dialogContent';
import { resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { trophyUiStore } from '../../store/trophyUiStore';

export const TrophyModal = observer(function TrophyModal() {
  const { locale } = useLocale();
  const spiritId = trophyUiStore.activeSpiritId;
  if (!spiritId) return null;

  const spirit = getSpiritById(spiritId);
  if (!spirit) return null;

  const frameSrc = gradeFrames[spirit.grade];

  return (
    <div className="layer-modal trophy-modal" role="dialog" aria-modal="true">
      <div className="trophy-modal__card">
        <button
          type="button"
          className="trophy-modal__close"
          onClick={() => trophyUiStore.close()}
          aria-label={resolveText(settingsUiContent.dialogClose, locale)}
        >
          ×
        </button>

        {trophyUiStore.isEmptySlot ? (
          <>
            <h2 className="trophy-modal__title">{spirit.name}</h2>
            <p className="trophy-modal__hint">
              {resolveText(settingsUiContent.trophyNotMet, locale)}
            </p>
          </>
        ) : (
          <>
            <img
              className="trophy-modal__frame"
              src={frameSrc}
              alt=""
              draggable={false}
            />
            <h2 className="trophy-modal__title">{spirit.name}</h2>
            <p className="trophy-modal__grade">
              {resolveText(gradeLabels[spirit.grade], locale)}
            </p>
            <p className="trophy-modal__tale">{spirit.trophyDescription}</p>
          </>
        )}
      </div>
    </div>
  );
});
