import type { Locale } from '../i18n/types';
import { resolveLines } from '../i18n/resolve';
import { izbaItemDialogBanks } from '../data/dialogContent';

export type IzbaItemId = 'stove' | 'bench' | 'window' | 'domovoy';

export interface IzbaItemPickState {
  lastTag: IzbaItemId | null;
  lastLineIndex: number;
}

export function pickIzbaItemLine(
  itemId: IzbaItemId,
  locale: Locale,
  state: IzbaItemPickState,
  rng: () => number = Math.random,
): { text: string; nextState: IzbaItemPickState } {
  const lines = resolveLines(izbaItemDialogBanks[itemId], locale);
  if (lines.length === 0) {
    return { text: '', nextState: state };
  }

  let startIndex = 0;
  if (state.lastTag === itemId && lines.length > 1) {
    startIndex = (state.lastLineIndex + 1) % lines.length;
  }

  const offset = Math.floor(rng() * lines.length);
  const index = (startIndex + offset) % lines.length;
  const text = lines[index];

  return {
    text,
    nextState: { lastTag: itemId, lastLineIndex: index },
  };
}
