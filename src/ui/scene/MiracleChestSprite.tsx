import { observer } from 'mobx-react-lite';
import type { CSSProperties } from 'react';
import { furniture } from '../../config/assetRegistry';
import { chestMiraclePlacement } from '../../config/scenePlacements';
import {
  shouldShowWonderChestProgress,
  wonderChestFillRatio,
} from '../../domain/wonderChest';
import { gameStore } from '../../store/GameStore';
import { SceneSprite } from './SceneSprite';

interface MiracleChestSpriteProps {
  interactive: boolean;
  onClick: () => void;
  className?: string;
}

export const MiracleChestSprite = observer(function MiracleChestSprite({
  interactive,
  onClick,
  className,
}: MiracleChestSpriteProps) {
  const clicks = gameStore.getWonderChestClickProgress();
  const required = gameStore.getWonderChestClicksRequired();
  const canOpen = gameStore.canOpenWonderChest();
  const showProgress = shouldShowWonderChestProgress(
    gameStore.wonderChestWeekSlotUsed,
    clicks,
    required,
  );
  const spriteState = canOpen
    ? 'scene-chest--ready scene-chest-miracle--glow'
    : 'scene-chest--cooldown scene-chest-miracle--glow';

  return (
    <div
      className={`scene-chest-wrap ${chestMiraclePlacement.className}${className ? ` ${className}` : ''}`}
    >
      {showProgress && (
        <div
          className="scene-chest-floor scene-chest-floor--progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={required}
          aria-valuenow={clicks}
          style={
            {
              // runtime fill 0…1 (css-styling.mdc)
              '--chest-progress': wonderChestFillRatio(clicks, required),
            } as CSSProperties
          }
        >
          <div className="scene-chest-floor__plate">
            <div className="scene-chest-floor__track">
              <div className="scene-chest-floor__fill" />
            </div>
            <span className="scene-chest-floor__label">
              {clicks}/{required}
            </span>
          </div>
        </div>
      )}
      <SceneSprite
        placementClassName="scene-chest-wrap__sprite"
        src={furniture.miracleChestClosed}
        alt=""
        interactive={interactive}
        onSpriteClick={onClick}
        className={spriteState}
      />
    </div>
  );
});
