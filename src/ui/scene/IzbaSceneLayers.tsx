import type { ReactNode } from 'react';
import { useRef } from 'react';

import { observer } from 'mobx-react-lite';

import {

  enemies,

  furniture,

  houseSkins,

  type HouseSkinId,

  viewSkins,

  type ViewSkinId,

} from '../../config/assetRegistry';

import {

  canInteract,

  isTutorialHighlight,

} from '../../domain/onboardingGuards';

import { findNextAvailableSpirit } from '../../domain/spiritQueue';

import {

  benchPlacement,

  bookPlacement,

  bookStandPlacement,

  stovePlacement,

} from '../../config/scenePlacements';

import { gameStore } from '../../store/GameStore';
import { bookUiStore } from '../../store/bookUiStore';
import { chestUiStore } from '../../store/chestUiStore';
import { eventUiStore } from '../../store/eventUiStore';
import { TrophyRoom } from '../trophies/TrophyRoom';
import { SceneSprite } from './SceneSprite';
import { MiracleChestSprite } from './MiracleChestSprite';
import { RegularChestSprite } from './RegularChestSprite';
import { TutorialHighlight } from './TutorialHighlight';



function resolveHouseUrl(skinId: string): string {

  const key = skinId as HouseSkinId;

  return houseSkins[key] ?? houseSkins.hut_standart;

}



function resolveViewUrl(skinId: string): string {

  const key = skinId as ViewSkinId;

  return viewSkins[key] ?? viewSkins.landscape_standart;

}



const WindowAperture = observer(function WindowAperture() {

  const viewUrl = resolveViewUrl(gameStore.skins.window);

  const showFatso = gameStore.zhirdyayActive;



  const handleFatsoClick = () => {

    eventUiStore.clickZhirdyay();

  };



  return (

    <div className="window-aperture" data-window-skin={gameStore.skins.window} aria-hidden>

      <img
        key={viewUrl}
        className="window-aperture__forest"
        src={viewUrl}
        alt=""
        draggable={false}
      />

      {gameStore.onboardingCompleted && (
        <button
          type="button"
          className="window-aperture__ambient-hit scene-sprite--interactive"
          onClick={() => gameStore.clickIzbaItem('window')}
          aria-label="Window"
        />
      )}

      {showFatso && (

        <button

          type="button"

          className="window-aperture__fatso izba-fatso window-aperture__fatso--active"

          onClick={handleFatsoClick}

          aria-label="Zhirdyay"

        >

          <img src={enemies.fatso} alt="" draggable={false} />

        </button>

      )}

    </div>

  );

});



const Room1Furniture = observer(function Room1Furniture() {
  const bookRef = useRef<HTMLDivElement>(null);

  const { onboardingStep, onboardingCompleted } = gameStore;

  const bookAllowed = canInteract(onboardingStep, onboardingCompleted, 'book');

  const bookHighlight = isTutorialHighlight(

    onboardingStep,

    onboardingCompleted,

    'book',

  );



  const showChest =

    gameStore.spiritStatuses.susedko === 'defeated' ||

    gameStore.firstChestOpened;



  const chestHighlight = isTutorialHighlight(

    onboardingStep,

    onboardingCompleted,

    'chest',

  );



  const chestAllowed = canInteract(onboardingStep, onboardingCompleted, 'chest');

  const miracleAllowed = canInteract(
    onboardingStep,
    onboardingCompleted,
    'chestMiracle',
  );

  const showMiracleChest = gameStore.isWonderChestVisible();



  const handleChestClick = () => {

    if (!chestAllowed) return;

    if (gameStore.handleZhirdyayBlockedInteraction()) return;

    if (gameStore.isChestReady()) {
      gameStore.openChest();
      return;
    }

    if (gameStore.firstChestOpened) {
      chestUiStore.showCooldown();
    }

  };



  const handleMiracleChestClick = () => {

    if (!miracleAllowed) return;

    if (gameStore.handleZhirdyayBlockedInteraction()) return;

    if (!gameStore.canOpenWonderChest()) return;

    gameStore.openWonderChest();

  };



  const handleBookClick = () => {
    if (!bookAllowed) return;
    if (bookUiStore.isOverlayActive) return;
    if (gameStore.handleZhirdyayBlockedInteraction()) return;

    gameStore.openBook();

    const target =
      findNextAvailableSpirit(gameStore.spiritStatuses) ?? 'brownie';
    const rect = bookRef.current?.getBoundingClientRect() ?? null;
    bookUiStore.startOpen(target, rect);
  };



  return (

    <>

      <SceneSprite

        placementClassName={stovePlacement.className}

        src={furniture.bake}

        alt=""

        interactive={gameStore.onboardingCompleted}
        onSpriteClick={() => gameStore.clickIzbaItem('stove')}

      />

      <SceneSprite

        placementClassName={benchPlacement.className}

        src={furniture.bench}

        alt=""

        interactive={gameStore.onboardingCompleted}
        onSpriteClick={() => gameStore.clickIzbaItem('bench')}

      />

      {showChest && (

        <TutorialHighlight active={chestHighlight}>

          <RegularChestSprite

            interactive={chestAllowed}

            onCooldown={chestAllowed && !gameStore.isChestReady()}

            ready={chestAllowed && gameStore.isChestReady()}

            onClick={handleChestClick}

          />

        </TutorialHighlight>

      )}

      {showMiracleChest && (

        <MiracleChestSprite

          interactive={miracleAllowed && gameStore.canOpenWonderChest()}

          onClick={handleMiracleChestClick}

        />

      )}

      <SceneSprite

        placementClassName={bookStandPlacement.className}

        src={furniture.stand}

        alt=""

      />

      <TutorialHighlight active={bookHighlight}>
        <SceneSprite
          containerRef={bookRef}
          placementClassName={bookPlacement.className}
          src={furniture.bookClosed}
          alt=""
          interactive={bookAllowed && !bookUiStore.isOverlayActive}
          onSpriteClick={handleBookClick}
          className={
            bookAllowed ? 'scene-book--interactive' : 'room-book--locked'
          }
        />
      </TutorialHighlight>

    </>

  );

});



export const Room1Scene = observer(function Room1Scene({

  children,

}: {

  children?: ReactNode;

}) {

  const houseUrl = resolveHouseUrl(gameStore.skins.izba);



  return (

    <div
      className="izba-room izba-room--1"
      data-room="1"
      data-izba-skin={gameStore.skins.izba}
    >

      <WindowAperture />



      <div className="layer-izba">

        <img className="layer-izba__img" src={houseUrl} alt="" draggable={false} />

      </div>



      <div className="layer-furniture">

        <Room1Furniture />

      </div>



      {children}

    </div>

  );

});



export const Room2Scene = observer(function Room2Scene() {

  const houseUrl = resolveHouseUrl(gameStore.skins.izba);



  return (

    <div
      className="izba-room izba-room--2"
      data-room="2"
      data-izba-skin={gameStore.skins.izba}
      aria-label="Trophies room"
    >

      <WindowAperture />



      <div className="layer-izba">

        <img className="layer-izba__img" src={houseUrl} alt="" draggable={false} />

      </div>



      <div className="layer-furniture layer-furniture--room2">

        <TrophyRoom />

      </div>

    </div>

  );

});



/** @deprecated use Room1Scene + Room2Scene */

export const IzbaSceneLayers = observer(function IzbaSceneLayers() {

  return (

    <>

      <Room1Scene />

      <Room2Scene />

    </>

  );

});


