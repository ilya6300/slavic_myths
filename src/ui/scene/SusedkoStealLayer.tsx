import { observer } from 'mobx-react-lite';
import { enemies } from '../../config/assetRegistry';
import { susedkoStealPositions } from '../../config/sceneLayout';
import { susedkoStealPlacementClasses } from '../../config/scenePlacements';
import { eventUiStore } from '../../store/eventUiStore';

export const SusedkoStealLayer = observer(function SusedkoStealLayer() {
  if (!eventUiStore.isStealing) return null;

  const pos =
    susedkoStealPositions[eventUiStore.susedkoPositionIndex] ??
    susedkoStealPositions[0]!;
  const placementClass =
    susedkoStealPlacementClasses[pos.id] ?? 'scene-susedko-steal--after-stove';

  return (
    <div className="layer-susedko-steal">
      {eventUiStore.susedkoBubble && (
        <div
          className={`susedko-steal-bubble ${placementClass}`}
          role="status"
        >
          {eventUiStore.susedkoBubble}
        </div>
      )}
      <button
        type="button"
        className={`scene-susedko-steal scene-sprite scene-sprite--interactive ${placementClass}`}
        onClick={() => eventUiStore.clickSusedko()}
        aria-label="Susedko"
      >
        <img
          className="scene-sprite__img"
          src={enemies.susedko}
          alt=""
          draggable={false}
        />
      </button>
    </div>
  );
});
