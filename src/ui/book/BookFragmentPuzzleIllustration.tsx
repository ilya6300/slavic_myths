import type { SpiritId } from '../../config/assetRegistry';
import { getFragmentPuzzleLayout } from '../../config/bookFragmentPuzzleLayouts';
import { isClosedPieceIndex } from '../../domain/bookFragmentPuzzle';
import { spiritIllustrationUrl } from './spiritIllustrationUrl';

type Props = {
  spiritId: SpiritId;
  revealedCount: number;
  totalCount: number;
  className?: string;
  onAnimationEnd?: () => void;
};

export function BookFragmentPuzzleIllustration({
  spiritId,
  revealedCount,
  totalCount,
  className = '',
  onAnimationEnd,
}: Props) {
  const layout = getFragmentPuzzleLayout(totalCount);
  const src = spiritIllustrationUrl(spiritId);
  const clipPrefix = `book-puzzle-${spiritId}`;

  const baseClass = ['book-illustration-puzzle__base', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="book-illustration-puzzle" aria-hidden>
      <svg className="book-illustration-puzzle__svg-defs" aria-hidden>
        <defs>
          {layout.pieces.map((piece) => (
            <clipPath
              key={piece.id}
              id={`${clipPrefix}-${piece.id}`}
              clipPathUnits="objectBoundingBox"
            >
              <path d={piece.pathD} />
            </clipPath>
          ))}
        </defs>
      </svg>
      <div className="book-illustration-puzzle__stack">
        <img
          className={baseClass}
          src={src}
          alt=""
          draggable={false}
          onAnimationEnd={onAnimationEnd}
        />
        {layout.pieces.map((piece, index) => {
          if (!isClosedPieceIndex(index, revealedCount)) return null;
          return (
            <div
              key={piece.id}
              className="book-illustration-puzzle__veil-piece"
              style={{ clipPath: `url(#${clipPrefix}-${piece.id})` }}
            >
              <img
                className="book-illustration-puzzle__veil-img"
                src={src}
                alt=""
                draggable={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
