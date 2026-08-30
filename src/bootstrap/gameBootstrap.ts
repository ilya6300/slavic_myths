import { appConfig, CLOUD_SAVE_KEY } from '../config/gameConstants';
import type { GameSave } from '../domain/GameSave';
import { migrateSave } from '../domain/saveMigration';
import { initPlatform, getPlatformSdk, isAuthorized } from '../platform/platformService';
import { pickBestSave } from '../services/pickBestSave';
import { readLocalSave } from '../services/localSave';
import { saveService } from '../services/saveService';
import { gameStore } from '../store/GameStore';
import { settingsUiStore } from '../store/settingsUiStore';

async function loadCloudSave(): Promise<GameSave | null> {
  try {
    const player = await getPlatformSdk().getPlayer();
    if (!player.isAuthorized()) return null;
    const data = await player.getData([CLOUD_SAVE_KEY]);
    const raw = data[CLOUD_SAVE_KEY];
    if (!raw || typeof raw !== 'object') return null;
    return migrateSave(raw as GameSave);
  } catch {
    return null;
  }
}

function bindCloudPersist(): void {
  saveService.bind(() => gameStore.toSave(), {
    authChecker: isAuthorized,
    cloudWriter: async (save, flush) => {
      const player = await getPlatformSdk().getPlayer();
      await player.setData({ [CLOUD_SAVE_KEY]: save }, flush);
    },
  });
}

function bindPersistFlushHandlers(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeunload', () => {
    void saveService.flushPersist();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      void saveService.flushPersist();
    }
  });
}

export async function bootstrapGame(): Promise<void> {
  await initPlatform();

  const local = readLocalSave();
  const cloud = appConfig.isTestMode ? await loadCloudSave() : null;
  const best = pickBestSave(local, cloud);

  if (best) {
    gameStore.hydrate(best);
  }

  bindCloudPersist();
  await settingsUiStore.refreshAuth();
  bindPersistFlushHandlers();
}
