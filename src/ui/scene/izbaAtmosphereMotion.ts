import { useMemo } from 'react';
import type { CSSProperties } from 'react';

/** Слой 300vw: улица 0–100, комната 1 — 100–200, комната 2 — 200–300. */
const ROOM_BANDS = [100, 200] as const;

/** Детерминированный «шум» 0..1 без линейных рядов на экране. */
function hash01(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

export type IzbaStarSpec = {
  leftVw: number;
  topVh: number;
  sizePx: number;
  opacity: number;
  rotateDeg: number;
};

function buildIzbaStarField(): IzbaStarSpec[] {
  const stars: IzbaStarSpec[] = [];
  let seed = 90210;

  for (const band of ROOM_BANDS) {
    for (let i = 0; i < 34; i++) {
      seed += 1;
      const u = hash01(seed);
      const v = hash01(seed + 4139);
      const w = hash01(seed + 7919);
      const t = hash01(seed + 104729);

      stars.push({
        leftVw: band + 5 + u * 88,
        topVh: 2.5 + v * 36,
        sizePx: 3.5 + w * 5.5,
        opacity: 0.58 + t * 0.42,
        rotateDeg: hash01(seed + 271828) * 360,
      });
    }
  }

  return stars;
}

export const IZBA_STAR_FIELD = buildIzbaStarField();

export type BallLightningMotion = {
  style: CSSProperties;
  driftVariant: 1 | 2 | 3;
};

export function useBallLightningMotion(effectId: string | null): BallLightningMotion {
  return useMemo(() => {
    if (effectId !== 'shop_ball_lightning') {
      return { style: {}, driftVariant: 1 };
    }
    const driftVariant = (1 + Math.floor(Math.random() * 3)) as 1 | 2 | 3;
    return {
      driftVariant,
      style: {
        animationDelay: `${Math.random() * 3}s`,
      },
    };
  }, [effectId]);
}
