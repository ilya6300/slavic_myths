import { makeAutoObservable } from 'mobx';

import { gameStore } from './GameStore';
import { sceneUiStore } from './sceneUiStore';

export class KikimoraCraftUiStore {
  isOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  open(): void {
    if (sceneUiStore.activeRoom !== 'street') {
      gameStore.tryEnterStreet();
    }
    sceneUiStore.panBlocked = true;
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
    sceneUiStore.panBlocked = false;
  }
}

export const kikimoraCraftUiStore = new KikimoraCraftUiStore();
