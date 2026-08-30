import { appConfig } from '../config/gameConstants';
import { getPlatformSdk } from '../platform/platformService';

const useRewardedStub = appConfig.isTestMode || import.meta.env.DEV;

export class AdsService {
  showRewarded(onRewarded: () => void, onClose?: () => void): void {
    if (useRewardedStub) {
      onRewarded();
      onClose?.();
      return;
    }

    getPlatformSdk().adv.showRewardedVideo({
      callbacks: { onRewarded, onClose },
    });
  }
}

export const adsService = new AdsService();
