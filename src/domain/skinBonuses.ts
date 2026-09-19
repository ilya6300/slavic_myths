import { settingsUiContent } from '../data/dialogContent';
import type { ProfileSkinCategory } from '../data/profileCatalog';
import { formatLocalizedTemplate } from '../i18n/resolve';
import type { Locale } from '../i18n/types';
import { getBrownieLuckBonusPercent } from './brownieLuck';

export function getSkinBonusLines(
  category: ProfileSkinCategory,
  skinId: string,
  locale: Locale,
): string[] {
  if (category === 'brownie') {
    const percent = getBrownieLuckBonusPercent(skinId);
    return [
      formatLocalizedTemplate(settingsUiContent.skinBonusBrownieLuck, locale, {
        percent,
      }),
    ];
  }

  return [];
}
