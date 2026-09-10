import { makeAutoObservable } from 'mobx';

export class StarterPackUiStore {
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

export const starterPackUiStore = new StarterPackUiStore();
