import type { GameSave } from '../domain/GameSave';

export function pickBestSave(
  local: GameSave | null,
  cloud: GameSave | null,
): GameSave | null {
  if (!local) return cloud;
  if (!cloud) return local;
  return local.savedAt >= cloud.savedAt ? local : cloud;
}
