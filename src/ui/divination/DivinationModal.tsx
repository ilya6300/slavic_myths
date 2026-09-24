import { observer } from 'mobx-react-lite';
import { izbaProps } from '../../config/assetRegistry';
import { divinationUi } from '../../data/divinationContent';
import { getSpiritById } from '../../data/spirits';
import { resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { gameStore } from '../../store/GameStore';
import { divinationUiStore } from '../../store/divinationUiStore';
import { ModalCloseButton } from '../common/ModalCloseButton';

export const DivinationModal = observer(function DivinationModal() {
  const { locale } = useLocale();
  const phase = divinationUiStore.phase;
  if (phase === 'idle') return null;

  const handleClose = () => {
    if (phase === 'threshold' || phase === 'result') {
      gameStore.closeDivination();
    }
  };

  const mirrorFxTune = import.meta.env.DEV;
  const showSmoke = phase === 'smoke' || mirrorFxTune;
  const showPortrait =
    phase === 'reveal' || (phase === 'result' && divinationUiStore.portraitUrl);

  return (
    <div
      className={`divination-overlay${mirrorFxTune ? ' divination-overlay--fx-tune' : ''}`}
      role="dialog"
      aria-modal="true"
    >
      <div className="divination-overlay__frame">
        <ModalCloseButton
          className="divination-overlay__close"
          onClick={handleClose}
        />
        <img
          className="divination-overlay__mirror"
          src={izbaProps.mirrorFloor}
          alt=""
          draggable={false}
        />
        {showSmoke && (
          <div className="divination-overlay__smoke" aria-hidden>
            <span className="divination-overlay__smoke-wisp divination-overlay__smoke-wisp--1" />
            <span className="divination-overlay__smoke-wisp divination-overlay__smoke-wisp--2" />
            <span className="divination-overlay__smoke-wisp divination-overlay__smoke-wisp--3" />
            <span className="divination-overlay__smoke-wisp divination-overlay__smoke-wisp--4" />
          </div>
        )}
        {showPortrait && divinationUiStore.portraitUrl && (
          <img
            className="divination-overlay__portrait"
            src={divinationUiStore.portraitUrl}
            alt=""
            draggable={false}
          />
        )}
        <div className="divination-overlay__glass">
          {phase === 'threshold' && (
            <>
              <p className="divination-overlay__line">
                {divinationUiStore.thresholdLine(locale)}
              </p>
              <div className="divination-overlay__actions">
                <button
                  type="button"
                  className="quiz-answer"
                  onClick={() => gameStore.confirmDivinationAsk()}
                >
                  {resolveText(divinationUi.ask, locale)}
                </button>
                <button
                  type="button"
                  className="quiz-answer"
                  onClick={() => gameStore.closeDivination()}
                >
                  {resolveText(divinationUi.notNow, locale)}
                </button>
              </div>
            </>
          )}

          {(phase === 'line' || phase === 'reveal') && (
            <>
              {divinationUiStore.lineText && (
                <p className="divination-overlay__line">
                  {divinationUiStore.lineText}
                </p>
              )}
              <button
                type="button"
                className="quiz-answer divination-overlay__continue"
                onClick={() => divinationUiStore.continueLine()}
              >
                {resolveText(divinationUi.continue, locale)}
              </button>
            </>
          )}

          {phase === 'pickQuestion' && (
            <div className="divination-overlay__questions">
              {divinationUiStore.availableQuestions().map((q) => (
                <button
                  key={q}
                  type="button"
                  className="quiz-answer"
                  onClick={() => gameStore.pickDivinationQuestion(q)}
                >
                  {divinationUiStore.questionPrompt(q, locale)}
                </button>
              ))}
            </div>
          )}

          {phase === 'pickGuess' && (
            <>
              <p className="divination-overlay__line">
                {resolveText(divinationUi.guessTitle, locale)}
              </p>
              <div className="divination-overlay__questions">
                {divinationUiStore.namePool.map((id) => (
                  <button
                    key={id}
                    type="button"
                    className="quiz-answer"
                    onClick={() => gameStore.submitDivinationGuess(id)}
                  >
                    {getSpiritById(id)?.name ?? id}
                  </button>
                ))}
              </div>
            </>
          )}

          {phase === 'result' && (
            <>
              <p className="divination-overlay__line">
                {divinationUiStore.lineText}
              </p>
              <button
                type="button"
                className="quiz-answer"
                onClick={() => gameStore.finishDivinationSession()}
              >
                {resolveText(divinationUi.done, locale)}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
});
