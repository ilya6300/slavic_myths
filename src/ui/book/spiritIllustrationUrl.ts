import {
  spiritIllustrationPaths,
  spiritPortraitPaths,
  type SpiritId,
} from '../../config/assetRegistry';

/** Всегда 3D из illustration_book; силуэт до победы — CSS `.book-page--silhouette`. */
export function spiritIllustrationUrl(spiritId: SpiritId): string {
  return spiritIllustrationPaths[spiritId] ?? spiritPortraitPaths[spiritId];
}
