import { observer } from 'mobx-react-lite';

import { useEffect, useState } from 'react';

import { isNightTime } from '../../domain/nightTime';

import { getIzbaEffectById } from '../../data/izbaEffects';
import { gameStore } from '../../store/GameStore';
import { bookUiStore } from '../../store/bookUiStore';
import { sceneUiStore } from '../../store/sceneUiStore';

import { BookOverlay } from '../book/BookOverlay';
import { ChestLootModal } from '../chest/ChestLootModal';
import { ChestCooldownModal } from '../chest/ChestCooldownModal';
import { EnergyRewardModal } from '../energy/EnergyRewardModal';
import { ProfileModal } from '../profile/ProfileModal';
import { QuizModal } from '../quiz/QuizModal';
import { TrophyModal } from '../trophies/TrophyModal';

import { CatDialog } from '../catDialog/CatDialog';

import { useOnboardingBootstrap } from '../onboarding/useOnboardingBootstrap';
import { useRetentionBootstrap } from '../retention/useRetentionBootstrap';

import { useLocale } from '../../i18n/LocaleContext';

import { BrownieLayer } from './BrownieLayer';
import { CatLayer, CoinFxLayer } from './CatAndFxLayers';
import { SusedkoStealLayer } from './SusedkoStealLayer';

import { GameHud } from './GameHud';

import { RewardedWaitOverlay } from '../ads/RewardedWaitOverlay';
import { KikimoraCraftModal } from '../street/KikimoraCraftModal';
import { StreetYard } from '../street/StreetYard';
import { StarterPackModal } from '../starter/StarterPackModal';
import { IzbaEffectLayer } from './IzbaEffectLayer';
import { Room1Scene, Room2Scene } from './IzbaSceneLayers';

import { ScenePanNav } from './ScenePanNav';

import { useIdleSleepTicker, useScenePanSwipe } from './useSceneInteraction';



export const IzbaScene = observer(function IzbaScene() {

  const { locale } = useLocale();

  const [isNight, setIsNight] = useState(() => isNightTime());

  const { viewportRef, pointerHandlers } = useScenePanSwipe();



  useOnboardingBootstrap(locale);

  useRetentionBootstrap();

  useIdleSleepTicker();



  useEffect(() => {

    const tick = () => setIsNight(isNightTime());

    tick();

    const id = window.setInterval(tick, 60_000);

    return () => window.clearInterval(id);

  }, []);



  return (

    <div

      className={`izba-scene${isNight ? ' izba-scene--night' : ''}${bookUiStore.isOverlayActive ? ' izba-scene--book-overlay' : ''}${gameStore.equippedIzbaEffectId ? ` ${getIzbaEffectById(gameStore.equippedIzbaEffectId)?.sceneClassName ?? ''}` : ''}`}

      data-room={sceneUiStore.activeRoom}

    >

      <GameHud />



      <div

        ref={viewportRef}

        className="izba-scene__viewport"

        {...pointerHandlers}

      >

        <div className="izba-scene__inner">

          <StreetYard />

          <Room1Scene>
            <BrownieLayer />
            <SusedkoStealLayer />
            <CatLayer />
            <CoinFxLayer />
          </Room1Scene>

          <Room2Scene />

          <div className="layer-night" aria-hidden />

          <IzbaEffectLayer />

        </div>

      </div>



      <ScenePanNav />



      <CatDialog />
      <BookOverlay />
      <QuizModal />
      <ChestLootModal />
      <ChestCooldownModal />
      <EnergyRewardModal />
      <StarterPackModal />
      <KikimoraCraftModal />
      <RewardedWaitOverlay />
      <ProfileModal />
      <TrophyModal />

    </div>

  );

});


