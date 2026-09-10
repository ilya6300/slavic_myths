import { observer } from 'mobx-react-lite';

import { gameStore } from '../../store/GameStore';
import { sceneUiStore } from '../../store/sceneUiStore';

export const ScenePanNav = observer(function ScenePanNav() {
  if (sceneUiStore.panBlocked) return null;

  /** Стрелка видна после онбординга; блокировка ночь/Жирдяй — в tryEnterStreet */
  const showStreetArrow = gameStore.onboardingCompleted;

  const goStreet = () => {
    gameStore.tryEnterStreet();
  };

  return (
    <nav className="layer-nav" aria-label="Room navigation">
      {sceneUiStore.activeRoom === 'street' && (
        <button
          type="button"
          className="scene-nav scene-nav--right"
          onClick={() => sceneUiStore.setRoom(1)}
          aria-label="Izba"
        >
          ›
        </button>
      )}

      {sceneUiStore.activeRoom === 2 && (
        <button
          type="button"
          className="scene-nav scene-nav--left"
          onClick={() => sceneUiStore.setRoom(1)}
          aria-label="Room 1"
        >
          ‹
        </button>
      )}

      {sceneUiStore.activeRoom === 1 && (
        <>
          {showStreetArrow && (
            <button
              type="button"
              className="scene-nav scene-nav--left scene-nav--street"
              onClick={goStreet}
              aria-label="Street yard"
            >
              ‹
            </button>
          )}
          <button
            type="button"
            className="scene-nav scene-nav--right"
            onClick={() => sceneUiStore.setRoom(2)}
            aria-label="Trophies room"
          >
            ›
          </button>
        </>
      )}
    </nav>
  );
});
