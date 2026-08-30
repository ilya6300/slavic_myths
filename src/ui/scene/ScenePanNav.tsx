import { observer } from 'mobx-react-lite';

import { sceneUiStore } from '../../store/sceneUiStore';



export const ScenePanNav = observer(function ScenePanNav() {

  if (sceneUiStore.panBlocked) return null;



  return (

    <nav className="layer-nav" aria-label="Room navigation">

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

        <button

          type="button"

          className="scene-nav scene-nav--right"

          onClick={() => sceneUiStore.setRoom(2)}

          aria-label="Trophies room"

        >

          ›

        </button>

      )}

    </nav>

  );

});


