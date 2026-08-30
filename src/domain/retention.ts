/**
 * Крючки удержания: баннер облака, сноска «сундук готов».
 * Канон: scenario.md §6.1, §12
 */

export function shouldShowCloudBanner(
  firstChestOpened: boolean,
  cloudBannerDismissed: boolean,
  isAuthorized: boolean,
): boolean {
  if (!firstChestOpened) return false;
  if (cloudBannerDismissed) return false;
  if (isAuthorized) return false;
  return true;
}

export function shouldShowChestReadyFootnote(
  onboardingCompleted: boolean,
  chestVisible: boolean,
  chestReady: boolean,
): boolean {
  return onboardingCompleted && chestVisible && chestReady;
}
