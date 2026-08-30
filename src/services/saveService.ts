import { CLOUD_SAVE_KEY, PERSIST_DEBOUNCE_MS } from '../config/gameConstants';
import type { GameSave } from '../domain/GameSave';
import { writeLocalSave } from './localSave';

export type SaveSnapshotProvider = () => GameSave;

export class SaveService {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private getSnapshot: SaveSnapshotProvider | null = null;
  private cloudWriter: ((save: GameSave, flush: boolean) => Promise<void>) | null =
    null;
  private authChecker: (() => Promise<boolean>) | null = null;

  bind(
    getSnapshot: SaveSnapshotProvider,
    options?: {
      cloudWriter?: (save: GameSave, flush: boolean) => Promise<void>;
      authChecker?: () => Promise<boolean>;
    },
  ): void {
    this.getSnapshot = getSnapshot;
    this.cloudWriter = options?.cloudWriter ?? null;
    this.authChecker = options?.authChecker ?? null;
  }

  schedulePersist(): void {
    if (!this.getSnapshot) return;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      void this.flushPersist();
    }, PERSIST_DEBOUNCE_MS);
  }

  async flushPersist(): Promise<void> {
    if (!this.getSnapshot) return;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    const save = { ...this.getSnapshot(), savedAt: Date.now() };
    writeLocalSave(save);

    if (this.cloudWriter && this.authChecker && (await this.authChecker())) {
      await this.cloudWriter(save, true);
    }
  }

  dispose(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

export const saveService = new SaveService();

export { CLOUD_SAVE_KEY };
