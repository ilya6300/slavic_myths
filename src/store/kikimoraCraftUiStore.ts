import { makeAutoObservable } from 'mobx';

export class KikimoraCraftUiStore {
  isOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }
}

export const kikimoraCraftUiStore = new KikimoraCraftUiStore();
