import type { CSSProperties } from 'react';
import { observer } from 'mobx-react-lite';
import { brownieSkins, type BrownieSkinId } from '../../config/assetRegistry';
import { brownieFallbackPlacement } from '../../config/sceneLayout';
import { getSpiritById } from '../../data/spirits';
import { resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { gameStore } from '../../store/GameStore';

export const BrownieLayer = observer(function BrownieLayer() {
  const { locale } = useLocale();
  if (!gameStore.isBrownieOnScene()) return null;

  const skinId = gameStore.skins.domovoy as BrownieSkinId;
  const src = brownieSkins[skinId] ?? brownieSkins.brownie_standart;
  const interactive = gameStore.onboardingCompleted;

  const handleClick = () => {
    if (!interactive) return;
    gameStore.clickIzbaItem('domovoy');
  };

  return (
    <div
      className={`layer-spirits scene-brownie${interactive ? ' scene-brownie--interactive scene-sprite--interactive' : ''}`}
      style={{
        '--brownie-left': `${brownieFallbackPlacement.left}vw`,
        '--brownie-bottom': `${brownieFallbackPlacement.bottom}vh`,
      } as CSSProperties}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={resolveText(getSpiritById('brownie')!.name, locale)}
      onClick={interactive ? handleClick : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
              }
            }
          : undefined
      }
    >
      <img
        className="scene-brownie__img"
        src={src}
        alt=""
        draggable={false}
      />
    </div>
  );
});
