import { readFileSync } from 'node:fs';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { SAVE_VERSION } from '../config/gameConstants';
import { STARTER_PACK_CAT_SKIN_ID } from '../config/gameConstants';
import { getCatSkinIdsByGrade } from '../data/skinPools';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));

describe('Epic 13 integration contracts', () => {
  it('should use save v9 or newer with street room support', () => {
    expect(SAVE_VERSION).toBeGreaterThanOrEqual(9);
    const scene = readFileSync(resolve(root, 'src/store/sceneUiStore.ts'), 'utf8');
    expect(scene).toMatch(/IzbaRoom|street/);
  });

  it('should exclude starter pack cat skin from chest pools', () => {
    for (const grade of ['common', 'rare', 'epic', 'epoch'] as const) {
      expect(getCatSkinIdsByGrade(grade)).not.toContain(STARTER_PACK_CAT_SKIN_ID);
    }
  });

  it('should ship core Epic 13 assets on disk', () => {
    const paths = [
      'assets/furniture/starter_casket.png',
      'assets/furniture/yard_grass.png',
      'assets/quiz/kikimora_craft_bg.jpeg',
      'assets/furniture/kikimora_weaving.png',
      'assets/UI/icon_energy.png',
      'assets/UI/icon_smetana.png',
      'assets/pets/rate/cat_pilgrim/cat_pilgrim_sid.png',
    ];
    for (const rel of paths) {
      expect(existsSync(resolve(root, rel))).toBe(true);
    }
  });

  it('should expose street yard and kikimora craft UI', () => {
    expect(existsSync(resolve(root, 'src/ui/street/StreetYard.tsx'))).toBe(true);
    expect(existsSync(resolve(root, 'src/ui/street/KikimoraCraftModal.tsx'))).toBe(true);
    const ads = readFileSync(resolve(root, 'src/ui/ads/RewardedWaitOverlay.tsx'), 'utf8');
    expect(ads.length).toBeGreaterThan(100);
  });
});
