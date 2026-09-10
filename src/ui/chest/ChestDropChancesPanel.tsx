import { settingsUiContent } from '../../data/dialogContent';
import type { ChestDropPreview } from '../../domain/chestDropChances';
import { formatLocalizedTemplate, resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { formatChestDropRowLabel } from './chestDropRowLabel';

interface ChestDropChancesPanelProps {
  preview: ChestDropPreview;
  isMiracle?: boolean;
}

export function ChestDropChancesPanel({
  preview,
  isMiracle = false,
}: ChestDropChancesPanelProps) {
  const { locale } = useLocale();
  const rarePlusLabel = resolveText(settingsUiContent.chestLuckRarePlus, locale);

  return (
    <div className="chest-modal__drops">
      {!isMiracle && (
        <p className="chest-modal__drops-header">
          {formatLocalizedTemplate(settingsUiContent.chestLuckBonusLine, locale, {
            domovoi: preview.domovoiLuckPercent,
            coins: preview.luckCoins,
            coinsBonus: preview.luckCoinsBonusPercent,
            rarePlus: rarePlusLabel,
          })}
        </p>
      )}
      <p className="chest-modal__drops-disclaimer">
        {resolveText(settingsUiContent.chestDropDisclaimer, locale)}
      </p>
      <ul className="chest-modal__drops-list">
        {preview.rows.map((row) => (
          <li
            key={`${row.rewardType}-${row.grade ?? ''}-${row.exhausted ? 'x' : ''}`}
            className="chest-modal__drops-row"
          >
            <span className="chest-modal__drops-label">
              {formatChestDropRowLabel(row.rewardType, row.grade, locale)}
            </span>
            <span className="chest-modal__drops-percent">
              {row.exhausted
                ? resolveText(settingsUiContent.chestDropInCollection, locale)
                : `${row.percent.toFixed(2)}%`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ChestDropChancesToggle({
  expanded,
  onToggle,
}: {
  expanded: boolean;
  onToggle: () => void;
}) {
  const { locale } = useLocale();

  return (
    <button
      type="button"
      className="chest-modal__drops-toggle"
      onClick={onToggle}
    >
      {resolveText(
        expanded
          ? settingsUiContent.chestHideDropChances
          : settingsUiContent.chestShowDropChances,
        locale,
      )}
    </button>
  );
}
