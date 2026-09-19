import { makeAutoObservable } from 'mobx';

export type ProfileTab = 'stats' | 'cat' | 'izba' | 'window' | 'brownie' | 'titles' | 'atmosphere' | 'settings';

export class ProfileUiStore {
  isOpen = false;
  activeTab: ProfileTab = 'stats';
  selectedItemId: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  open(tab: ProfileTab = 'stats'): void {
    this.activeTab = tab;
    this.selectedItemId = null;
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
    this.selectedItemId = null;
  }

  setTab(tab: ProfileTab): void {
    this.activeTab = tab;
    this.selectedItemId = null;
  }

  selectItem(id: string): void {
    this.selectedItemId = id;
  }
}

export const profileUiStore = new ProfileUiStore();
