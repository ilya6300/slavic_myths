import { describe, expect, it } from 'vitest';

import { createDefaultSpiritStatuses } from './GameSave';
import {
  applyFragmentDrop,
  isFragmentChainComplete,
  pickFragmentDropTarget,
} from './fragmentDrop';

describe('fragmentDrop', () => {
  it('should ignore selectedFragmentSpiritId and use queue head', () => {
    const statuses = createDefaultSpiritStatuses();
    expect(
      pickFragmentDropTarget(statuses, { lada: 1 }),
    ).toBe('baba_yaga');
  });

  it('should pick baba_yaga first when chain is empty', () => {
    const statuses = createDefaultSpiritStatuses();
    expect(
      pickFragmentDropTarget(statuses, {}),
    ).toBe('baba_yaga');
  });

  it('should skip spirits with enough fragments even if still locked', () => {
    const statuses = createDefaultSpiritStatuses();
    const counts = { baba_yaga: 3, lada: 1 };
    expect(pickFragmentDropTarget(statuses, counts)).toBe('lada');
  });

  it('should return null when all fragment quotas are met', () => {
    const statuses = { ...createDefaultSpiritStatuses(), perun: 'defeated' };
    const counts = {
      baba_yaga: 3,
      lada: 3,
      veles: 6,
      koschei_immortal: 5,
      chudo_yudo: 8,
      yarilo: 8,
      perun: 10,
    };
    expect(pickFragmentDropTarget(statuses, counts)).toBeNull();
    expect(isFragmentChainComplete(statuses, counts)).toBe(true);
  });

  it('should increment fragment count for target spirit', () => {
    expect(applyFragmentDrop('lada', { lada: 1 })).toEqual({ lada: 2 });
  });
});
