import { makeAutoObservable } from 'mobx';

import { sceneUiStore } from './sceneUiStore';

export class KikimoraCraftUiStore {
  isOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  open(): void {
    sceneUiStore.panBlocked = true;
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
    sceneUiStore.panBlocked = false;
  }
}

export const kikimoraCraftUiStore = new KikimoraCraftUiStore();
