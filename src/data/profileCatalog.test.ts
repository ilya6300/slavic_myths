import { describe, expect, it } from 'vitest';
import { STARTER_PACK_CAT_SKIN_ID } from '../config/gameConstants';
import { getProfileCatSkins } from './profileCatalog';

describe('profileCatalog', () => {
  it('includes IAP cat_pilgrim in cat tab', () => {
    const ids = getProfileCatSkins().map((s) => s.id);
    expect(ids).toContain(STARTER_PACK_CAT_SKIN_ID);
  });

  it('sorts pilgrim before other rare cats', () => {
    const ids = getProfileCatSkins().map((s) => s.id);
    const pilgrimIndex = ids.indexOf(STARTER_PACK_CAT_SKIN_ID);
    const firstRareIndex = ids.findIndex((id) => {
      const entry = getProfileCatSkins().find((s) => s.id === id);
      return entry?.grade === 'rare';
    });
    expect(pilgrimIndex).toBe(firstRareIndex);
  });
});
