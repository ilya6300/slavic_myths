import { makeAutoObservable } from 'mobx';

export type YagaShopTab = 'crumbs' | 'candles';

class YagaShopUiStore {
  isOpen = false;
  activeTab: YagaShopTab = 'crumbs';

  constructor() {
    makeAutoObservable(this);
  }

  open(tab: YagaShopTab = 'crumbs'): void {
    this.activeTab = tab;
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }

  setTab(tab: YagaShopTab): void {
    this.activeTab = tab;
  }
}

export const yagaShopUiStore = new YagaShopUiStore();
