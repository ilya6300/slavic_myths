import { observer } from 'mobx-react-lite';
import { hudIcons } from '../../config/assetRegistry';
import { canInteract } from '../../domain/onboardingGuards';
import { gameStore } from '../../store/GameStore';
import { sceneUiStore } from '../../store/sceneUiStore';

const DAILY_FIND_LEFT_VW = 28;
const DAILY_FIND_BOTTOM_VW = 14;

export const DailyFindCoin = observer(function DailyFindCoin() {
  const allowed = canInteract(
    gameStore.onboardingStep,
    gameStore.onboardingCompleted,
    'cat',
  );
  const visible =
    allowed &&
    sceneUiStore.activeRoom === 1 &&
    gameStore.isDailyFindAvailable();

  if (!visible) return null;

  const handleClick = () => {
    if (gameStore.handleZhirdyayBlockedInteraction()) return;
    sceneUiStore.registerActivity();
    const claimed = gameStore.claimDailyFind();
    if (claimed) {
      sceneUiStore.spawnCoinFx(DAILY_FIND_LEFT_VW, DAILY_FIND_BOTTOM_VW);
    }
  };

  return (
    <button
      type="button"
      className="daily-find-coin scene-sprite--interactive"
      onClick={handleClick}
      aria-label="Daily find"
    >
      <img
        className="daily-find-coin__img"
        src={hudIcons.coin}
        alt=""
        draggable={false}
      />
    </button>
  );
});
