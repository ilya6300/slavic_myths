import { observer } from 'mobx-react-lite';
import { DAILY_QUEST_CLICK_GOAL } from '../../config/gameConstants';
import { dailyQuestContent } from '../../data/dailyQuestContent';
import { formatLocalizedTemplate, resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { gameStore } from '../../store/GameStore';
import { dailyQuestUiStore } from '../../store/dailyQuestUiStore';
import type { SpiritId } from '../../config/assetRegistry';

export const DailyQuestPanel = observer(function DailyQuestPanel() {
  const { locale } = useLocale();

  if (!gameStore.shouldShowDailyQuestPanel()) return null;

  const clicksDone = Math.min(
    gameStore.dailyQuestClickProgress,
    DAILY_QUEST_CLICK_GOAL,
  );
  const clicksComplete = clicksDone >= DAILY_QUEST_CLICK_GOAL;
  const taleComplete = gameStore.dailyQuestTaleCorrect;
  const claimed = gameStore.isDailyQuestRewardClaimedToday();
  const canClaim = gameStore.canClaimDailyQuestFragment();

  const openTale = () => {
    const spiritId = gameStore.dailyQuestTaleSpiritId as SpiritId | null;
    if (!spiritId || taleComplete) return;
    dailyQuestUiStore.openTale(spiritId);
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
            <button
              type="button"
              className="daily-quest-panel__link"
              onClick={openTale}
            >
              {resolveText(dailyQuestContent.taleOpen, locale)}
            </button>
          )}
        </li>
      </ul>
      {claimed ? (
        <p className="daily-quest-panel__claim daily-quest-panel__claim--done">
          {resolveText(dailyQuestContent.claimDone, locale)}
        </p>
      ) : (
        <button
          type="button"
          className="daily-quest-panel__claim"
          disabled={!canClaim}
          onClick={() => gameStore.claimDailyQuestFragment()}
        >
          {resolveText(dailyQuestContent.claimFragment, locale)}
        </button>
      )}
    </aside>
  );
});
