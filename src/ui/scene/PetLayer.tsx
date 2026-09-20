import { observer } from 'mobx-react-lite';

import { getCompanionPetPoseUrl } from '../../config/assetRegistry';
import { getPetById } from '../../data/pets';
import { resolveText } from '../../i18n/resolve';
import { useLocale } from '../../i18n/LocaleContext';
import { gameStore } from '../../store/GameStore';
import { sceneUiStore } from '../../store/sceneUiStore';

/** Некликабельный питомец у кота (draft §6). PNG из `companionPetSprites` или CSS-силуэт. */
export const PetLayer = observer(function PetLayer() {
  const { locale } = useLocale();
  const petId = gameStore.equippedPetId;
  if (!petId) return null;

  const pet = getPetById(petId);
  if (!pet) return null;

  const pose = sceneUiStore.catSleeping ? 'sleep' : 'sid';
  const spriteUrl = getCompanionPetPoseUrl(petId, pose);
  const visualPose = pose === 'sid' ? 'sit' : pose;
  const className = `scene-pet ${pet.sceneClassName} scene-pet--${visualPose}${spriteUrl ? ' scene-pet--sprite' : ''}`;

  return (
    <div className={className} aria-hidden title={resolveText(pet.name, locale)}>
      {spriteUrl && (
        <img className="scene-pet__img" src={spriteUrl} alt="" draggable={false} />
      )}
    </div>
  );
});
