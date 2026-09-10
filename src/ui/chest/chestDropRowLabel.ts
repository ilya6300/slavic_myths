import { CHEST_ENERGY_BONUS } from '../../config/gameConstants';
import type { MiracleConsolationReward, RegularChestRewardType } from '../../config/lootTables';
import { gradeLabels, settingsUiContent } from '../../data/dialogContent';
import type { DropChanceRewardType } from '../../domain/chestDropChances';
import type { Grade } from '../../domain/grade';
import type { Locale } from '../../i18n/types';
import { formatLocalizedTemplate, resolveText } from '../../i18n/resolve';

function isTitleRewardType(
  rewardType: DropChanceRewardType,
): rewardType is 'title_common' | 'title_rare' | 'title_epic' {
  return (
    rewardType === 'title_common' ||
    rewardType === 'title_rare' ||
    rewardType === 'title_epic'
  );
}

function miracleRewardLabel(
  reward: MiracleConsolationReward,
  locale: Locale,
): string {
  switch (reward) {
    case 'obereg_x2':
      return resolveText(settingsUiContent.chestRewardOberegX2, locale);
    case 'energy_full':
      return resolveText(settingsUiContent.chestRewardEnergy, locale).replace(
        '{amount}',
        String(CHEST_ENERGY_BONUS * 2),
      );
    case 'chest_key':
      return resolveText(settingsUiContent.chestRewardChestKey, locale);
    case 'spirit_key':
      return resolveText(settingsUiContent.chestRewardSpiritKey, locale);
    case 'title_epic':
      return `${resolveText(settingsUiContent.chestRewardTitle, locale)} (${resolveText(gradeLabels.epic, locale)})`;
    case 'izba_skin_epic':
      return `${resolveText(settingsUiContent.chestRewardIzbaSkin, locale)} (${resolveText(gradeLabels.epic, locale)})`;
    case 'title_epoch':
      return `${resolveText(settingsUiContent.chestRewardTitle, locale)} (${resolveText(gradeLabels.epoch, locale)})`;
    default:
      return reward;
  }
}

function regularRewardBaseLabel(
  rewardType: RegularChestRewardType,
  locale: Locale,
): string {
  switch (rewardType) {
    case 'cat_skin':
      return resolveText(settingsUiContent.chestRewardCatSkin, locale);
    case 'brownie_skin':
      return resolveText(settingsUiContent.chestRewardBrownieSkin, locale);
    case 'izba_skin':
      return resolveText(settingsUiContent.chestRewardIzbaSkin, locale);
    case 'window_skin':
      return resolveText(settingsUiContent.chestRewardWindowSkin, locale);
    case 'title_common':
    case 'title_rare':
    case 'title_epic':
      return resolveText(settingsUiContent.chestRewardTitle, locale);
    case 'spirit_key':
      return resolveText(settingsUiContent.chestRewardSpiritKey, locale);
    case 'chest_key':
      return resolveText(settingsUiContent.chestRewardChestKey, locale);
    case 'energy_bonus':
      return formatLocalizedTemplate(settingsUiContent.chestRewardEnergy, locale, {
        amount: CHEST_ENERGY_BONUS,
      });
    case 'obereg':
      return resolveText(settingsUiContent.chestRewardObereg, locale);
    case 'fragment':
      return resolveText(settingsUiContent.chestRewardFragment, locale);
    default:
      return rewardType;
  }
}

export function formatChestDropRowLabel(
  rewardType: DropChanceRewardType,
  grade: Grade | undefined,
  locale: Locale,
): string {
  if (rewardType === 'fragment') {
    const base = regularRewardBaseLabel('fragment', locale);
    if (!grade) return base;
    return `${base} (${resolveText(gradeLabels[grade], locale)})`;
  }

  if (
    rewardType === 'obereg_x2' ||
    rewardType === 'energy_full' ||
    rewardType === 'title_epoch' ||
    rewardType === 'izba_skin_epic' ||
    rewardType === 'title_epic'
  ) {
    return miracleRewardLabel(rewardType as MiracleConsolationReward, locale);
  }

  if (rewardType === 'chest_key' || rewardType === 'spirit_key') {
    return miracleRewardLabel(rewardType, locale);
  }

  const base = regularRewardBaseLabel(rewardType as RegularChestRewardType, locale);
  if (!grade) return base;

  if (isTitleRewardType(rewardType)) {
    return `${base} (${resolveText(gradeLabels[grade], locale)})`;
  }

  return `${base} (${resolveText(gradeLabels[grade], locale)})`;
}
