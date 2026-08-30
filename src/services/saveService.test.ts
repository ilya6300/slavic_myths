// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PERSIST_DEBOUNCE_MS } from '../config/gameConstants';
import { createDefaultSave } from '../domain/GameSave';
import { SaveService } from './saveService';
import { clearLocalSave, readLocalSave } from './localSave';

describe('SaveService', () => {
  beforeEach(() => {
    clearLocalSave();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debounces persist by PERSIST_DEBOUNCE_MS', () => {
    const service = new SaveService();
    const save = createDefaultSave(1000);
    service.bind(() => save);

    service.schedulePersist();
    expect(readLocalSave()).toBeNull();

    vi.advanceTimersByTime(PERSIST_DEBOUNCE_MS - 1);
    expect(readLocalSave()).toBeNull();

    vi.advanceTimersByTime(1);
    expect(readLocalSave()).not.toBeNull();
  });

  it('flushPersist writes immediately', async () => {
    const service = new SaveService();
    const save = createDefaultSave(2000);
    save.energy = 77;
    service.bind(() => save);

    service.schedulePersist();
    await service.flushPersist();

    expect(readLocalSave()?.energy).toBe(77);
  });

  it('resets debounce timer on repeated schedulePersist', () => {
    const service = new SaveService();
    service.bind(() => createDefaultSave());

    service.schedulePersist();
    vi.advanceTimersByTime(PERSIST_DEBOUNCE_MS - 500);
    service.schedulePersist();
    vi.advanceTimersByTime(PERSIST_DEBOUNCE_MS - 500);
    expect(readLocalSave()).toBeNull();

    vi.advanceTimersByTime(500);
    expect(readLocalSave()).not.toBeNull();
  });
});
