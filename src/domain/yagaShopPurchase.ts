/**
 * Покупки лавки Яги за вещие крупицы (draft §«Лавка Яги»).
 */

import type { YagaShopItem } from '../data/yagaShop';
import { isDivinationUnlocked } from './divinationSession';
import type { SpiritStatus } from './GameSave';

export type YagaShopPurchaseResult =
  | 'success'
  | 'already_owned'
  | 'insufficient_crumbs'
  | 'shop_locked';

export function isYagaShopUnlocked(
  statuses: Record<string, SpiritStatus>,
): boolean {
  return isDivinationUnlocked(statuses);
}

export function isYagaShopItemPurchased(
  shopItemId: string,
  purchasedIds: string[],
): boolean {
  return purchasedIds.includes(shopItemId);
}

export function canAffordYagaShopItem(
  truthCrumbs: number,
  item: YagaShopItem,
): boolean {
  return truthCrumbs >= item.priceCrumbs;
}

export function spendTruthCrumbsForShop(
  truthCrumbs: number,
  priceCrumbs: number,
): number {
  if (priceCrumbs <= 0 || truthCrumbs < priceCrumbs) return truthCrumbs;
  return truthCrumbs - priceCrumbs;
}

export function validateYagaShopPurchase(
  statuses: Record<string, SpiritStatus>,
  truthCrumbs: number,
  purchasedIds: string[],
  item: YagaShopItem,
): YagaShopPurchaseResult {
  if (!isYagaShopUnlocked(statuses)) return 'shop_locked';
  if (isYagaShopItemPurchased(item.id, purchasedIds)) return 'already_owned';
  if (!canAffordYagaShopItem(truthCrumbs, item)) return 'insufficient_crumbs';
  return 'success';
}
