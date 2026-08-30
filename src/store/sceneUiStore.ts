import { makeAutoObservable } from 'mobx';
import {
  CAT_SLEEP_MAX_MS,
  CAT_SLEEP_MIN_MS,
} from '../config/gameConstants';
import { gameStore } from './GameStore';

export interface CoinFxEvent {
  id: number;
  leftVw: number;
  bottomVw: number;
}

export type IzbaRoom = 1 | 2;

let coinFxId = 0;

export class SceneUiStore {
  activeRoom: IzbaRoom = 1;
  catSleeping = false;
  lastActivityAt = Date.now();
  sleepAt: number | null = null;
  coinFxEvents: CoinFxEvent[] = [];
  panBlocked = false;

  constructor() {
    makeAutoObservable(this);
    this.scheduleSleep();
  }

  setRoom(room: IzbaRoom): void {
    if (this.panBlocked) return;
    this.activeRoom = room;
  }

  toggleRoom(): void {
    this.setRoom(this.activeRoom === 1 ? 2 : 1);
  }

  registerActivity(): void {
    this.lastActivityAt = Date.now();
    if (this.catSleeping) {
      this.catSleeping = false;
    }
    this.scheduleSleep();
  }

  scheduleSleep(now: number = Date.now()): void {
    const delay =
      CAT_SLEEP_MIN_MS +
      Math.random() * (CAT_SLEEP_MAX_MS - CAT_SLEEP_MIN_MS);
    this.sleepAt = now + delay;
  }

  /** Вызывается тикером ~1 с */
  tickIdle(now: number = Date.now()): void {
    if (gameStore.isOnboarding && !gameStore.onboardingCompleted) return;
    if (this.catSleeping || this.sleepAt == null) return;
    if (now >= this.sleepAt) {
      this.catSleeping = true;
      this.sleepAt = null;
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
}

export const sceneUiStore = new SceneUiStore();
