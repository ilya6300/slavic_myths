import type { CSSProperties } from 'react';
import { observer } from 'mobx-react-lite';

import { getIzbaEffectById } from '../../data/izbaEffects';
import { gameStore } from '../../store/GameStore';
import { IZBA_STAR_FIELD, useBallLightningMotion } from './izbaAtmosphereMotion';

function BallLightningOrb({
  roomBandVw,
  driftVariant,
  style,
}: {
  roomBandVw: 100 | 200;
  driftVariant: 1 | 2 | 3;
  style: CSSProperties;
}) {
  return (
    <div
      className={`layer-izba-fx__ball-lightning-wrap layer-izba-fx__ball-lightning-wrap--drift-${driftVariant}`}
      style={{ ...style, ['--ball-room-band' as string]: `${roomBandVw}vw` }}
    >
      <div className="layer-izba-fx__ball-lightning" />
    </div>
  );
}

/** Некликабельный FX-слой избы (izba_scene_layers.md: выше night, ниже gameplay FX). */
export const IzbaEffectLayer = observer(function IzbaEffectLayer() {
  const effectId = gameStore.equippedIzbaEffectId;
  const ballMotion = useBallLightningMotion(effectId ?? null);

  if (!effectId) return null;

  const effect = getIzbaEffectById(effectId);
  if (!effect) return null;

  return (
    <div
      className={`layer-izba-fx ${effect.sceneClassName}`}
      aria-hidden
    >
      {effect.id === 'shop_ball_lightning' && (
        <>
          <BallLightningOrb roomBandVw={100} driftVariant={ballMotion.driftVariant} style={ballMotion.style} />
          <BallLightningOrb roomBandVw={200} driftVariant={ballMotion.driftVariant} style={ballMotion.style} />
        </>
      )}
      {effect.id === 'shop_firefly' && (
        <>
          <span className="layer-izba-fx__firefly layer-izba-fx__firefly--1" />
          <span className="layer-izba-fx__firefly layer-izba-fx__firefly--2" />
          <span className="layer-izba-fx__firefly layer-izba-fx__firefly--3" />
          <span className="layer-izba-fx__firefly layer-izba-fx__firefly--4" />
        </>
      )}
      {effect.id === 'shop_stars' &&
        IZBA_STAR_FIELD.map((star, index) => (
          <span
            key={index}
            className="layer-izba-fx__star"
            style={{
              left: `${star.leftVw}vw`,
              top: `${star.topVh}vh`,
              width: star.sizePx,
              height: star.sizePx,
              opacity: star.opacity,
              ['--star-rot' as string]: `${star.rotateDeg}deg`,
              animationDelay: `${(index % 19) * 0.27}s`,
            }}
          />
        ))}
    </div>
  );
});
