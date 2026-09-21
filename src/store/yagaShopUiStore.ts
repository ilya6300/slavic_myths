import { makeAutoObservable } from 'mobx';

import { getYagaShopItemsForTab } from '../data/yagaShop';

export type YagaShopTab = 'cat' | 'titles' | 'pets' | 'atmosphere' | 'candles';

class YagaShopUiStore {
  isOpen = false;
  activeTab: YagaShopTab = 'cat';
  selectedShopItemId: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  private defaultSelection(tab: YagaShopTab): string | null {
    if (tab === 'candles') return null;
    const items = getYagaShopItemsForTab(tab);
    return items[0]?.id ?? null;
  }

  open(tab: YagaShopTab = 'cat'): void {
    this.activeTab = tab;
    this.selectedShopItemId = this.defaultSelection(tab);
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
    this.selectedShopItemId = null;
  }

  setTab(tab: YagaShopTab): void {
    this.activeTab = tab;
    this.selectedShopItemId = this.defaultSelection(tab);
  }

  selectItem(shopItemId: string): void {
    this.selectedShopItemId = shopItemId;
  }
}

export const yagaShopUiStore = new YagaShopUiStore();
