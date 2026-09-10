import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { furniture } from '../../config/assetRegistry';
import { chestRegularPlacement } from '../../config/scenePlacements';
import { gameStore } from '../../store/GameStore';
import { formatCooldownMs } from '../chest/formatCooldown';
import { SceneSprite } from './SceneSprite';

interface RegularChestSpriteProps {
  interactive: boolean;
  onCooldown: boolean;
  ready?: boolean;
  onClick: () => void;
  className?: string;
}

export const RegularChestSprite = observer(function RegularChestSprite({
  interactive,
  onCooldown,
  ready = false,
  onClick,
  className,
}: RegularChestSpriteProps) {
  const showTimer =
    gameStore.firstChestOpened && onCooldown && !gameStore.isChestReady();
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    if (!showTimer) return;

    const tick = () => setRemainingMs(gameStore.getChestCooldownRemainingMs());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [showTimer, gameStore.chestReadyAt]);

  return (
    <div
      className={`scene-chest-wrap ${chestRegularPlacement.className}${className ? ` ${className}` : ''}`}
    >
      {showTimer && (
        <div className="scene-chest-floor scene-chest-floor--timer" aria-live="polite">
          <span className="scene-chest-floor__label scene-chest-floor__label--zzz">
            {formatCooldownMs(remainingMs)}
          </span>
        </div>
      )}
      <SceneSprite
        placementClassName="scene-chest-wrap__sprite"
        src={furniture.boxClosed}
        alt=""
        interactive={interactive}
        onSpriteClick={onClick}
        className={
          onCooldown
            ? 'scene-chest--cooldown'
            : ready
              ? 'scene-chest--ready'
              : undefined
        }
      />
    </div>
  );
});
