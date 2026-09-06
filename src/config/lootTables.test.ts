import { describe, expect, it } from 'vitest';
import { fragmentRequirements } from './lootTables';
import { spirits } from '../data/spirits';

describe('lootTables fragmentRequirements', () => {
  it('matches spirits.ts unlock.fragmentCount for fragment spirits', () => {
    for (const spirit of spirits) {
      if (spirit.unlock.kind !== 'fragments') continue;
      expect(fragmentRequirements[spirit.id]).toBe(spirit.unlock.fragmentCount);
    }
  });
});
