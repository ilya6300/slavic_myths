import { LOCAL_SAVE_KEY } from '../config/gameConstants';
import type { GameSave } from '../domain/GameSave';
import { migrateSave } from '../domain/saveMigration';

export function readLocalSave(): GameSave | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(LOCAL_SAVE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as GameSave;
    return migrateSave(parsed);
  } catch {
    return null;
  }
}

export function writeLocalSave(save: GameSave): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(save));
}

export function clearLocalSave(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(LOCAL_SAVE_KEY);
}
