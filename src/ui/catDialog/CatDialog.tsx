import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { getCatSkinById } from '../../config/assetRegistry';
import { resolveText } from '../../i18n/resolve';
import { settingsUiContent } from '../../data/dialogContent';
import { gameStore } from '../../store/GameStore';
import { catDialogStore } from '../../store/catDialogStore';
import { useLocale } from '../../i18n/LocaleContext';
import { useTypewriter } from './useTypewriter';

export const CatDialog = observer(function CatDialog() {
  const { locale } = useLocale();
  const line = catDialogStore.currentLine;

  const { displayText, isComplete, revealAll } = useTypewriter(
    line?.text ?? '',
    catDialogStore.visible,
  );

  const handlePanelClick = useCallback(() => {
    if (!isComplete) {
      revealAll();
      return;
    }
    catDialogStore.nextOrDismiss();
  }, [isComplete, revealAll]);

  const handleNextClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      handlePanelClick();
    },
    [handlePanelClick],
  );

  if (!catDialogStore.visible || !line) return null;

  const isNovel = line.mode === 'novel';
  const catSkin = getCatSkinById(gameStore.skins.cat);
  const nextLabel = resolveText(settingsUiContent.dialogNext, locale);

  return (
    <aside
      className={`cat-dialog cat-dialog--${line.mode}${line.blocking ? ' cat-dialog--blocking' : ''}`}
      role={isNovel ? 'dialog' : 'complementary'}
      aria-modal={line.blocking ? true : undefined}
      aria-live={isNovel ? undefined : 'polite'}
      aria-labelledby="cat-dialog-text"
    >
      {isNovel && <div className="cat-dialog__dim" aria-hidden />}

      <div className="cat-dialog__panel" onClick={handlePanelClick}>
        <div
          className={`cat-dialog__portrait${isNovel ? ' cat-dialog__portrait--large' : ''}`}
        >
          <img src={catSkin?.sit} alt="" draggable={false} />
        </div>

        <div className="cat-dialog__body">
          <span className="cat-dialog__name">
            {resolveText(settingsUiContent.catName, locale)}
          </span>
          <p id="cat-dialog-text" className="cat-dialog__text">
            {displayText}
            {!isComplete && <span className="cat-dialog__cursor">|</span>}
          </p>
          <button
            type="button"
            className="cat-dialog__next"
            onClick={handleNextClick}
            aria-label={nextLabel}
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </aside>
  );
});
