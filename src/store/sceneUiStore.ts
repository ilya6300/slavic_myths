import { makeAutoObservable } from 'mobx';
import {
  CAT_SLEEP_MAX_MS,
  CAT_SLEEP_MIN_MS,
} from '../config/gameConstants';
import type { GameStore } from './GameStore';

let boundGameStore: GameStore | null = null;

export function bindSceneGameStore(store: GameStore): void {
  boundGameStore = store;
}

export interface CoinFxEvent {
  id: number;
  leftVw: number;
  bottomVw: number;
}

export type IzbaRoom = 'street' | 1 | 2;
export type CatSleepReason = 'afk' | 'tired';

let coinFxId = 0;

export class SceneUiStore {
  activeRoom: IzbaRoom = 1;
  catSleeping = false;
  catSleepReason: CatSleepReason | null = null;
  tiredClickCount = 0;
  lastActivityAt = Date.now();
  sleepAt: number | null = null;
  coinFxEvents: CoinFxEvent[] = [];
  panBlocked = false;
  trophyRevealSpiritId: string | null = null;
  /** Активные пучки травы на улице (индексы слотов 0–2). */
  yardGrassSlots: number[] = [];
  grassChipShake = false;
  grassChipFlash = false;

  constructor() {
    makeAutoObservable(this);
    this.scheduleSleep();
  }

  setRoom(room: IzbaRoom): void {
    if (this.panBlocked) return;
    const wasStreet = this.activeRoom === 'street';
    this.activeRoom = room;
    if (room === 'street' && !wasStreet) {
      boundGameStore?.handleStreetRoomEntered();
    }
  }

  toggleRoom(): void {
    this.setRoom(this.activeRoom === 1 ? 2 : 1);
  }

  enterAfkSleep(): void {
    this.catSleeping = true;
    this.catSleepReason = 'afk';
    this.sleepAt = null;
  }

  enterTiredSleep(): void {
    this.catSleeping = true;
    this.catSleepReason = 'tired';
    this.sleepAt = null;
  }

  wakeFromSleep(): void {
    this.catSleeping = false;
    this.catSleepReason = null;
    this.scheduleSleep();
  }

  registerActivity(): void {
    this.lastActivityAt = Date.now();
    if (this.catSleepReason === 'tired') return;
    if (this.catSleeping) {
      this.wakeFromSleep();
    }
    this.scheduleSleep();
  }

  scheduleSleep(now: number = Date.now()): void {
    const delay =
      CAT_SLEEP_MIN_MS +
      Math.random() * (CAT_SLEEP_MAX_MS - CAT_SLEEP_MIN_MS);
    this.sleepAt = now + delay;
  }

  syncTiredSleepFromEnergy(): void {
    const gs = boundGameStore;
    if (!gs) return;
    if (gs.isOnboarding && !gs.onboardingCompleted) return;
    if (!gs.onboardingCompleted) return;

    if (gs.energy === 0) {
      if (!this.catSleeping || this.catSleepReason !== 'tired') {
        this.enterTiredSleep();
      }
      return;
    }

    if (this.catSleepReason === 'tired') {
      this.tiredClickCount = 0;
      this.wakeFromSleep();
    }
  }

  /** Вызывается тикером ~1 с */
  tickIdle(now: number = Date.now()): void {
    const gs = boundGameStore;
    if (gs?.isOnboarding && !gs.onboardingCompleted) return;

    this.syncTiredSleepFromEnergy();

    if (this.catSleepReason === 'tired') return;
    if (this.catSleeping || this.sleepAt == null) return;
    if (now >= this.sleepAt) {
      this.enterAfkSleep();
    }
  }

  spawnCoinFx(leftVw: number, bottomVw: number): void {
    const id = ++coinFxId;
    this.coinFxEvents.push({ id, leftVw, bottomVw });
    setTimeout(() => this.removeCoinFx(id), 900);
  }

  removeCoinFx(id: number): void {
    this.coinFxEvents = this.coinFxEvents.filter((e) => e.id !== id);
  }

  triggerTrophyReveal(spiritId: string): void {
    this.trophyRevealSpiritId = spiritId;
    globalThis.setTimeout(() => {
      if (this.trophyRevealSpiritId === spiritId) {
        this.trophyRevealSpiritId = null;
      }
    }, 1200);
  }

  setYardGrassSlots(slots: number[]): void {
    this.yardGrassSlots = slots;
  }

  triggerGrassChipShake(): void {
    this.grassChipShake = true;
    globalThis.setTimeout(() => {
      this.grassChipShake = false;
    }, 400);
  }

  triggerGrassChipFlash(): void {
    this.grassChipFlash = true;
    globalThis.setTimeout(() => {
      this.grassChipFlash = false;
    }, 350);
  }
}

export const sceneUiStore = new SceneUiStore();
