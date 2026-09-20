import {
  spiritIllustrationPaths,
  spiritPortraitPaths,
  type SpiritId,
} from '../../config/assetRegistry';

/**
 * Всегда 3D из illustration_book.
 * Не-фрагментные до победы — `.book-page--silhouette` (grayscale).
 * Фрагментные locked — `BookFragmentPuzzleIllustration` (кусочки + veil grayscale).
 * Фрагментные available — полный цвет без silhouette.
 */
export function spiritIllustrationUrl(spiritId: SpiritId): string {
  return spiritIllustrationPaths[spiritId] ?? spiritPortraitPaths[spiritId];
}
