import type { Grade } from '../domain/grade';
import type { SpiritId } from '../config/assetRegistry';
import type { LocalizedText } from '../i18n/types';

const L = (ru: string, en: string, tr: string): LocalizedText => ({ ru, en, tr });

export const izbaEffects = [
  {
    id: 'thunder_izba',
    name: L('Грозовая изба', 'Thunder Hut', 'Gök Gürültülü İzba'),
    description: L(
      'Мягкое затемнение избы и редкие заметные вспышки молнии — без страха и без смены стен.',
      'Soft hut dimming and occasional visible lightning flashes — no fear and no wall skin change.',
      'Kulübede hafif karartma ve ara sıra görünür şimşek — korku yok, duvar skini değişmez.',
    ),
    grade: 'epoch' as Grade,
    source: { kind: 'spirit_victory' as const, spiritId: 'perun' as SpiritId },
    sceneClassName: 'izba-scene--effect-thunder',
  },
] as const;

export type IzbaEffectId = (typeof izbaEffects)[number]['id'];

export interface IzbaEffectDefinition {
  id: IzbaEffectId;
  name: LocalizedText;
  description: LocalizedText;
  grade: Grade;
  source: { kind: 'spirit_victory'; spiritId: SpiritId };
  sceneClassName: string;
}

export function getIzbaEffectById(id: string): IzbaEffectDefinition | undefined {
  return izbaEffects.find((e) => e.id === id);
}

export function resolveIzbaEffectName(id: IzbaEffectId, locale: import('../i18n/types').Locale): string {
  const effect = getIzbaEffectById(id);
  if (!effect) return id;
  return effect.name[locale] ?? effect.name.ru;
}
