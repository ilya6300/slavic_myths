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
}

export const paymentsService = new PaymentsService();
