import { describe, expect, it } from 'vitest';
import { SPIRIT_ORDER, spirits } from './spirits';
import { titles, DEFAULT_TITLE_ID } from './titles';

describe('spirits data', () => {
  it('should contain 16 spirits in canon order', () => {
    expect(spirits).toHaveLength(16);
    expect(spirits.map((s) => s.id)).toEqual(SPIRIT_ORDER);
  });

  it('should have brownie as start unlock', () => {
    const brownie = spirits.find((s) => s.id === 'brownie')!;
    expect(brownie.unlock.kind).toBe('start');
    expect(brownie.hasTrophy).toBe(false);
  });
});

describe('titles data', () => {
  it('should have default start title novenkiy', () => {
    const start = titles.find((t) => t.id === DEFAULT_TITLE_ID);
    expect(start?.source).toBe('start');
  });

  it('should keep epoch titles out of chest source except miracle', () => {
    const chestEpoch = titles.filter(
      (t) => t.grade === 'epoch' && t.source === 'chest',
    );
    expect(chestEpoch).toHaveLength(0);
  });
});
