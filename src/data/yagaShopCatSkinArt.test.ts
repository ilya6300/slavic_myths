import { describe, expect, it } from 'vitest';

import { assertYagaShopCatSkinArtComplete, yagaShopCatSkinArt } from './yagaShopCatSkinArt';
import { yagaShopCatSkins } from './yagaShop';

describe('yagaShopCatSkinArt', () => {
  it('should define epic art spec for every Yaga shop cat skin', () => {
    assertYagaShopCatSkinArtComplete();
    expect(Object.keys(yagaShopCatSkinArt)).toHaveLength(yagaShopCatSkins.length);
  });
});
