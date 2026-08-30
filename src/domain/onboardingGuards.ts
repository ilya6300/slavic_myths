/**
 * Блокировки UI по шагам онбординга.
 * Канон: technical_requirements.md §5; scenario.md §4.2
 */

export type OnboardingInteractable =
  | 'cat'
  | 'book'
  | 'chest'
  | 'chestMiracle'
  | 'pan'
  | 'profile';

export type TutorialHighlightTarget = 'book' | 'chest';

export function canInteract(
  onboardingStep: number,
  onboardingCompleted: boolean,
  target: OnboardingInteractable,
): boolean {
  if (onboardingCompleted) return true;

  switch (onboardingStep) {
    case 0:
      return target === 'cat';
    case 1:
      return target === 'cat' || target === 'book';
    case 2:
      return target === 'cat' || target === 'book';
    case 3:
      return target === 'cat' || target === 'book';
    case 4:
      return target === 'cat' || target === 'book';
    case 5:
      return true;
    case 6:
      return true;
    default:
      return true;
  }
}

export function isTutorialHighlight(
  onboardingStep: number,
  onboardingCompleted: boolean,
  target: TutorialHighlightTarget,
): boolean {
  if (onboardingCompleted) return false;
  if (onboardingStep === 1 && target === 'book') return true;
  if (onboardingStep === 5 && target === 'chest') return true;
  return false;
}

export function shouldUseNovelDialog(
  onboardingStep: number,
  onboardingCompleted: boolean,
): boolean {
  return !onboardingCompleted && (onboardingStep === 0 || onboardingStep === 1);
}

export function shouldBlockPan(
  onboardingStep: number,
  onboardingCompleted: boolean,
): boolean {
  return !onboardingCompleted && onboardingStep <= 1;
}
