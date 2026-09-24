import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';

import { getCompanionPetPoseUrl } from '../../config/assetRegistry';
import { petBubbleVisibleMs, pickPetClickLine } from '../../data/petDialogs';
import { getPetById, type PetId } from '../../data/pets';
import { resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { gameStore } from '../../store/GameStore';
import { catDialogStore } from '../../store/catDialogStore';
import { sceneUiStore } from '../../store/sceneUiStore';

/** Компаньон у кота (лавка Яги, draft §6): клик — реплика питомца, без монет. */
export const PetLayer = observer(function PetLayer() {
  const { locale } = useLocale();
  const petId = gameStore.equippedPetId as PetId | null;
  const pet = petId ? getPetById(petId) : undefined;

  const pose = sceneUiStore.catSleeping ? 'sleep' : 'sid';
  const spriteUrl = petId ? getCompanionPetPoseUrl(petId, pose) : null;
  const visualPose = pose === 'sid' ? 'sit' : pose;
  const novelOpen =
    catDialogStore.visible && catDialogStore.currentLine?.mode === 'novel';
  const petInteractive = Boolean(petId && pet) && !novelOpen;

  const bubble =
    petId && sceneUiStore.petBubble?.petId === petId
      ? sceneUiStore.petBubble
      : null;

  const handleClick = useCallback(() => {
    if (!petId || !petInteractive) return;
    if (gameStore.handleZhirdyayBlockedInteraction()) return;

    if (sceneUiStore.catSleepReason !== 'tired') {
      sceneUiStore.registerActivity();
    }

    const lastLine = sceneUiStore.lastPetClickLine[petId];
    const text = pickPetClickLine(petId, locale, lastLine);
    if (!text) return;

    sceneUiStore.rememberPetClickLine(petId, text);
    sceneUiStore.showPetBubble(petId, text);
  }, [locale, petId, petInteractive]);

  useEffect(() => {
    if (!bubble?.text) return;
    const timer = setTimeout(
      () => sceneUiStore.clearPetBubble(),
      petBubbleVisibleMs(bubble.text),
    );
    return () => clearTimeout(timer);
  }, [bubble?.text]);

  if (!petId || !pet) return null;

  const className = [
    'scene-pet',
    pet.sceneClassName,
    `scene-pet--${visualPose}`,
    spriteUrl ? 'scene-pet--sprite' : '',
    petInteractive ? 'scene-pet--interactive' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const petName = resolveText(pet.name, locale);

  return (
    <div
      className={className}
      role={petInteractive ? 'button' : undefined}
      tabIndex={petInteractive ? 0 : undefined}
      aria-label={petName}
      onClick={petInteractive ? handleClick : undefined}
      onKeyDown={
        petInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
              }
            }
          : undefined
      }
    >
      {bubble && (
        <div
          className="scene-pet-bubble cat-footnote"
          role="status"
          aria-live="polite"
        >
          <span className="scene-pet-bubble__name">{petName}</span>
          <span className="scene-pet-bubble__text">{bubble.text}</span>
        </div>
      )}
      {spriteUrl && (
        <img className="scene-pet__img" src={spriteUrl} alt="" draggable={false} />
      )}
    </div>
  );
});
