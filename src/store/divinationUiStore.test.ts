import { describe, expect, it } from 'vitest';
import { divinationUiStore } from './divinationUiStore';

describe('divinationUiStore', () => {
  it('continueLine advances from reveal to result', () => {
    divinationUiStore.closeAll();
    divinationUiStore.phase = 'reveal';
    divinationUiStore.lineText = 'Суседко';
    divinationUiStore.pendingAfterSmoke = () => {
      divinationUiStore.phase = 'result';
      divinationUiStore.lineText = 'Верно!';
    };

    divinationUiStore.continueLine();

    expect(divinationUiStore.phase).toBe('result');
    expect(divinationUiStore.lineText).toBe('Верно!');
    divinationUiStore.closeAll();
  });
});
