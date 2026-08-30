import { makeAutoObservable } from 'mobx';

import type { ChestLootItem } from '../domain/chestLoot';



export class ChestUiStore {

  isOpen = false;

  lastLoot: ChestLootItem | null = null;

  source: 'regular' | 'miracle' = 'regular';

  cooldownOpen = false;



  constructor() {

    makeAutoObservable(this);

  }



  showLoot(loot: ChestLootItem, source: 'regular' | 'miracle' = 'regular'): void {

    this.lastLoot = loot;

    this.source = source;

    this.isOpen = true;

    this.cooldownOpen = false;

  }



  showCooldown(): void {

    this.cooldownOpen = true;

  }



  close(): void {

    this.isOpen = false;

    this.lastLoot = null;

    this.source = 'regular';

    this.cooldownOpen = false;

  }



  closeCooldown(): void {

    this.cooldownOpen = false;

  }

}



export const chestUiStore = new ChestUiStore();

