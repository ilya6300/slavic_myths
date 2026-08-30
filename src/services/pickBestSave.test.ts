import { describe, expect, it } from 'vitest';
import { createDefaultSave } from '../domain/GameSave';
import { pickBestSave } from './pickBestSave';

describe('pickBestSave', () => {
  it('returns cloud when local is null', () => {
    const cloud = createDefaultSave(2000);
    expect(pickBestSave(null, cloud)).toBe(cloud);
  });

  it('returns local when cloud is null', () => {
    const local = createDefaultSave(1000);
    expect(pickBestSave(local, null)).toBe(local);
  });

  it('picks newer savedAt', () => {
    const older = createDefaultSave(1000);
    const newer = createDefaultSave(5000);
    expect(pickBestSave(older, newer)).toBe(newer);
    expect(pickBestSave(newer, older)).toBe(newer);
  });

  it('prefers local on equal savedAt', () => {
    const local = createDefaultSave(3000);
    const cloud = { ...createDefaultSave(3000), energy: 42 };
    expect(pickBestSave(local, cloud)).toBe(local);
  });
});
