import { assertFragmentPuzzlePieceCount } from '../domain/bookFragmentPuzzle';

export type FragmentPuzzlePiece = { id: string; pathD: string };

export type FragmentPuzzleLayout = {
  viewBox: string;
  pieces: FragmentPuzzlePiece[];
};

/**
 * Сетки jigsaw (objectBoundingBox 0–1):
 * 3 → 1×3, 5 → 5×1, 6 → 3×2, 8 → 4×2, 10 → 5×2.
 */
const GRID_BY_COUNT: Record<number, { cols: number; rows: number }> = {
  3: { cols: 3, rows: 1 },
  5: { cols: 5, rows: 1 },
  6: { cols: 3, rows: 2 },
  8: { cols: 4, rows: 2 },
  10: { cols: 5, rows: 2 },
};

const TAB = 0.035;

function tabOut(edgeIndex: number, pieceIndex: number): boolean {
  return (edgeIndex + pieceIndex) % 2 === 0;
}

/** Горизонтальный сегмент с опциональным «клювом» вверх/вниз посередине. */
function hLine(
  x0: number,
  y: number,
  x1: number,
  bump: 'none' | 'out' | 'in',
): string {
  if (bump === 'none' || Math.abs(x1 - x0) < TAB * 3) {
    return `L ${x1} ${y}`;
  }
  const mid = (x0 + x1) / 2;
  const r = TAB;
  const sign = bump === 'out' ? 1 : -1;
  const cy = y + sign * r;
  return `L ${mid - r} ${y} Q ${mid} ${cy} ${mid + r} ${y} L ${x1} ${y}`;
}

function vLine(
  x: number,
  y0: number,
  y1: number,
  bump: 'none' | 'out' | 'in',
): string {
  if (bump === 'none' || Math.abs(y1 - y0) < TAB * 3) {
    return `L ${x} ${y1}`;
  }
  const mid = (y0 + y1) / 2;
  const r = TAB;
  const sign = bump === 'out' ? 1 : -1;
  const cx = x + sign * r;
  return `L ${x} ${mid - r} Q ${cx} ${mid} ${x} ${mid + r} L ${x} ${y1}`;
}

function piecePath(
  col: number,
  row: number,
  cols: number,
  rows: number,
  pieceIndex: number,
): string {
  const w = 1 / cols;
  const h = 1 / rows;
  const x0 = col * w;
  const y0 = row * h;
  const x1 = x0 + w;
  const y1 = y0 + h;

  const topBump =
    row === 0
      ? 'none'
      : tabOut(col, pieceIndex)
        ? 'in'
        : 'out';
  const bottomBump =
    row === rows - 1
      ? 'none'
      : tabOut(col + rows, pieceIndex)
        ? 'out'
        : 'in';
  const leftBump =
    col === 0
      ? 'none'
      : tabOut(row, pieceIndex)
        ? 'in'
        : 'out';
  const rightBump =
    col === cols - 1
      ? 'none'
      : tabOut(row + cols, pieceIndex)
        ? 'out'
        : 'in';

  let d = `M ${x0} ${y0}`;
  d += ' ' + hLine(x0, y0, x1, topBump === 'none' ? 'none' : topBump === 'out' ? 'out' : 'in');
  d += ' ' + vLine(x1, y0, y1, rightBump === 'none' ? 'none' : rightBump === 'out' ? 'out' : 'in');
  d += ' ' + hLine(x1, y1, x0, bottomBump === 'none' ? 'none' : bottomBump === 'out' ? 'out' : 'in');
  d += ' ' + vLine(x0, y1, y0, leftBump === 'none' ? 'none' : leftBump === 'out' ? 'out' : 'in');
  d += ' Z';
  return d;
}

const layoutCache = new Map<number, FragmentPuzzleLayout>();

export function getFragmentPuzzleLayout(pieceCount: number): FragmentPuzzleLayout {
  assertFragmentPuzzlePieceCount(pieceCount);
  const cached = layoutCache.get(pieceCount);
  if (cached) return cached;

  const grid = GRID_BY_COUNT[pieceCount];
  if (!grid) {
    throw new Error(`No jigsaw grid for piece count ${pieceCount}`);
  }

  const { cols, rows } = grid;
  const pieces: FragmentPuzzlePiece[] = [];
  let index = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      pieces.push({
        id: `piece-${pieceCount}-${index}`,
        pathD: piecePath(col, row, cols, rows, index),
      });
      index++;
    }
  }

  const layout: FragmentPuzzleLayout = {
    viewBox: '0 0 1 1',
    pieces,
  };
  layoutCache.set(pieceCount, layout);
  return layout;
}
