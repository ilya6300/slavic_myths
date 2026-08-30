import { makeAutoObservable } from 'mobx';
import { isAuthorized } from '../platform/platformService';

export class SettingsUiStore {
  authorized = false;
  resetConfirmOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  async refreshAuth(): Promise<void> {
    try {
      this.authorized = await isAuthorized();
    } catch {
      this.authorized = false;
    }
  }

  openResetConfirm(): void {
    this.resetConfirmOpen = true;
  }

  closeResetConfirm(): void {
    this.resetConfirmOpen = false;
  }
}

export const settingsUiStore = new SettingsUiStore();
