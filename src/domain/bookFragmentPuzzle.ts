import { fragmentRequirements } from '../config/lootTables';

/** Уникальные N из loot table / draft §8 (jigsaw-сетки). */
export const FRAGMENT_PUZZLE_PIECE_COUNTS = [
  ...new Set(Object.values(fragmentRequirements)),
].sort((a, b) => a - b);

export function isClosedPieceIndex(
  index: number,
  revealedCount: number,
): boolean {
  return index >= revealedCount;
}

export function assertFragmentPuzzlePieceCount(pieceCount: number): void {
  if (!FRAGMENT_PUZZLE_PIECE_COUNTS.includes(pieceCount)) {
    throw new Error(
      `Invalid fragment puzzle piece count: ${pieceCount} (allowed: ${FRAGMENT_PUZZLE_PIECE_COUNTS.join(', ')})`,
    );
  }
}
