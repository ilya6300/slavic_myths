import { useCallback, useRef, useState, type PointerEvent } from 'react';
import { bookUiStore, type BookSpreadMode } from '../../store/bookUiStore';

const FLIP_HALF_MS = 200;
const SWIPE_THRESHOLD_PX = 40;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

type FlipDir = 'next' | 'prev';
type FlipStage = 'out' | 'in';

interface ActiveFlip {
  dir: FlipDir;
  stage: FlipStage;
}

export function useBookPageFlip(
  canPrev: boolean,
  canNext: boolean,
  spreadMode: BookSpreadMode,
) {
  const [flip, setFlip] = useState<ActiveFlip | null>(null);
  const swipeStartX = useRef<number | null>(null);

  const navigate = useCallback(
    (dir: FlipDir) => {
      if (bookUiStore.isFlipping || bookUiStore.isInteractionBlocked) return;
      if (dir === 'next' && !canNext) return;
      if (dir === 'prev' && !canPrev) return;

      if (prefersReducedMotion()) {
        if (dir === 'next') bookUiStore.goNext();
        else bookUiStore.goPrev();
        return;
      }

      bookUiStore.startFlip();
      setFlip({ dir, stage: 'out' });

      globalThis.setTimeout(() => {
        if (dir === 'next') bookUiStore.goNext();
        else bookUiStore.goPrev();
        setFlip({ dir, stage: 'in' });

        globalThis.setTimeout(() => {
          setFlip(null);
          bookUiStore.endFlip();
        }, FLIP_HALF_MS);
      }, FLIP_HALF_MS);
    },
    [canNext, canPrev],
  );

  const navigateNext = useCallback(() => navigate('next'), [navigate]);
  const navigatePrev = useCallback(() => navigate('prev'), [navigate]);

  const getPageFlipClass = useCallback(
    (side: 'left' | 'right'): string => {
      if (!flip) return '';

      const forwardOnRight =
        flip.dir === 'next' && spreadMode === 'spirit' && side === 'right';
      const forwardOnLeft =
        flip.dir === 'next' && spreadMode === 'folktale' && side === 'left';
      const backOnLeft = flip.dir === 'prev' && side === 'left';

      if (flip.stage === 'out') {
        if (forwardOnRight || forwardOnLeft) return 'book-page--flip-out-forward';
        if (backOnLeft) return 'book-page--flip-out-back';
      }
      if (flip.stage === 'in') {
        if (forwardOnRight || forwardOnLeft) return 'book-page--flip-in-forward';
        if (backOnLeft) return 'book-page--flip-in-back';
      }
      return '';
    },
    [flip, spreadMode],
  );

  const spreadPointerHandlers = {
    onPointerDown: (e: PointerEvent) => {
      if (bookUiStore.isInteractionBlocked) return;
      swipeStartX.current = e.clientX;
    },
    onPointerUp: (e: PointerEvent) => {
      if (swipeStartX.current == null) return;
      const dx = e.clientX - swipeStartX.current;
      swipeStartX.current = null;
      if (dx > SWIPE_THRESHOLD_PX) navigatePrev();
      else if (dx < -SWIPE_THRESHOLD_PX) navigateNext();
    },
    onPointerCancel: () => {
      swipeStartX.current = null;
    },
  };

  return {
    navigateNext,
    navigatePrev,
    getPageFlipClass,
    spreadPointerHandlers,
  };
}
