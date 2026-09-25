import { describe, expect, it } from 'vitest';
import {
  isLegacyDevBulkIzbaWindowUnlock,
  stripLegacyDevMetaSeed,
} from './legacyDevSaveStrip';

describe('legacyDevSaveStrip', () => {
  it('should detect bulk izba and window dev unlock', () => {
    expect(
      isLegacyDevBulkIzbaWindowUnlock([
        'cat_standart',
        'brownie_standart',
        'hut_standart',
        'landscape_standart',
        'hut_rate',
        'hut_the_age_of_miracles',
        'hut_harmony',
        'hut_cyberpank',
        'landscape_temnyy_les',
        'landscape_omut',
        'landscape_cyber_city',
        'landscape_yaga',
      ]),
    ).toBe(true);
  });

  it('should strip bulk unlock to defaults and quest rewards only', () => {
    const { ownedSkinIds, truthCrumbs, skins, changed } = stripLegacyDevMetaSeed(
      {
        ownedSkinIds: [
          'cat_standart',
          'brownie_standart',
          'hut_standart',
          'landscape_standart',
          'hut_rate',
          'hut_the_age_of_miracles',
          'hut_harmony',
          'hut_cyberpank',
          'landscape_temnyy_les',
          'landscape_omut',
          'landscape_cyber_city',
          'landscape_yaga',
        ],
        truthCrumbs: 40,
        spiritStatuses: {
          baba_yaga: 'defeated',
          lada: 'locked',
        },
        starterPackPurchased: false,
        skins: {
          cat: 'cat_standart',
          domovoy: 'brownie_standart',
          izba: 'hut_cyberpank',
          window: 'landscape_omut',
        },
      },
    );

    expect(changed).toBe(true);
    expect(truthCrumbs).toBe(0);
    expect(ownedSkinIds).toContain('landscape_yaga');
    expect(ownedSkinIds).not.toContain('hut_cyberpank');
    expect(ownedSkinIds).not.toContain('landscape_omut');
    expect(skins.izba).toBe('hut_standart');
    expect(skins.window).toBe('landscape_standart');
  });

  it('should not strip partial chest progress', () => {
    const input = {
      ownedSkinIds: [
        'cat_standart',
        'brownie_standart',
        'hut_standart',
        'landscape_standart',
        'hut_rate',
      ],
      truthCrumbs: 10,
      spiritStatuses: {},
      starterPackPurchased: false,
      skins: {
        cat: 'cat_standart',
        domovoy: 'brownie_standart',
        izba: 'hut_standart',
        window: 'landscape_standart',
      },
    };
    const result = stripLegacyDevMetaSeed(input);
    expect(result.changed).toBe(false);
    expect(result.truthCrumbs).toBe(10);
  });
});
