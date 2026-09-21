import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { getSpiritById } from '../../data/spirits';
import { spiritIllustrationUrl } from '../book/spiritIllustrationUrl';
import { settingsUiContent } from '../../data/dialogContent';
import { getQuizDotClassName } from '../../domain/quizProgressDots';
import { resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { gameStore } from '../../store/GameStore';
import { divinationUiStore } from '../../store/divinationUiStore';
import { quizUiStore } from '../../store/quizUiStore';
import {
  houseSkins,
  hudIcons,
  quizBackgrounds,
  spiritPortraitPaths,
  type HouseSkinId,
  type SpiritId,
  viewSkins,
  type ViewSkinId,
} from '../../config/assetRegistry';
import { ModalCloseButton } from '../common/ModalCloseButton';

const CORRECT_FLASH_MS = 400;
const WRONG_FLASH_MS = 500;

function resolveViewUrl(skinId: string): string {
  const key = skinId as ViewSkinId;
  return viewSkins[key] ?? viewSkins.landscape_standart;
}

function resolveHouseUrl(skinId: string): string {
  const key = skinId as HouseSkinId;
  return houseSkins[key] ?? houseSkins.hut_standart;
}

export const QuizModal = observer(function QuizModal() {
  const { locale } = useLocale();
  const spiritId = quizUiStore.activeSpiritId;
  const spirit = spiritId ? getSpiritById(spiritId) : null;
  const question = quizUiStore.currentQuestion;
  const phase = quizUiStore.phase;

  useEffect(() => {
    if (phase !== 'correct') return;
    const id = window.setTimeout(() => {
      gameStore.advanceQuizAfterCorrect();
    }, CORRECT_FLASH_MS);
    return () => window.clearTimeout(id);
  }, [phase, quizUiStore.questionIndex]);

  useEffect(() => {
    if (phase !== 'wrong') return;
    const id = window.setTimeout(() => {
      gameStore.advanceQuizAfterWrong();
    }, WRONG_FLASH_MS);
    return () => window.clearTimeout(id);
  }, [phase, quizUiStore.questionIndex]);

  if (divinationUiStore.phase !== 'idle') return null;
  if (!spiritId || !spirit) return null;

  const locationId = spirit.locationId;
  const bg = quizBackgrounds[locationId];
  const usesHutOverlay = bg.hutOverlay === true;
  const viewUrl = resolveViewUrl(gameStore.skins.window);
  const houseUrl = resolveHouseUrl(gameStore.skins.izba);
  const questionIndex = quizUiStore.questionIndex;

  const handleAnswer = (index: number) => {
    if (phase !== 'question') return;
    gameStore.submitQuizAnswer(index);
  };

  const handleAbandon = () => {
    gameStore.abandonQuiz();
  };

  const handleClaim = () => {
    gameStore.claimQuizVictory();
  };

  const handleDefeatDismiss = () => {
    gameStore.dismissQuizDefeat();
  };

  const questionNum = quizUiStore.questionIndex + 1;
  const total = quizUiStore.totalQuestions;

  return (
    <div
      className="quiz layer-modal"
      role="dialog"
      aria-labelledby="quiz-title"
    >
      {usesHutOverlay ? (
        <>
          <img
            className="quiz-bg quiz-bg__forest"
            src={viewUrl}
            alt=""
            draggable={false}
          />
          <img
            className={`quiz-bg quiz-bg__hut ${bg.filterClass}`}
            src={houseUrl}
            alt=""
            draggable={false}
          />
        </>
      ) : (
        <img
          className={`quiz-bg ${bg.filterClass}`}
          src={bg.src}
          alt=""
          draggable={false}
        />
      )}
      <div className="quiz-bg__overlay" aria-hidden />

      <ModalCloseButton
        className="modal-close--viewport"
        onClick={handleAbandon}
        ariaLabel={resolveText(settingsUiContent.quizExit, locale)}
      />

      <div className="quiz-hud">
        <span className="quiz-hud__energy">
          <img src={hudIcons.energy} alt="" />
          {gameStore.energy}
        </span>
        <span className="quiz-hud__obereg">
          <img src={hudIcons.obereg} alt="" />
          {gameStore.talismans}
        </span>
      </div>

      {phase === 'victory' && (
        <div className="quiz-result quiz-result--win">
          <h2>{resolveText(settingsUiContent.quizVictory, locale)}</h2>
          <img
            className="quiz-result__portrait"
            src={spiritIllustrationUrl(spiritId as SpiritId)}
            alt=""
            draggable={false}
          />
          <p className="quiz-result__reward">{spirit.bookRewardDescription}</p>
          <p className="quiz-result__tale">{spirit.miniTale}</p>
          <button type="button" className="quiz-result__btn" onClick={handleClaim}>
            {resolveText(settingsUiContent.quizClaimReward, locale)}
          </button>
        </div>
      )}

      {phase === 'defeat' && (
        <div className="quiz-result quiz-result--lose">
          <h2 id="quiz-title">{spirit.name}</h2>
          <p className="quiz-result__lose">{quizUiStore.loseMessage}</p>
          <button
            type="button"
            className="quiz-result__btn"
            onClick={handleDefeatDismiss}
          >
            {resolveText(settingsUiContent.quizToIzba, locale)}
          </button>
        </div>
      )}

      {(phase === 'question' ||
        phase === 'correct' ||
        phase === 'wrong') && (
        <div
          className={`quiz-panel${phase === 'correct' ? ' quiz-panel--correct' : ''}${phase === 'wrong' ? ' quiz-panel--wrong' : ''}${phase === 'wrong' && quizUiStore.oberegShieldFlash ? ' quiz-panel--shield' : ''}`}
        >
          <header className="quiz-header">
            <h2 id="quiz-title">{spirit.name}</h2>
            <span className="quiz-progress">
              {resolveText(settingsUiContent.quizQuestionOf, locale)}{' '}
              <strong>{questionNum}</strong>{' '}
              {resolveText(settingsUiContent.quizOf, locale)}{' '}
              <strong>{total}</strong>
            </span>
            <div className="quiz-dots" aria-hidden>
              {Array.from({ length: total }, (_, i) => (
                <span
                  key={i}
                  className={getQuizDotClassName(i, questionIndex, phase)}
                />
              ))}
            </div>
          </header>

          {question && (
            <>
              <p className="quiz-question">{question.prompt}</p>
              <div className="quiz-answers">
                {question.options.map((opt, i) => {
                  const isPending = quizUiStore.pendingAnswerIndex === i;
                  const isCorrect =
                    phase === 'correct' && isPending;
                  const isWrong = phase === 'wrong' && isPending;
                  return (
                    <button
                      key={i}
                      type="button"
                      className={`quiz-answer${isCorrect ? ' quiz-answer--correct' : ''}${isWrong ? ' quiz-answer--wrong' : ''}${phase !== 'question' ? ' quiz-answer--disabled' : ''}`}
                      disabled={phase !== 'question'}
                      onClick={() => handleAnswer(i)}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {phase === 'wrong' && (
                <p className="quiz-wrong-hint">
                  {resolveText(settingsUiContent.quizWrongObereg, locale)}
                </p>
              )}
            </>
          )}
        </div>
      )}

      {!usesHutOverlay && (
        <img
          className="quiz-spirit-portrait"
          src={spiritPortraitPaths[spiritId as SpiritId]}
          alt=""
          draggable={false}
        />
      )}
    </div>
  );
});
