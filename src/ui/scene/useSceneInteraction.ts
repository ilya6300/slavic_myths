import { useEffect, useRef, type RefObject } from 'react';



import { swipeThreshold } from '../../config/sceneLayout';

import { eventUiStore, IDLE_TICKER_KEY } from '../../store/eventUiStore';

import { sceneUiStore, type IzbaRoom } from '../../store/sceneUiStore';



interface TouchPoint {

  x: number;

  y: number;

  t: number;

}



const INTERACTIVE_SELECTOR =

  '.scene-sprite--interactive, button, [role="button"]';



/** Не перехватывать pointer — иначе click не дойдёт до спрайта. */

export function isSceneInteractiveTarget(target: EventTarget | null): boolean {

  if (!(target instanceof Element)) return false;

  return target.closest(INTERACTIVE_SELECTOR) != null;

}



/** Pan между комнатами: null = остаться в текущей (тап или короткий жест). */

export function resolvePanRoomAfterGesture(

  dx: number,

  dt: number,

  viewportWidth: number,

  activeRoom: IzbaRoom,

): IzbaRoom | null {

  const isTap =

    Math.abs(dx) < swipeThreshold.clickMaxDxPx &&

    dt < swipeThreshold.clickMaxDtMs;

  if (isTap) return null;



  const distancePercent = (Math.abs(dx) / viewportWidth) * 100;

  const velocity = Math.abs(dx) / Math.max(dt, 1);

  const isSwipe =

    distancePercent >= swipeThreshold.distancePercent ||

    velocity >= swipeThreshold.flickVelocityPxPerMs;



  if (!isSwipe) return null;

  if (dx < 0 && activeRoom === 1) return 2;

  if (dx > 0 && activeRoom === 2) return 1;

  return null;

}



export function useScenePanSwipe(): {

  viewportRef: RefObject<HTMLDivElement>;

  pointerHandlers: {

    onPointerDown: (e: React.PointerEvent) => void;

    onPointerMove: (e: React.PointerEvent) => void;

    onPointerUp: (e: React.PointerEvent) => void;

    onPointerCancel: (e: React.PointerEvent) => void;

  };

} {

  const viewportRef = useRef<HTMLDivElement>(null);

  const startRef = useRef<TouchPoint | null>(null);

  const lastRef = useRef<TouchPoint | null>(null);

  const capturedRef = useRef(false);



  const reset = () => {

    startRef.current = null;

    lastRef.current = null;

    capturedRef.current = false;

  };



  const onPointerDown = (e: React.PointerEvent) => {

    if (sceneUiStore.panBlocked) return;

    if (isSceneInteractiveTarget(e.target)) return;



    startRef.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };

    lastRef.current = startRef.current;

    viewportRef.current?.setPointerCapture(e.pointerId);

    capturedRef.current = true;

  };



  const onPointerMove = (e: React.PointerEvent) => {

    if (!startRef.current) return;

    lastRef.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };

  };



  const onPointerUp = (e: React.PointerEvent) => {

    if (!startRef.current || !lastRef.current) {

      reset();

      return;

    }



    const dx = lastRef.current.x - startRef.current.x;

    const dt = lastRef.current.t - startRef.current.t;

    const width = viewportRef.current?.clientWidth ?? 1;

    const nextRoom = resolvePanRoomAfterGesture(

      dx,

      dt,

      width,

      sceneUiStore.activeRoom,

    );



    if (nextRoom != null) {

      sceneUiStore.setRoom(nextRoom);

    }



    const wasCaptured = capturedRef.current;

    reset();



    if (wasCaptured) {

      try {

        viewportRef.current?.releasePointerCapture(e.pointerId);

      } catch {

        /* already released */

      }

    }

  };



  const onPointerCancel = () => reset();



  return {

    viewportRef,

    pointerHandlers: {

      onPointerDown,

      onPointerMove,

      onPointerUp,

      onPointerCancel,

    },

  };

}



export function useIdleSleepTicker(): void {

  useEffect(() => {

    const w = window as Window & { [IDLE_TICKER_KEY]?: number };

    if (w[IDLE_TICKER_KEY] != null) {

      window.clearInterval(w[IDLE_TICKER_KEY]);

    }



    const id = window.setInterval(() => {

      sceneUiStore.tickIdle();

      eventUiStore.tick();

    }, 1000);



    w[IDLE_TICKER_KEY] = id;



    return () => {

      window.clearInterval(id);

      if (w[IDLE_TICKER_KEY] === id) {

        delete w[IDLE_TICKER_KEY];

      }

    };

  }, []);

}

