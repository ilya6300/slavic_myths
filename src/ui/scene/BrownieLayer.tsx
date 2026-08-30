import type { CSSProperties } from 'react';
import { observer } from 'mobx-react-lite';
import { brownieSkins, type BrownieSkinId } from '../../config/assetRegistry';
import { brownieFallbackPlacement } from '../../config/sceneLayout';
import { gameStore } from '../../store/GameStore';

export const BrownieLayer = observer(function BrownieLayer() {
  if (!gameStore.isBrownieOnScene()) return null;

  const skinId = gameStore.skins.domovoy as BrownieSkinId;
  const src = brownieSkins[skinId] ?? brownieSkins.brownie_standart;

  return (
    <div
      className="layer-spirits scene-brownie"
      style={{
        '--brownie-left': `${brownieFallbackPlacement.left}vw`,
        '--brownie-bottom': `${brownieFallbackPlacement.bottom}vh`,
      } as CSSProperties}
    >
      <img
        className="scene-brownie__img"
        src={src}
        alt=""
        draggable={false}
      />
    </div>
  );
});
