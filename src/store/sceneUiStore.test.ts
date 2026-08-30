import { describe, expect, it, vi } from 'vitest';
import { gameStore } from './GameStore';
import { SceneUiStore } from './sceneUiStore';

describe('SceneUiStore', () => {
  it('switches active room', () => {
    const store = new SceneUiStore();
    expect(store.activeRoom).toBe(1);
    store.setRoom(2);
    expect(store.activeRoom).toBe(2);
  });

  it('wakes cat on activity', () => {
    const store = new SceneUiStore();
    store.catSleeping = true;
    store.registerActivity();
    expect(store.catSleeping).toBe(false);
  });

  it('puts cat to sleep after idle deadline', () => {
    vi.useFakeTimers();
    const store = new SceneUiStore();
    gameStore.onboardingCompleted = true;
    store.scheduleSleep(1000);
    store.sleepAt = 2000;
    store.tickIdle(1999);
    expect(store.catSleeping).toBe(false);
    store.tickIdle(2000);
    expect(store.catSleeping).toBe(true);
    gameStore.onboardingCompleted = false;
    vi.useRealTimers();
  });

  it('spawns and removes coin fx', () => {
    vi.useFakeTimers();
    const store = new SceneUiStore();
    store.spawnCoinFx(32, 20);
    expect(store.coinFxEvents).toHaveLength(1);
    vi.advanceTimersByTime(900);
    expect(store.coinFxEvents).toHaveLength(0);
    vi.useRealTimers();
  });
});
