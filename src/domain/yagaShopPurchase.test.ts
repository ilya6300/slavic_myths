import { describe, expect, it } from 'vitest';

import { yagaShopTitles } from '../data/yagaShop';
import {
  spendTruthCrumbsForShop,
  validateYagaShopPurchase,
} from './yagaShopPurchase';

describe('yagaShopPurchase', () => {
  const item = yagaShopTitles[0]!;

  it('should reject purchase before Yaga victory', () => {
    expect(
      validateYagaShopPurchase(
        { baba_yaga: 'available' },
        100,
        [],
        item,
      ),
    ).toBe('shop_locked');
  });

  it('should reject duplicate and insufficient crumbs', () => {
    const statuses = { baba_yaga: 'defeated' as const };
    expect(
      validateYagaShopPurchase(statuses, 5, [], item),
    ).toBe('insufficient_crumbs');
    expect(
      validateYagaShopPurchase(statuses, 100, [item.id], item),
    ).toBe('already_owned');
    expect(validateYagaShopPurchase(statuses, 100, [], item)).toBe('success');
  });

  it('should subtract crumbs on spend', () => {
    expect(spendTruthCrumbsForShop(30, 10)).toBe(20);
    expect(spendTruthCrumbsForShop(5, 10)).toBe(5);
  });
});
