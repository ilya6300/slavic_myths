import { describe, expect, it, vi } from 'vitest';
import { GameStore } from './GameStore';
import { bindSceneGameStore, SceneUiStore } from './sceneUiStore';
import { createDefaultSave } from '../domain/GameSave';

describe('SceneUiStore', () => {
  it('switches active room', () => {
    const store = new SceneUiStore();
    expect(store.activeRoom).toBe(1);
    store.setRoom(2);
    expect(store.activeRoom).toBe(2);
  });

  it('wakes cat on activity when AFK sleep', () => {
    const store = new SceneUiStore();
    store.enterAfkSleep();
    store.registerActivity();
    expect(store.catSleeping).toBe(false);
    expect(store.catSleepReason).toBeNull();
  });

  it('wakes cat on activity when sleeping without reason (legacy bootstrap)', () => {
    const store = new SceneUiStore();
    store.catSleeping = true;
    store.catSleepReason = null;
    store.registerActivity();
    expect(store.catSleeping).toBe(false);
    expect(store.catSleepReason).toBeNull();
  });

  it('does not wake cat on activity when tired', () => {
    const store = new SceneUiStore();
    store.enterTiredSleep();
    store.registerActivity();
    expect(store.catSleeping).toBe(true);
    expect(store.catSleepReason).toBe('tired');
  });

  it('puts cat to sleep after idle deadline', () => {
    vi.useFakeTimers();
    const gs = new GameStore();
    gs.hydrate({ ...createDefaultSave(), onboardingCompleted: true });
    bindSceneGameStore(gs);
    const store = new SceneUiStore();
    store.scheduleSleep(1000);
    store.sleepAt = 2000;
    store.tickIdle(1999);
    expect(store.catSleeping).toBe(false);
    store.tickIdle(2000);
    expect(store.catSleeping).toBe(true);
    expect(store.catSleepReason).toBe('afk');
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
