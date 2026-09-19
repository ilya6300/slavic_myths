import { observer } from 'mobx-react-lite';

import { getIzbaEffectById } from '../../data/izbaEffects';
import { gameStore } from '../../store/GameStore';

/** Некликабельный FX-слой избы (izba_scene_layers.md: выше night, ниже gameplay FX). */
export const IzbaEffectLayer = observer(function IzbaEffectLayer() {
  const effectId = gameStore.equippedIzbaEffectId;
  if (!effectId) return null;

  const effect = getIzbaEffectById(effectId);
  if (!effect) return null;

  return (
    <div
      className={`layer-izba-fx ${effect.sceneClassName}`}
      aria-hidden
    />
  );
});
