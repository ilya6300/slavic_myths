import { appConfig } from '../config/gameConstants';

export interface PlatformPlayer {
  isAuthorized(): boolean;
  getData(keys: string[]): Promise<Record<string, unknown>>;
  setData(data: Record<string, unknown>, flush?: boolean): Promise<void>;
}

export interface PlatformAuth {
  openAuthDialog(): Promise<void>;
}

export interface PlatformAdv {
  showRewardedVideo(options: {
    callbacks: { onRewarded: () => void; onClose?: () => void };
  }): void;
}

export interface PlatformSdk {
  getPlayer(): Promise<PlatformPlayer>;
  auth: PlatformAuth;
  adv: PlatformAdv;
}

let sdk: PlatformSdk | null = null;

export function setPlatformSdk(instance: PlatformSdk): void {
  sdk = instance;
}

export function getPlatformSdk(): PlatformSdk {
  if (!sdk) {
    throw new Error('Platform SDK not initialized');
  }
  return sdk;
}

export async function initPlatform(): Promise<void> {
  if (sdk) return;
  if (appConfig.isTestMode || import.meta.env.DEV) {
    const { createMockYsdk } = await import('./mockYsdk');
    sdk = createMockYsdk();
    return;
  }
  throw new Error('Real YaGames SDK is not wired in this build');
}

export async function isAuthorized(): Promise<boolean> {
  const player = await getPlatformSdk().getPlayer();
  return player.isAuthorized();
}

export async function requestAuth(): Promise<boolean> {
  await getPlatformSdk().auth.openAuthDialog();
  return isAuthorized();
}
