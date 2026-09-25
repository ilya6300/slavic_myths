import type { SpiritId } from '../config/assetRegistry';
import { appConfig, CLOUD_SAVE_KEY } from '../config/gameConstants';
import { fragmentRequirements } from '../config/lootTables';
import { spirits } from '../data/spirits';
import type { GameSave, SpiritStatus } from '../domain/GameSave';
import { migrateSave } from '../domain/saveMigration';
import { stripLegacyDevMetaSeed } from '../domain/legacyDevSaveStrip';
import { applyFragmentUnlocks } from '../domain/spiritQueue';
import { initPlatform, getPlatformSdk, isAuthorized } from '../platform/platformService';
import { pickBestSave } from '../services/pickBestSave';
import { readLocalSave } from '../services/localSave';
import { saveService } from '../services/saveService';
import { gameStore } from '../store/GameStore';
import { settingsUiStore } from '../store/settingsUiStore';

/** Бывший DEV seed: max(prev, 2) на каждого фрагментного духа — чистим из localStorage. */
const LEGACY_DEV_FRAGMENT_SEED_EACH = 2;

/**
 * Снимает с пола DEV-сиды, уже записанные в сейв (bootstrap больше не сидит).
 * В проде не вызывается.
 */
export function stripLegacyDevFragmentSeedFromCounts(
  counts: Record<string, number>,
): { counts: Record<string, number>; changed: boolean } {
  const ids = Object.keys(fragmentRequirements);
  if (ids.length === 0) {
    return { counts: { ...counts }, changed: false };
  }

  const next = { ...counts };
  let changed = false;
  for (const id of ids) {
    if (next[id] === LEGACY_DEV_FRAGMENT_SEED_EACH) {
      delete next[id];
      changed = true;
    }
  }
  return { counts: next, changed };
}

function applyDevStripLegacyMetaSeed(): boolean {
  if (!import.meta.env.DEV) return false;

  const meta = stripLegacyDevMetaSeed({
    ownedSkinIds: gameStore.ownedSkinIds,
    truthCrumbs: gameStore.truthCrumbs,
    spiritStatuses: gameStore.spiritStatuses,
    starterPackPurchased: gameStore.starterPackPurchased,
    skins: gameStore.skins,
  });
  if (meta.changed) {
    gameStore.ownedSkinIds = meta.ownedSkinIds;
    gameStore.truthCrumbs = meta.truthCrumbs;
    gameStore.skins = meta.skins;
    return true;
  }
  return false;
}

function applyDevStripLegacyFragmentSeed(): boolean {
  if (!import.meta.env.DEV) return false;

  const { counts, changed } = stripLegacyDevFragmentSeedFromCounts(
    gameStore.fragmentCounts,
  );
  if (!changed) return false;

  gameStore.fragmentCounts = counts;
  gameStore.selectedFragmentSpiritId = null;

  let statuses = { ...gameStore.spiritStatuses };
  for (const spirit of spirits) {
    if (spirit.unlock.kind !== 'fragments') continue;
    if (statuses[spirit.id] === 'defeated') continue;
    statuses[spirit.id] = 'locked';
  }
  gameStore.spiritStatuses = applyFragmentUnlocks(
    statuses,
    counts,
  ) as Record<SpiritId, SpiritStatus>;

  return true;
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

  const strippedDevMeta = applyDevStripLegacyMetaSeed();
  const strippedDevFragments = applyDevStripLegacyFragmentSeed();

  bindCloudPersist();
  if (strippedDevMeta || strippedDevFragments) {
    saveService.schedulePersist();
  }
  await settingsUiStore.refreshAuth();
  bindPersistFlushHandlers();
}
