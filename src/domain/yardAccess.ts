import { isNightTime } from './nightTime';

export type StreetBlockReason = 'onboarding' | 'zhirdyay' | 'night';

export function canEnterStreet(input: {
  onboardingCompleted: boolean;
  zhirdyayActive: boolean;
  isNight: boolean;
}): boolean {
  if (!input.onboardingCompleted) return false;
  if (input.zhirdyayActive) return false;
  if (input.isNight) return false;
  return true;
}

export function getStreetBlockReason(input: {
  onboardingCompleted: boolean;
  zhirdyayActive: boolean;
  isNight?: boolean;
  now?: Date;
}): StreetBlockReason | null {
  if (!input.onboardingCompleted) return 'onboarding';
  if (input.zhirdyayActive) return 'zhirdyay';
  const night = input.isNight ?? isNightTime(input.now);
  if (night) return 'night';
  return null;
}
