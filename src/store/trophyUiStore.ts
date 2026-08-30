import { makeAutoObservable } from 'mobx';
import type { SpiritId } from '../config/assetRegistry';

export class TrophyUiStore {
  activeSpiritId: SpiritId | null = null;
  isEmptySlot = false;

  constructor() {
    makeAutoObservable(this);
  }

  openTrophy(spiritId: SpiritId): void {
    this.activeSpiritId = spiritId;
    this.isEmptySlot = false;
  }

  openEmptySlot(spiritId: SpiritId): void {
    this.activeSpiritId = spiritId;
    this.isEmptySlot = true;
  }

  close(): void {
    this.activeSpiritId = null;
    this.isEmptySlot = false;
  }
}

export const trophyUiStore = new TrophyUiStore();
