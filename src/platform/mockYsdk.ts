import { CLOUD_SAVE_KEY } from '../config/gameConstants';
import type { GameSave } from '../domain/GameSave';
import { readLocalSave, writeLocalSave } from '../services/localSave';
import type { PlatformSdk } from './platformService';

export function createMockYsdk(): PlatformSdk {
  let authorized = false;

  return {
    getPlayer: async () => ({
      isAuthorized: () => authorized,
      getData: async (keys: string[]) => {
        if (!authorized) return {};
        const save = readLocalSave();
        if (!save || !keys.includes(CLOUD_SAVE_KEY)) return {};
        return { [CLOUD_SAVE_KEY]: save };
      },
      setData: async (data, _flush) => {
        const save = data[CLOUD_SAVE_KEY] as GameSave | undefined;
        if (save) writeLocalSave(save);
      },
    }),
    auth: {
      openAuthDialog: async () => {
        authorized = true;
      },
    },
    adv: {
      showRewardedVideo: ({ callbacks }) => {
        callbacks.onRewarded();
        callbacks.onClose?.();
      },
    },
  };
}
