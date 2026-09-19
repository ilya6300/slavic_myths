import { observer } from 'mobx-react-lite';

import { furniture, viewSkins, type ViewSkinId } from '../../config/assetRegistry';
import { gameStore } from '../../store/GameStore';
import { sceneUiStore } from '../../store/sceneUiStore';

const GRASS_SLOTS = [
  { slot: 0, className: 'yard-grass--slot-0' },
  { slot: 1, className: 'yard-grass--slot-1' },
  { slot: 2, className: 'yard-grass--slot-2' },
  { slot: 3, className: 'yard-grass--slot-3' },
  { slot: 4, className: 'yard-grass--slot-4' },
] as const;

function resolveViewUrl(skinId: string): string {
  const key = skinId as ViewSkinId;
  return viewSkins[key] ?? viewSkins.landscape_standart;
}

export const StreetYard = observer(function StreetYard() {
  const viewUrl = resolveViewUrl(gameStore.skins.window);

  const handleGrassClick = (slot: number) => {
    if (!gameStore.collectYardGrass(slot)) {
      sceneUiStore.triggerGrassChipShake();
    }
  };

  return (
    <div className="izba-room izba-room--street" data-room="street" aria-label="Street yard">
      <img
        className="street-yard__view"
        src={viewUrl}
        alt=""
        draggable={false}
      />
      <div className="street-yard__grass-layer">
        {GRASS_SLOTS.map(({ slot, className }) =>
          sceneUiStore.yardGrassSlots.includes(slot) ? (
            <button
              key={slot}
              type="button"
              className={`yard-grass scene-sprite--interactive ${className}`}
              onClick={() => handleGrassClick(slot)}
              aria-label="Collect grass"
            >
              <img
                className="yard-grass__img"
                src={furniture.yardGrass}
                alt=""
                draggable={false}
              />
            </button>
          ) : null,
        )}
      </div>
    </div>
  );
});
