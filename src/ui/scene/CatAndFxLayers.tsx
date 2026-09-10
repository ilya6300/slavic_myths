import type { CSSProperties } from 'react';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';
import { hudIcons, getCatPoseUrl } from '../../config/assetRegistry';
import { canInteract } from '../../domain/onboardingGuards';
import { catPlacement } from '../../config/scenePlacements';
import { gameStore } from '../../store/GameStore';
import { catDialogStore } from '../../store/catDialogStore';
import { sceneUiStore } from '../../store/sceneUiStore';
import { DailyFindCoin } from './DailyFindCoin';
import { SceneSprite } from './SceneSprite';

function coinFxStyle(leftVw: number, bottomVw: number): CSSProperties {
  return {
    '--coin-left': `${leftVw}vw`,
    '--coin-bottom': `${bottomVw}vw`,
  } as CSSProperties;
}

export const CatLayer = observer(function CatLayer() {
  const pose = sceneUiStore.catSleeping ? 'sleep' : 'sid';
  const src = getCatPoseUrl(gameStore.skins.cat, pose);
  const bubble = gameStore.lastCatBubble;
  const catAllowed = canInteract(
    gameStore.onboardingStep,
    gameStore.onboardingCompleted,
    'cat',
  );
  const novelOpen =
    catDialogStore.visible && catDialogStore.currentLine?.mode === 'novel';
  const catInteractive = catAllowed && !novelOpen;

  const handleClick = useCallback(() => {
    if (!catInteractive) return;
    if (gameStore.handleZhirdyayBlockedInteraction()) return;

    if (sceneUiStore.catSleepReason !== 'tired') {
      sceneUiStore.registerActivity();
    }
    const before = gameStore.catClickCount;
    gameStore.clickCat();
    if (gameStore.catClickCount > before) {
      const { leftVw, bottomVw } = catPlacement.coinFx;
      sceneUiStore.spawnCoinFx(leftVw, bottomVw);
    }
  }, [catInteractive]);

  const showBubble =
    bubble?.text && !(catDialogStore.visible && bubble.kind === 'footnote');

  useEffect(() => {
    if (!showBubble) return;
    const timer = setTimeout(() => gameStore.clearLastCatBubble(), 4000);
    return () => clearTimeout(timer);
  }, [showBubble, bubble?.text, bubble?.kind]);

  return (
    <div className="layer-cat room-cat">
      {showBubble && (
        <div
          className={`${catPlacement.bubbleClassName} ${
            bubble.kind === 'footnote' ? 'cat-footnote' : 'cat-bubble'
          }`}
          role="status"
          aria-live="polite"
        >
          {bubble.text}
        </div>
      )}
      <SceneSprite
        placementClassName={catPlacement.className}
        src={src}
        alt="Кот"
        interactive={catInteractive}
        onSpriteClick={handleClick}
        className={pose === 'sleep' ? 'scene-cat--sleep' : 'scene-cat--sit'}
      />
      {pose === 'sleep' && (
        <div className="cat-zzz" aria-hidden>
          <span>z</span>
          <span>z</span>
          <span>z</span>
        </div>
      )}
      <DailyFindCoin />
    </div>
  );
});

export const CoinFxLayer = observer(function CoinFxLayer() {
  return (
    <div className="layer-fx" aria-hidden>
      {sceneUiStore.coinFxEvents.map((fx) => (
        <img
          key={fx.id}
          className="coin-fx"
          src={hudIcons.coin}
          alt=""
          style={coinFxStyle(fx.leftVw, fx.bottomVw)}
          draggable={false}
        />
      ))}
    </div>
  );
});
