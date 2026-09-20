import { describe, expect, it } from 'vitest';
import { fragmentRequirements } from '../config/lootTables';
import { getFragmentPuzzleLayout } from '../config/bookFragmentPuzzleLayouts';
import {
  assertFragmentPuzzlePieceCount,
  FRAGMENT_PUZZLE_PIECE_COUNTS,
  isClosedPieceIndex,
} from './bookFragmentPuzzle';

describe('bookFragmentPuzzle', () => {
  it('should mark indices below revealedCount as open', () => {
    expect(isClosedPieceIndex(0, 3)).toBe(false);
    expect(isClosedPieceIndex(2, 3)).toBe(false);
    expect(isClosedPieceIndex(3, 3)).toBe(true);
    expect(isClosedPieceIndex(7, 3)).toBe(true);
  });

  it('should allow only piece counts from fragmentRequirements', () => {
    for (const n of [3, 5, 6, 8, 10]) {
      expect(() => assertFragmentPuzzlePieceCount(n)).not.toThrow();
    }
    expect(() => assertFragmentPuzzlePieceCount(7)).toThrow(/Invalid fragment puzzle/);
    expect(() => assertFragmentPuzzlePieceCount(8)).not.toThrow();
  });

  it('should list unique N from loot table as 3,5,6,8,10', () => {
    expect(FRAGMENT_PUZZLE_PIECE_COUNTS).toEqual([3, 5, 6, 8, 10]);
    const sum = Object.values(fragmentRequirements).reduce((a, b) => a + b, 0);
    expect(sum).toBe(43);
  });
});

describe('bookFragmentPuzzleLayouts', () => {
  for (const n of FRAGMENT_PUZZLE_PIECE_COUNTS) {
    it(`should expose ${n} unique jigsaw pieces for N=${n}`, () => {
      const layout = getFragmentPuzzleLayout(n);
      expect(layout.pieces).toHaveLength(n);
      const ids = layout.pieces.map((p) => p.id);
      expect(new Set(ids).size).toBe(n);
    });
  }

  it('should reject unknown piece counts', () => {
    expect(() => getFragmentPuzzleLayout(4)).toThrow();
  });
});
