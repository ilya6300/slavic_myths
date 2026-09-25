/** Устаревший порог; модалка с первого tired-клика (`count > 0`). */
export const TIRED_CLICKS_BEFORE_MODAL = 0;

export function shouldOpenEnergyModalAfterTiredClick(
  tiredClickCount: number,
): boolean {
  return tiredClickCount > TIRED_CLICKS_BEFORE_MODAL;
}
