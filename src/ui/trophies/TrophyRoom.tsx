import type { CSSProperties } from 'react';
import { observer } from 'mobx-react-lite';
import {
  furniture,
  getTrophyUrl,
  type SpiritId,
} from '../../config/assetRegistry';
import { trophyWallShelves } from '../../config/sceneLayout';
import { settingsUiContent } from '../../data/dialogContent';
import { getSpiritById } from '../../data/spirits';
import { resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { gameStore } from '../../store/GameStore';
import { sceneUiStore } from '../../store/sceneUiStore';
import { trophyUiStore } from '../../store/trophyUiStore';

function slotPositionClass(spiritCount: number, index: number): string {
  if (spiritCount === 1) return 'room-trophy-slot--alone';
  if (spiritCount === 2) {
    return index === 0 ? 'room-trophy-slot--left' : 'room-trophy-slot--right';
  }
  if (index === 0) return 'room-trophy-slot--triple-left';
  if (index === 1) return 'room-trophy-slot--triple-mid';
  return 'room-trophy-slot--triple-right';
}

export const TrophyRoom = observer(function TrophyRoom() {
  const { locale } = useLocale();

  const handleSlotClick = (spiritId: SpiritId) => {
    if (gameStore.isTrophyUnlocked(spiritId)) {
      trophyUiStore.openTrophy(spiritId);
      return;
    }
    trophyUiStore.openEmptySlot(spiritId);
  };

  return (
    <div className="trophy-room">
      {trophyWallShelves.map((shelf) => (
        <div
          key={shelf.id}
          className="room-shelf-group"
          style={
            {
              '--shelf-left': `${shelf.leftVw}vw`,
              '--shelf-top': `${shelf.topVh}vh`,
            } as CSSProperties
          }
        >
          <div className="room-shelf">
            <img
              className="room-shelf__img"
              src={furniture.shelf}
              alt=""
              draggable={false}
            />
          </div>
          <div className="room-shelf__slots">
            {shelf.spiritIds.map((spiritId, index) => {
              const unlocked = gameStore.isTrophyUnlocked(spiritId);
              const spirit = getSpiritById(spiritId);
              return (
                <button
                  key={spiritId}
                  type="button"
                  className={`room-trophy-slot ${slotPositionClass(shelf.spiritIds.length, index)}${unlocked ? ' room-trophy-slot--filled' : ' room-trophy-slot--empty'}${sceneUiStore.trophyRevealSpiritId === spiritId ? ' room-trophy-slot--reveal' : ''}`}
                  onClick={() => handleSlotClick(spiritId)}
                  aria-label={
                    unlocked
                      ? spirit
                        ? resolveText(spirit.name, locale)
                        : spiritId
                      : resolveText(settingsUiContent.trophyNotMet, locale)
                  }
                >
                  {unlocked ? (
                    <img
                      className="room-trophy-slot__img"
                      data-spirit-id={spiritId}
                      src={getTrophyUrl(spiritId)}
                      alt=""
                      draggable={false}
                    />
                  ) : (
                    <span className="room-trophy-slot__silhouette" aria-hidden>
                      ?
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="scene-bench-room2">
        <img src={furniture.bench} alt="" draggable={false} />
      </div>
    </div>
  );
});
