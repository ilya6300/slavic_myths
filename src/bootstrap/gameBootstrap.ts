import { viewSkins, type ViewSkinId } from '../config/assetRegistry';
import { appConfig, CLOUD_SAVE_KEY } from '../config/gameConstants';
import type { GameSave } from '../domain/GameSave';
import { migrateSave } from '../domain/saveMigration';
import { initPlatform, getPlatformSdk, isAuthorized } from '../platform/platformService';
import { pickBestSave } from '../services/pickBestSave';
import { readLocalSave } from '../services/localSave';
import { saveService } from '../services/saveService';
import { gameStore } from '../store/GameStore';
import { settingsUiStore } from '../store/settingsUiStore';

/** DEV: все виды из окна в owned — переключение в профиле «Лес». Экипировку не меняем. */
function applyDevUnlockAllWindowSkins(): void {
  if (!import.meta.env.DEV) return;

  const owned = new Set(gameStore.ownedSkinIds);
  for (const id of Object.keys(viewSkins) as ViewSkinId[]) {
    owned.add(id);
  }
  gameStore.ownedSkinIds = [...owned];
}

/** DEV: сразу экипировать избу «Гармония»; награда Лады не затрагивается. */
function applyDevHutHarmonyPreview(): void {
  if (!import.meta.env.DEV) return;

  const skinId = 'hut_harmony';
  if (!gameStore.ownedSkinIds.includes(skinId)) {
    gameStore.ownedSkinIds = [...gameStore.ownedSkinIds, skinId];
  }
  gameStore.skins = { ...gameStore.skins, izba: skinId };
}

/** DEV: скин кибер-помещения в owned и на сцене для проверки. */
function applyDevUnlockHutCyberpank(): void {
  if (!import.meta.env.DEV) return;

  const skinId = 'hut_cyberpank';
  if (!gameStore.ownedSkinIds.includes(skinId)) {
    gameStore.ownedSkinIds = [...gameStore.ownedSkinIds, skinId];
  }
  gameStore.skins = { ...gameStore.skins, izba: skinId };
}

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
      return;
    }
    if (document.visibilityState === 'visible') {
      gameStore.applyEnergyRegen();
      gameStore.maybeSpawnYardGrass();
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

  applyDevUnlockAllWindowSkins();
  applyDevHutHarmonyPreview();
  applyDevUnlockHutCyberpank();

  bindCloudPersist();
  await settingsUiStore.refreshAuth();
  bindPersistFlushHandlers();
}
