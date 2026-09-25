import { observer } from 'mobx-react-lite';
import { getSpiritById } from '../../data/spirits';
import { dailyQuestContent } from '../../data/dailyQuestContent';
import { formatLocalizedTemplate, resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { gameStore } from '../../store/GameStore';
import { dailyQuestUiStore } from '../../store/dailyQuestUiStore';
import { ModalCloseButton } from '../common/ModalCloseButton';

export const DailyQuestTaleModal = observer(function DailyQuestTaleModal() {
  const { locale } = useLocale();
  if (!dailyQuestUiStore.isOpen || !dailyQuestUiStore.spiritId) return null;

  const spirit = getSpiritById(dailyQuestUiStore.spiritId);
  const question = dailyQuestUiStore.question;
  if (!spirit || !question) return null;

  const intro = formatLocalizedTemplate(
    dailyQuestContent.taleIntro,
    locale,
    { spirit: resolveText(spirit.name, locale) },
  );

  const handleAnswer = (index: number) => {
    gameStore.submitDailyQuestTaleAnswer(index);
  };

  return (
    <div className="daily-quest-modal" role="dialog" aria-modal="true">
      <div className="daily-quest-modal__panel">
        <ModalCloseButton
          className="daily-quest-modal__close"
          onClick={() => dailyQuestUiStore.close()}
        />
        <h2 className="daily-quest-modal__title">
          {resolveText(dailyQuestContent.taleModalTitle, locale)}
        </h2>
        <p className="daily-quest-modal__intro">{intro}</p>
        <p className="daily-quest-modal__tale">
          {resolveText(spirit.miniTale, locale)}
        </p>
        <p className="daily-quest-modal__prompt">
          {resolveText(question.prompt, locale)}
        </p>
        <div className="daily-quest-modal__answers">
          {question.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              className="quiz-answer daily-quest-modal__answer"
              onClick={() => handleAnswer(i)}
            >
              {resolveText(opt, locale)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
