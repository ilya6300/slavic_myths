/** Кликов с tired-bubble до открытия EnergyRewardModal (не с первого). */
export const TIRED_CLICKS_BEFORE_MODAL = 2;

export function shouldOpenEnergyModalAfterTiredClick(
  tiredClickCount: number,
): boolean {
  return tiredClickCount > TIRED_CLICKS_BEFORE_MODAL;
}
