import { makeAutoObservable } from 'mobx';

export type ProfileTab = 'cat' | 'izba' | 'window' | 'brownie' | 'titles' | 'settings';

export class ProfileUiStore {
  isOpen = false;
  activeTab: ProfileTab = 'cat';
  selectedItemId: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  open(tab: ProfileTab = 'cat'): void {
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
