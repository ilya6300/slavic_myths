import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { yagaShopCatSkins } from '../data/yagaShop';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));

const yagaShopCatSkinFiles: Record<string, { sid: string; sleep: string }> = {
  smook: {
    sid: 'assets/pets/the_age_of_miracles/smook/smook_sid.png',
    sleep: 'assets/pets/the_age_of_miracles/smook/smook_sleep.png',
  },
  purple_mage: {
    sid: 'assets/pets/the_age_of_miracles/purple_mage/purple_mage_sid.png',
    sleep: 'assets/pets/the_age_of_miracles/purple_mage/purple_mage_sleep.png',
  },
  midnight_sun: {
    sid: 'assets/pets/the_age_of_miracles/midnight_sun/midnight_sun_sid.png',
    sleep: 'assets/pets/the_age_of_miracles/midnight_sun/midnight_sun_sleep.png',
  },
  fluffy_veles: {
    sid: 'assets/pets/the_age_of_miracles/fluffy_veles/fluffy_veles_sid.png',
    sleep: 'assets/pets/the_age_of_miracles/fluffy_veles/fluffy_veles_sleep.png',
  },
  stormy_perun: {
    sid: 'assets/pets/the_age_of_miracles/stormy_perun/stormy_perun_sid.png',
    sleep: 'assets/pets/the_age_of_miracles/stormy_perun/stormy_perun_sleep.png',
  },
  wondrous_div: {
    sid: 'assets/pets/the_age_of_miracles/wondrous_div/wondrous_div_sid.png',
    sleep: 'assets/pets/the_age_of_miracles/wondrous_div/wondrous_div_sleep.png',
  },
  svarozhich: {
    sid: 'assets/pets/the_age_of_miracles/svarozhich/svarozhich_sid.png',
    sleep: 'assets/pets/the_age_of_miracles/svarozhich/svarozhich_sleep.png',
  },
};

describe('Yaga shop cat skins on disk', () => {
  it('should ship sid and sleep PNG for every shop cat skin', () => {
    expect(yagaShopCatSkins).toHaveLength(7);
    for (const item of yagaShopCatSkins) {
      const files = yagaShopCatSkinFiles[item.refId];
      expect(files, item.refId).toBeDefined();
      expect(existsSync(resolve(root, files.sid))).toBe(true);
      expect(existsSync(resolve(root, files.sleep))).toBe(true);
    }
  });
});
