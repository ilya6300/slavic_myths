import { observer } from 'mobx-react-lite';
import { settingsUiContent } from '../../data/dialogContent';
import {
  getChestLuckBonusPercent,
  getEnergyRegenPerMinute,
} from '../../domain/catStats';
import { formatLocalizedTemplate, resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { gameStore } from '../../store/GameStore';

export const ProfileStatsPanel = observer(function ProfileStatsPanel() {
  const { locale } = useLocale();
  const regen = getEnergyRegenPerMinute(gameStore.energyRegenBonusPercent);
  const luck = getChestLuckBonusPercent(
    gameStore.skins.domovoy,
    gameStore.luckCoins,
  );

  const rows = [
    {
      label: resolveText(settingsUiContent.profileStatMaxEnergy, locale),
      value: String(gameStore.maxEnergy),
    },
    {
      label: resolveText(settingsUiContent.profileStatEnergyRegen, locale),
      value: `${regen.toFixed(1)} ${resolveText(settingsUiContent.profileStatPerMinute, locale)}`,
    },
    {
      label: resolveText(settingsUiContent.profileStatLuckCoinsCap, locale),
      value: String(gameStore.luckCoinsCap),
    },
    {
      label: resolveText(settingsUiContent.profileStatLuckCoinsNow, locale),
      value: `${gameStore.luckCoins} / ${gameStore.luckCoinsCap}`,
    },
    {
      label: resolveText(settingsUiContent.profileStatBaseChestLuck, locale),
      value: `+${getChestLuckBonusPercent(gameStore.skins.domovoy, 0).totalPercent.toFixed(1)}%`,
    },
    {
      label: resolveText(settingsUiContent.profileStatCurrentChestLuck, locale),
      value: formatLocalizedTemplate(
        settingsUiContent.profileStatCurrentChestLuckValue,
        locale,
        {
          total: luck.totalPercent.toFixed(1),
          domovoi: luck.domovoiPercent,
          coins: gameStore.luckCoins,
          coinsBonus: luck.coinsPercent.toFixed(1),
        },
      ),
    },
    {
      label: resolveText(settingsUiContent.profileStatZhirdyayCaught, locale),
      value: String(gameStore.zhirdyayDefeatedCount),
    },
  ];

  return (
    <div className="profile-stats">
      <dl className="profile-stats__list">
        {rows.map((row) => (
          <div key={row.label} className="profile-stats__row">
            <dt className="profile-stats__label">{row.label}</dt>
            <dd className="profile-stats__value">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
});
