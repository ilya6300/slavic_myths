import type { Grade } from '../domain/grade';
import type { SpiritId } from '../config/assetRegistry';
import type { LocalizedText } from '../i18n/types';

const L = (ru: string, en: string, tr: string): LocalizedText => ({ ru, en, tr });

type IzbaEffectSource =
  | { kind: 'spirit_victory'; spiritId: SpiritId }
  | { kind: 'yaga_shop' };

export interface IzbaEffectDefinition {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  grade: Grade;
  source: IzbaEffectSource;
  sceneClassName: string;
}

export const izbaEffects: IzbaEffectDefinition[] = [
  {
    id: 'thunder_izba',
    name: L('Грозовая изба', 'Thunder Hut', 'Gök Gürültülü İzba'),
    description: L(
      'Мягкое затемнение избы и редкие заметные вспышки молнии — без страха и без смены стен.',
      'Soft hut dimming and occasional visible lightning flashes — no fear and no wall skin change.',
      'Kulübede hafif karartma ve ara sıra görünür şimşek — korku yok, duvar skini değişmez.',
    ),
    grade: 'epoch',
    source: { kind: 'spirit_victory', spiritId: 'perun' },
    sceneClassName: 'izba-scene--effect-thunder',
  },
  {
    id: 'shop_fog',
    name: L('Туман', 'Fog', 'Sis'),
    description: L(
      'Лёгкая дымка по полу избы, не меняя стен.',
      'Light floor mist in the hut, walls unchanged.',
      'Kulübe zeminde hafif sis, duvarlar aynı.',
    ),
    grade: 'epoch',
    source: { kind: 'yaga_shop' },
    sceneClassName: 'izba-scene--effect-fog',
  },
  {
    id: 'shop_firefly',
    name: L('Огонёк', 'Firefly', 'Ateş Böceği'),
    description: L(
      'Тёплые точки света у печи и окна.',
      'Warm points of light by stove and window.',
      'Ocak ve pencerede sıcak ışık noktaları.',
    ),
    grade: 'epoch',
    source: { kind: 'yaga_shop' },
    sceneClassName: 'izba-scene--effect-firefly',
  },
  {
    id: 'shop_ball_lightning',
    name: L('Шаровая молния', 'Ball lightning', 'Küre şimşek'),
    description: L(
      'Мягкое свечение шара без удара и страха.',
      'Soft orb glow without strike or fear.',
      'Vuruş ve korku olmadan yumuşak küre parıltısı.',
    ),
    grade: 'epoch',
    source: { kind: 'yaga_shop' },
    sceneClassName: 'izba-scene--effect-ball-lightning',
  },
  {
    id: 'shop_stars',
    name: L('Звёздное небо', 'Starry sky', 'Yıldızlı gökyüzü'),
    description: L(
      'Редкие звёзды в верхней части комнаты.',
      'Sparse stars in the upper room.',
      'Odanın üst kısmında seyrek yıldızlar.',
    ),
    grade: 'epoch',
    source: { kind: 'yaga_shop' },
    sceneClassName: 'izba-scene--effect-stars',
  },
];

export type IzbaEffectId = (typeof izbaEffects)[number]['id'];

export function getIzbaEffectById(id: string): IzbaEffectDefinition | undefined {
  return izbaEffects.find((e) => e.id === id);
}

export function resolveIzbaEffectName(
  id: IzbaEffectId,
  locale: import('../i18n/types').Locale,
): string {
  const effect = getIzbaEffectById(id);
  if (!effect) return id;
  return effect.name[locale] ?? effect.name.ru;
}
