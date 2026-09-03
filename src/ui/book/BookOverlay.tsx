import { observer } from 'mobx-react-lite';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  bookUi,
  furniture,
  hudIcons,
} from '../../config/assetRegistry';
import {
  SPIRIT_ORDER,
  getChapterLabel,
  getSpiritById,
  type SpiritChapter,
} from '../../data/spirits';
import { settingsUiContent, gradeLabels } from '../../data/dialogContent';
import {
  countDefeatedSpirits,
  findNextAvailableSpirit,
  isFragmentSpirit,
} from '../../domain/spiritQueue';
import { formatLocalizedTemplate, resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { gameStore } from '../../store/GameStore';
import { bookUiStore } from '../../store/bookUiStore';
import { catDialogStore } from '../../store/catDialogStore';
import { pickCatLine } from '../../data/catDialogs';
import {
  getFolktalePageCount,
  getFolktalePages,
  hasFolktale,
} from '../../data/folktales';
import { spiritIllustrationUrl } from './spiritIllustrationUrl';
import { useBookPageFlip } from './useBookPageFlip';

const CHAPTERS: SpiritChapter[] = ['dom', 'dvor', 'les', 'epoch'];

function computeFlightTransform(from: DOMRect, stageRect: DOMRect): string {
  const fromCx = from.left + from.width / 2;
  const fromCy = from.top + from.height / 2;
  const toCx = stageRect.left + stageRect.width / 2;
  const toCy = stageRect.top + stageRect.height / 2;
  const dx = fromCx - toCx;
  const dy = fromCy - toCy;
  const scale = from.width / stageRect.width;
  return `translate(${dx}px, ${dy}px) scale(${scale})`;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const BookOverlay = observer(function BookOverlay() {
  const { locale } = useLocale();
  const stageRef = useRef<HTMLDivElement>(null);
  const [flightTransform, setFlightTransform] = useState('none');
  const [flightVisible, setFlightVisible] = useState(false);
  const [revealActive, setRevealActive] = useState(false);

  const phase = bookUiStore.phase;
  const spreadMode = bookUiStore.spreadMode;
  const showContent = bookUiStore.showPageContent;

  useLayoutEffect(() => {
    const from = bookUiStore.flightFrom;
    const stage = stageRef.current;
    if (!from || !stage) return;

    const stageRect = stage.getBoundingClientRect();
    const fromTransform = computeFlightTransform(from, stageRect);

    if (phase === 'flying') {
      setFlightVisible(true);
      setFlightTransform(fromTransform);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlightTransform('translate(0px, 0px) scale(1)');
        });
      });
      return () => cancelAnimationFrame(id);
    }

    if (phase === 'closing') {
      setFlightVisible(true);
      setFlightTransform('translate(0px, 0px) scale(1)');
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlightTransform(fromTransform);
        });
      });
      return () => cancelAnimationFrame(id);
    }

    if (phase === 'content' || phase === 'crossfading') {
      setFlightVisible(false);
    }

    return undefined;
  }, [phase, bookUiStore.flightFrom]);

  const isOverlayActive = bookUiStore.isOverlayActive;
  const pageIndex = isOverlayActive ? bookUiStore.pageIndex : 0;
  const spiritId = SPIRIT_ORDER[pageIndex] ?? SPIRIT_ORDER[0];
  const spirit = getSpiritById(spiritId)!;
  const status = isOverlayActive
    ? (gameStore.spiritStatuses[spiritId] ?? 'locked')
    : 'locked';
  const isDefeated = status === 'defeated';
  const alreadyRevealed = gameStore.illustrationRevealed.includes(spiritId);

  useEffect(() => {
    if (!isOverlayActive || !isDefeated || alreadyRevealed) {
      setRevealActive(false);
      return;
    }
    if (prefersReducedMotion()) {
      gameStore.markIllustrationRevealed(spiritId);
      setRevealActive(false);
      return;
    }
    setRevealActive(true);
  }, [isOverlayActive, spiritId, isDefeated, alreadyRevealed]);

  const folktalePageCount = getFolktalePageCount(spiritId);
  const folktalePages = getFolktalePages(spiritId, locale);
  const canPrev = isOverlayActive
    ? spreadMode === 'folktale'
      ? bookUiStore.folktalePageIndex > 0
      : pageIndex > 0
    : false;
  const canNext = isOverlayActive
    ? spreadMode === 'folktale'
      ? bookUiStore.folktalePageIndex < folktalePageCount - 1
      : pageIndex < SPIRIT_ORDER.length - 1
    : false;

  const {
    navigateNext,
    navigatePrev,
    getPageFlipClass,
    spreadPointerHandlers,
  } = useBookPageFlip(canPrev, canNext, spreadMode);

  if (!isOverlayActive) return null;

  const defeatedCount = countDefeatedSpirits(gameStore.spiritStatuses);
  const nextAvailable = findNextAvailableSpirit(gameStore.spiritStatuses);
  const blocked = bookUiStore.isInteractionBlocked;
  const showFolktaleBtn =
    status === 'defeated' && hasFolktale(spiritId) && spreadMode === 'spirit';
  const folktalePageText =
    folktalePages[bookUiStore.folktalePageIndex] ?? '';

  const leftFlipClass = getPageFlipClass('left');
  const rightFlipClass = getPageFlipClass('right');

  const handleRevealEnd = () => {
    if (!revealActive) return;
    gameStore.markIllustrationRevealed(spiritId);
    setRevealActive(false);
  };

  const handleClose = () => bookUiStore.close();

  const handleGoQuest = () => {
    if (blocked || status !== 'available') return;
    if (!gameStore.canStartQuiz(spiritId)) return;
    const started = gameStore.startQuiz(spiritId);
    if (started) bookUiStore.close();
  };

  const handleOpenFolktale = () => {
    if (blocked || status !== 'defeated' || !hasFolktale(spiritId)) return;
    if (!gameStore.folktaleIntroShown) {
      const line = pickCatLine('folktale_intro', locale);
      if (line) {
        catDialogStore.show([{ text: line, mode: 'footnote', blocking: false }]);
      }
      gameStore.markFolktaleIntroShown();
    }
    bookUiStore.enterFolktaleMode();
  };

  const handleBackToSpirit = () => {
    if (blocked) return;
    bookUiStore.exitFolktaleMode();
  };

  const handleJumpNext = () => {
    if (blocked) return;
    if (nextAvailable) bookUiStore.jumpToSpirit(nextAvailable);
  };

  const showFlightLayer =
    flightVisible && (phase === 'flying' || phase === 'closing');

  const illustrationClassName = [
    'book-illustration',
    isDefeated ? 'book-illustration--diorama' : '',
    isDefeated ? 'book-illustration--unlocked' : '',
    revealActive ? 'book-illustration--revealing' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className="layer-modal book-modal"
      data-phase={phase}
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-page-name"
    >
      {showFlightLayer && (
        <div
          className="book-flight"
          style={{ transform: flightTransform }}
        >
          <img src={furniture.bookClosed} alt="" draggable={false} />
        </div>
      )}

      <div
        ref={stageRef}
        className="book-modal__stage"
        onClick={(e) => e.stopPropagation()}
      >
        {showContent && (
          <div className="book-sparkle" aria-hidden>
            {Array.from({ length: 8 }, (_, i) => (
              <span key={i} className="book-sparkle__particle" />
            ))}
          </div>
        )}

        <img
          className="book-modal__cover-open"
          src={furniture.bookOpen}
          alt=""
          draggable={false}
        />

        <div className="book-modal__progress" aria-hidden>
          <img
            className="book-modal__progress-track"
            src={bookUi.chapterProgress}
            alt=""
            draggable={false}
          />
          <div className="book-modal__progress-beads">
            {CHAPTERS.map((ch) => {
              const active = spirit.chapter === ch;
              return (
                <span
                  key={ch}
                  className={`book-modal__progress-bead${active ? ' book-modal__progress-bead--active' : ''}`}
                  title={getChapterLabel(ch)}
                />
              );
            })}
          </div>
          <span className="book-modal__counter">
            {defeatedCount} / {SPIRIT_ORDER.length}{' '}
            {resolveText(settingsUiContent.bookSpiritsCount, locale)}
          </span>
        </div>

        {nextAvailable && nextAvailable !== spiritId && (
          <button
            type="button"
            className="book-modal__bookmark"
            onClick={handleJumpNext}
            disabled={blocked}
          >
            <img
              className="book-modal__bookmark-img"
              src={bookUi.bookmark}
              alt=""
              draggable={false}
            />
            <span className="book-modal__bookmark-label">
              {resolveText(settingsUiContent.bookNextQuest, locale)} →
            </span>
          </button>
        )}

        <button
          type="button"
          className="book-modal__close"
          onClick={handleClose}
          disabled={blocked}
          aria-label={resolveText(settingsUiContent.dialogClose, locale)}
        >
          <img src={bookUi.closeBtn} alt="" draggable={false} />
        </button>

        <div
          className={`book-modal__spread${showContent ? ' book-modal__spread--visible' : ''}${spreadMode === 'folktale' ? ' book-modal__spread--folktale' : ''}`}
          {...spreadPointerHandlers}
        >
          <div
            className={`book-page book-page--left${leftFlipClass ? ` ${leftFlipClass}` : ''}`}
          >
            {spreadMode === 'folktale' ? (
              <>
                <h3 id="book-page-name" className="book-page__name">
                  {resolveText(settingsUiContent.bookGoFolktale, locale)}
                </h3>
                <p className="book-page__description book-page__folktale">
                  {folktalePageText}
                </p>
                <button
                  type="button"
                  className="book-page__quest-btn book-page__folktale-btn"
                  onClick={handleBackToSpirit}
                  disabled={blocked}
                >
                  <img
                    className="book-page__quest-btn-bg"
                    src={bookUi.questBtn}
                    alt=""
                    draggable={false}
                  />
                  <span className="book-page__quest-btn-copy">
                    <span className="book-page__quest-btn-label">
                      {resolveText(settingsUiContent.bookBackToSpirit, locale)}
                    </span>
                  </span>
                </button>
              </>
            ) : (
              <>
            <h3 id="book-page-name" className="book-page__name">
              {spirit.name}
            </h3>
            <p className="book-page__description">{spirit.bookDescription}</p>
            <div className="book-page__reward-block">
              <div className="book-page__reward-heading">
                <span className="book-page__reward-label">
                  {resolveText(settingsUiContent.bookRewardLabel, locale)}
                </span>
                {spirit.reward.kind === 'day_coin_bonus' &&
                  spirit.reward.percent != null && (
                    <>
                      <img
                        className="book-page__reward-coin"
                        src={hudIcons.coin}
                        alt=""
                        draggable={false}
                      />
                      <span className="book-page__reward-amount">
                        × {spirit.reward.percent}%
                      </span>
                    </>
                  )}
              </div>
              <p className="book-page__reward">{spirit.bookRewardDescription}</p>
            </div>

            {status === 'available' && (
              <button
                type="button"
                className="book-page__quest-btn"
                onClick={handleGoQuest}
                disabled={blocked}
              >
                <img
                  className="book-page__quest-btn-bg"
                  src={bookUi.questBtn}
                  alt=""
                  draggable={false}
                />
                <span className="book-page__quest-btn-copy">
                  <span className="book-page__quest-btn-label">
                    {resolveText(settingsUiContent.bookGoQuest, locale)}
                  </span>
                </span>
              </button>
            )}

            {status === 'defeated' && (
              <div className="book-page__defeated">
                <span className="book-page__defeated-badge">
                  ✓ {resolveText(settingsUiContent.bookDefeated, locale)}
                </span>
                <p className="book-page__mini-tale">{spirit.miniTale}</p>
              </div>
            )}

            {showFolktaleBtn && (
              <button
                type="button"
                className="book-page__quest-btn book-page__folktale-btn"
                onClick={handleOpenFolktale}
                disabled={blocked}
              >
                <img
                  className="book-page__quest-btn-bg"
                  src={bookUi.questBtn}
                  alt=""
                  draggable={false}
                />
                <span className="book-page__quest-btn-copy">
                  <span className="book-page__quest-btn-label">
                    {resolveText(settingsUiContent.bookGoFolktale, locale)}
                  </span>
                </span>
              </button>
            )}

            {status === 'locked' && isFragmentSpirit(spiritId) && (
              <div className="book-page__fragments">
                <p className="book-page__fragment-progress">
                  {formatLocalizedTemplate(
                    settingsUiContent.bookFragmentProgress,
                    locale,
                    {
                      current: gameStore.fragmentCounts[spiritId] ?? 0,
                      total: spirit.unlock.fragmentCount ?? 0,
                    },
                  )}
                </p>
                <button
                  type="button"
                  className={`book-page__fragment-select${
                    gameStore.selectedFragmentSpiritId === spiritId
                      ? ' book-page__fragment-select--active'
                      : ''
                  }`}
                  onClick={() => gameStore.selectFragmentSpirit(spiritId)}
                  disabled={blocked}
                >
                  {gameStore.selectedFragmentSpiritId === spiritId
                    ? resolveText(
                        settingsUiContent.bookFragmentSelected,
                        locale,
                      )
                    : resolveText(
                        settingsUiContent.bookSelectFragment,
                        locale,
                      )}
                </button>
              </div>
            )}

            {status === 'locked' && !isFragmentSpirit(spiritId) && (
              <p className="book-page__locked">
                {spirit.lockedHint ||
                  resolveText(settingsUiContent.bookLocked, locale)}
              </p>
            )}

            {status === 'locked' &&
              isFragmentSpirit(spiritId) &&
              spirit.lockedHint && (
                <p className="book-page__locked book-page__locked--hint">
                  {spirit.lockedHint}
                </p>
              )}
              </>
            )}
          </div>

          <div
            className={`book-page book-page--right${status !== 'defeated' ? ' book-page--silhouette' : ''}${rightFlipClass ? ` ${rightFlipClass}` : ''}`}
          >
            <img
              className={illustrationClassName}
              src={spiritIllustrationUrl(spiritId)}
              alt=""
              draggable={false}
              onAnimationEnd={handleRevealEnd}
            />
            <span
              className={`book-page__grade book-page__grade--${spirit.grade}`}
            >
              {resolveText(gradeLabels[spirit.grade], locale)}
            </span>
          </div>
        </div>

        {canPrev && (
          <button
            type="button"
            className="book-nav book-nav--prev"
            onClick={navigatePrev}
            disabled={blocked || bookUiStore.isFlipping}
            aria-label={resolveText(settingsUiContent.bookPrevPage, locale)}
          >
            <img src={bookUi.arrowLeft} alt="" draggable={false} />
          </button>
        )}
        {canNext && (
          <button
            type="button"
            className="book-nav book-nav--next"
            onClick={navigateNext}
            disabled={blocked || bookUiStore.isFlipping}
            aria-label={resolveText(settingsUiContent.bookNextPage, locale)}
          >
            <img src={bookUi.arrowRight} alt="" draggable={false} />
          </button>
        )}
      </div>
    </div>
  );
});
