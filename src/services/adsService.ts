import { appConfig } from '../config/gameConstants';
import { getPlatformSdk } from '../platform/platformService';
import { adsUiStore } from '../store/adsUiStore';
import type { RewardedLoreContext } from '../store/adsUiStore';

const useRewardedStub = appConfig.isTestMode || import.meta.env.DEV;

export class AdsService {
  showRewarded(
    onRewarded: () => void,
    onClose?: () => void,
    loreContext: RewardedLoreContext = 'smetana',
  ): void {
    if (useRewardedStub) {
      adsUiStore.startWait(onRewarded, onClose, loreContext);
      return;
    }

    getPlatformSdk().adv.showRewardedVideo({
      callbacks: { onRewarded, onClose },
    });
  }
}

export const adsService = new AdsService();
