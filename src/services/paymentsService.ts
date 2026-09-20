import type { Locale } from '../i18n/types';
import { gameStore } from '../store/GameStore';

export type PurchaseResult = 'success' | 'already_owned' | 'cancelled';

/** Dev-stub: без Яндекс Payments API. */
export class PaymentsService {
  async purchaseStarterPack(): Promise<PurchaseResult> {
    if (gameStore.starterPackPurchased) {
      return 'already_owned';
    }
    return gameStore.applyStarterPackPurchase();
  }

  /** Цена из каталога SDK (stub — яны). */
  getCandlePackPriceLabel(_locale: Locale): string {
    return '—';
  }

  async purchaseCandlePack(): Promise<PurchaseResult> {
    gameStore.applyCandlePackPurchase();
    return 'success';
  }
}

export const paymentsService = new PaymentsService();
