import { useEffect, useRef } from 'react';
import { pickCatLine } from '../../data/catDialogs';
import { shouldShowChestReadyFootnote } from '../../domain/retention';
import { gameStore } from '../../store/GameStore';
import { catDialogStore } from '../../store/catDialogStore';
import { settingsUiStore } from '../../store/settingsUiStore';

/** Сноска «сундук готов» при входе + refresh auth для баннера облака */
export function useRetentionBootstrap(): void {
  const chestReadyShown = useRef(false);

  useEffect(() => {
    void settingsUiStore.refreshAuth();
  }, []);

  useEffect(() => {
    if (chestReadyShown.current) return;
    if (catDialogStore.visible) return;

    if (
      !shouldShowChestReadyFootnote(
        gameStore.onboardingCompleted,
        gameStore.isChestVisible(),
        gameStore.isChestReady(),
      )
    ) {
      return;
    }

    chestReadyShown.current = true;
    const line = pickCatLine('chest_ready', gameStore.language);
    if (!line) return;

    catDialogStore.show([
      { text: line, mode: 'footnote', tag: 'chest_ready' },
    ]);
  }, []);
}
