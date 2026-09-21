import type { MouseEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { DAILY_QUEST_CLICK_GOAL } from '../../config/gameConstants';
import { dailyQuestContent } from '../../data/dailyQuestContent';
import { formatLocalizedTemplate, resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import type { SpiritId } from '../../config/assetRegistry';
import { getSpiritById } from '../../data/spirits';
import { appConfig } from '../../config/gameConstants';
import { gameStore } from '../../store/GameStore';

export const DailyQuestPanel = observer(function DailyQuestPanel() {
  const { locale } = useLocale();

  if (!gameStore.shouldShowDailyQuestPanel()) return null;

  const clicksDone = Math.min(
    gameStore.dailyQuestClickProgress,
    DAILY_QUEST_CLICK_GOAL,
  );
  const clicksComplete = clicksDone >= DAILY_QUEST_CLICK_GOAL;
  const taleComplete = gameStore.dailyQuestTaleCorrect;
  const claimedToday = gameStore.isDailyQuestRewardClaimedToday();
  const canClaim = gameStore.canClaimDailyQuestFragment();
  const showClaimButton =
    canClaim &&
    (!claimedToday || appConfig.debugIgnoreDailyQuestDayLimit);
  const showDone = claimedToday && !showClaimButton;
  const fragmentTargetId = gameStore.getDailyQuestFragmentTargetSpiritId();
  const fragmentSpiritName =
    (fragmentTargetId ? getSpiritById(fragmentTargetId)?.name : null) ?? '—';
  const taleSpiritId = gameStore.dailyQuestTaleSpiritId;
  const taleSpiritName =
    (taleSpiritId ? getSpiritById(taleSpiritId as SpiritId)?.name : null) ??
    '—';

  const openTale = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (taleComplete) return;
    gameStore.beginDailyQuestTaleInBook();
  };

  return (
    <aside className="daily-quest-panel" aria-label="Daily quests">
      <h3 className="daily-quest-panel__title">
        {resolveText(dailyQuestContent.panelTitle, locale)}
      </h3>
      <ul className="daily-quest-panel__list">
        <li
          className={`daily-quest-panel__item${clicksComplete ? ' daily-quest-panel__item--done' : ''}`}
        >
          <span className="daily-quest-panel__label">
            {resolveText(dailyQuestContent.taskClicks, locale)}
          </span>
          <span className="daily-quest-panel__meta">
            {formatLocalizedTemplate(dailyQuestContent.clicksProgress, locale, {
              done: clicksDone,
              total: DAILY_QUEST_CLICK_GOAL,
            })}
          </span>
        </li>
        <li
          className={`daily-quest-panel__item${taleComplete ? ' daily-quest-panel__item--done' : ''}`}
        >
          <span className="daily-quest-panel__label">
            {resolveText(dailyQuestContent.taskTale, locale)}
          </span>
          {taleComplete ? (
            <span className="daily-quest-panel__meta">
              {resolveText(dailyQuestContent.taleDone, locale)}
            </span>
          ) : (
            <>
              <span className="daily-quest-panel__meta daily-quest-panel__meta--tale-spirit">
                {formatLocalizedTemplate(
                  dailyQuestContent.taleSpiritHint,
                  locale,
                  { spirit: taleSpiritName },
                )}
              </span>
            <button
              type="button"
              className="daily-quest-panel__tale-btn"
              onClick={openTale}
            >
              {resolveText(dailyQuestContent.taleOpen, locale)}
            </button>
            </>
          )}
        </li>
      </ul>
      {showDone ? (
        <p className="daily-quest-panel__claim daily-quest-panel__claim--done">
          {resolveText(dailyQuestContent.claimDone, locale)}
        </p>
      ) : showClaimButton ? (
        <button
          type="button"
          className="daily-quest-panel__claim"
          onClick={() => {
            gameStore.claimDailyQuestFragment();
          }}
        >
          {formatLocalizedTemplate(dailyQuestContent.claimFragment, locale, {
            spirit: fragmentSpiritName,
          })}
        </button>
      ) : (
        <button
          type="button"
          className="daily-quest-panel__claim"
          disabled
        >
          {formatLocalizedTemplate(dailyQuestContent.claimFragment, locale, {
            spirit: fragmentSpiritName,
          })}
        </button>
      )}
    </aside>
  );
});
