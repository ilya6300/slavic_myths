import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  allYagaShopCrumbItems,
  YAGA_SHOP_CAT_SKIN_PRICE,
  YAGA_SHOP_EFFECT_PRICE,
  YAGA_SHOP_TITLE_PRICE,
} from '../data/yagaShop';
import { YAGA_PET_PRICE_CRUMBS } from '../data/pets';
import { izbaEffects } from '../data/izbaEffects';
import { getMiracleCatSkinIds } from '../data/skinPools';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));

describe('Epic 16 integration contracts', () => {
  it('should keep Yaga shop prices per draft', () => {
    for (const item of allYagaShopCrumbItems) {
      if (item.kind === 'cat_skin') expect(item.priceCrumbs).toBe(YAGA_SHOP_CAT_SKIN_PRICE);
      if (item.kind === 'title') expect(item.priceCrumbs).toBe(YAGA_SHOP_TITLE_PRICE);
      if (item.kind === 'pet') expect(item.priceCrumbs).toBe(YAGA_PET_PRICE_CRUMBS);
      if (item.kind === 'izba_effect') expect(item.priceCrumbs).toBe(YAGA_SHOP_EFFECT_PRICE);
    }
  });

  it('should exclude shop epoch cat skins from miracle chest pool', () => {
    const epoch = getMiracleCatSkinIds('epoch');
    expect(epoch).not.toContain('smook');
    expect(epoch).not.toContain('purple_mage');
  });

  it('should list thunder_izba and four shop FX in izbaEffects', () => {
    const ids = izbaEffects.map((e) => e.id);
    expect(ids).toContain('thunder_izba');
    expect(ids).toContain('shop_fog');
    expect(ids).toContain('shop_firefly');
    expect(ids).toContain('shop_ball_lightning');
    expect(ids).toContain('shop_stars');
  });

  it('should keep layer-izba and WindowAperture in both izba rooms', () => {
    const source = readFileSync(
      resolve(root, 'src/ui/scene/IzbaSceneLayers.tsx'),
      'utf8',
    );
    const room1 = source.indexOf('export const Room1Scene');
    const room2 = source.indexOf('export const Room2Scene');
    expect(room1).toBeGreaterThan(0);
    expect(room2).toBeGreaterThan(room1);
    const block1 = source.slice(room1, room2);
    const block2 = source.slice(room2);
    expect(block1).toContain('WindowAperture');
    expect(block1).toContain('layer-izba');
    expect(block2).toContain('WindowAperture');
    expect(block2).toContain('layer-izba');
  });

  it('should keep pet and izba FX layers non-interactive in CSS', () => {
    const css = readFileSync(resolve(root, 'src/ui/index.css'), 'utf8');
    expect(css).toMatch(/\.scene-pet\s*\{[^}]*pointer-events:\s*none/);
    expect(css).toMatch(/\.izba-scene__inner\s*>\s*\.layer-izba-fx[^}]*pointer-events:\s*none/);
    expect(css).toMatch(/\.izba-scene--effect-fog/);
  });
});
