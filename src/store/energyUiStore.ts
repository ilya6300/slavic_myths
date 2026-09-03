import { makeAutoObservable } from 'mobx';

export class EnergyUiStore {
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

export const energyUiStore = new EnergyUiStore();
