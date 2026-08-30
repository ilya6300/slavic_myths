import { useEffect } from 'react';
import { reaction } from 'mobx';
import { bookUiStore } from '../../store/bookUiStore';
import { quizUiStore } from '../../store/quizUiStore';
import {
  shouldBlockPan,
} from '../../domain/onboardingGuards';
import { gameStore } from '../../store/GameStore';
import { catDialogStore } from '../../store/catDialogStore';
import { sceneUiStore } from '../../store/sceneUiStore';

export function useOnboardingBootstrap(locale: string): void {
  useEffect(() => {
    if (gameStore.onboardingCompleted && !gameStore.isFirstLaunch) {
      sceneUiStore.catSleeping = true;
    }
  }, []);

  useEffect(() => {
    if (gameStore.onboardingCompleted) return;
    if (gameStore.onboardingStep === 0 && !catDialogStore.visible) {
      catDialogStore.showOnboardingStep(0, gameStore.language);
    }
  }, [locale]);

  useEffect(() => {
    const disposePan = reaction(
      () => ({
        step: gameStore.onboardingStep,
        done: gameStore.onboardingCompleted,
        book: bookUiStore.isOverlayActive || bookUiStore.isOpen,
        quiz: quizUiStore.isActive,
      }),
      ({ step, done, book, quiz }) => {
        sceneUiStore.panBlocked =
          shouldBlockPan(step, done) || book || quiz;
      },
      { fireImmediately: true },
    );

    const disposeDialog = reaction(
      () => catDialogStore.visible,
      (visible, prevVisible) => {
        if (prevVisible && !visible) {
          gameStore.onOnboardingDialogDismissed();
        }
      },
    );

    return () => {
      disposePan();
      disposeDialog();
    };
  }, []);
}
