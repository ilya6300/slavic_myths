/**
 * Духи бестиария — зеркало instruction/list_of_spirits.md
 * Награды §5.5 scenario.md — типы, не хардкод в UI.
 */

import type { SpiritId } from '../config/assetRegistry';
import type { Grade } from '../domain/grade';
import type { Locale, LocalizedText } from '../i18n/types';
import { resolveText } from '../i18n/resolve';
import { spiritCopy } from './spiritCopy';

export type QuizLocationId =
  | 'izba'
  | 'banya'
  | 'les'
  | 'pole'
  | 'voda'
  | 'temnyy_les';

export type SpiritChapter = 'dom' | 'dvor' | 'les' | 'epoch';

export type SpiritUnlockKind =
  | 'start'
  | 'after_spirit'
  | 'chest_key'
  | 'fragments';

export interface SpiritUnlock {
  kind: SpiritUnlockKind;
  /** id духа-предшественника или целевого духа для ключей/фрагментов */
  targetId?: SpiritId;
  fragmentCount?: number;
}

export type SpiritRewardKind =
  | 'domovoy_on_scene'
  | 'chest_appears'
  | 'max_energy'
  | 'obereg'
  | 'title_and_energy'
  | 'reward_energy'
  | 'regen_percent'
  | 'title_only'
  | 'title_and_skin'
  | 'skin_only'
  | 'luck_cap_and_title'
  | 'day_coin_bonus'
  | 'night_zhirdyay_reduction'
  | 'atmosphere_only';

export interface SpiritReward {
  kind: SpiritRewardKind;
  /** Для title_* наград */
  titleId?: string;
  amount?: number;
  percent?: number;
  skinId?: string;
  effectId?: import('./izbaEffects').IzbaEffectId;
}

export interface SpiritDefinition {
  id: SpiritId;
  name: LocalizedText;
  grade: Grade;
  chapter: SpiritChapter;
  unlock: SpiritUnlock;
  locationId: QuizLocationId;
  bookDescription: LocalizedText;
  bookRewardDescription: LocalizedText;
  loseMessage: LocalizedText;
  trophyDescription: LocalizedText;
  miniTale: LocalizedText;
  /** Пустая строка — трофея нет (Домовой) */
  hasTrophy: boolean;
  reward: SpiritReward;
  lockedHint: LocalizedText;
}

export const SPIRIT_ORDER: SpiritId[] = [
  'brownie',
  'susedko',
  'bannik',
  'kikimora',
  'poludnik',
  'ovinnik',
  'leshiy',
  'vodyanoy',
  'dedushka_toptygin',
  'poludnica',
  'rusalka',
  'baba_yaga',
  'lada',
  'veles',
  'koschei_immortal',
  'chudo_yudo',
  'yarilo',
  'perun',
];

export const spirits: SpiritDefinition[] = [
  {
    id: 'brownie',
    ...spiritCopy.brownie,
    grade: 'common',
    chapter: 'dom',
    unlock: { kind: 'start' },
    locationId: 'izba',
    hasTrophy: false,
    reward: { kind: 'domovoy_on_scene' },
  },
  {
    id: 'susedko',
    ...spiritCopy.susedko,
    grade: 'common',
    chapter: 'dom',
    unlock: { kind: 'after_spirit', targetId: 'brownie' },
    locationId: 'izba',
    hasTrophy: true,
    reward: { kind: 'chest_appears' },
  },
  {
    id: 'bannik',
    ...spiritCopy.bannik,
    grade: 'common',
    chapter: 'dom',
    unlock: { kind: 'after_spirit', targetId: 'susedko' },
    locationId: 'banya',
    hasTrophy: true,
    reward: { kind: 'max_energy', amount: 5 },
  },
  {
    id: 'kikimora',
    ...spiritCopy.kikimora,
    grade: 'common',
    chapter: 'dom',
    unlock: { kind: 'after_spirit', targetId: 'bannik' },
    locationId: 'izba',
    hasTrophy: true,
    reward: { kind: 'obereg', amount: 1 },
  },
  {
    id: 'poludnik',
    ...spiritCopy.poludnik,
    grade: 'common',
    chapter: 'dvor',
    unlock: { kind: 'after_spirit', targetId: 'kikimora' },
    locationId: 'pole',
    hasTrophy: true,
    reward: { kind: 'title_and_energy', titleId: 'polevoy_kot', amount: 10 },
  },
  {
    id: 'ovinnik',
    ...spiritCopy.ovinnik,
    grade: 'common',
    chapter: 'dvor',
    unlock: { kind: 'after_spirit', targetId: 'poludnik' },
    locationId: 'pole',
    hasTrophy: true,
    reward: { kind: 'reward_energy', amount: 50 },
  },
  {
    id: 'leshiy',
    ...spiritCopy.leshiy,
    grade: 'rare',
    chapter: 'les',
    unlock: { kind: 'after_spirit', targetId: 'ovinnik' },
    locationId: 'les',
    hasTrophy: true,
    reward: { kind: 'regen_percent', percent: 5 },
  },
  {
    id: 'vodyanoy',
    ...spiritCopy.vodyanoy,
    grade: 'rare',
    chapter: 'les',
    unlock: { kind: 'after_spirit', targetId: 'leshiy' },
    locationId: 'voda',
    hasTrophy: true,
    reward: { kind: 'obereg', amount: 1 },
  },
  {
    id: 'dedushka_toptygin',
    ...spiritCopy.dedushka_toptygin,
    grade: 'rare',
    chapter: 'les',
    unlock: { kind: 'chest_key', targetId: 'dedushka_toptygin' },
    locationId: 'les',
    hasTrophy: true,
    reward: { kind: 'max_energy', amount: 10 },
  },
  {
    id: 'poludnica',
    ...spiritCopy.poludnica,
    grade: 'epic',
    chapter: 'dvor',
    unlock: { kind: 'chest_key', targetId: 'poludnica' },
    locationId: 'pole',
    hasTrophy: true,
    reward: { kind: 'max_energy', amount: 15 },
  },
  {
    id: 'rusalka',
    ...spiritCopy.rusalka,
    grade: 'epic',
    chapter: 'les',
    unlock: { kind: 'chest_key', targetId: 'rusalka' },
    locationId: 'voda',
    hasTrophy: true,
    reward: { kind: 'title_and_energy', titleId: 'kot_u_berega', amount: 10 },
  },
  {
    id: 'baba_yaga',
    ...spiritCopy.baba_yaga,
    grade: 'epoch',
    chapter: 'epoch',
    unlock: { kind: 'fragments', targetId: 'baba_yaga', fragmentCount: 3 },
    locationId: 'temnyy_les',
    hasTrophy: true,
    reward: {
      kind: 'title_and_skin',
      titleId: 'kogot_yagi',
      skinId: 'landscape_yaga',
    },
  },
  {
    id: 'lada',
    ...spiritCopy.lada,
    grade: 'epic',
    chapter: 'epoch',
    unlock: { kind: 'fragments', targetId: 'lada', fragmentCount: 3 },
    locationId: 'les',
    hasTrophy: true,
    reward: { kind: 'skin_only', skinId: 'hut_harmony' },
  },
  {
    id: 'veles',
    ...spiritCopy.veles,
    grade: 'epoch',
    chapter: 'epoch',
    unlock: { kind: 'fragments', targetId: 'veles', fragmentCount: 6 },
    locationId: 'les',
    hasTrophy: true,
    reward: { kind: 'title_only', titleId: 'lapa_velesa' },
  },
  {
    id: 'koschei_immortal',
    ...spiritCopy.koschei_immortal,
    grade: 'epoch',
    chapter: 'epoch',
    unlock: { kind: 'fragments', targetId: 'koschei_immortal', fragmentCount: 5 },
    locationId: 'temnyy_les',
    hasTrophy: true,
    reward: {
      kind: 'luck_cap_and_title',
      titleId: 'razgadchik_smerti',
      amount: 20,
    },
  },
  {
    id: 'chudo_yudo',
    ...spiritCopy.chudo_yudo,
    grade: 'epoch',
    chapter: 'epoch',
    unlock: { kind: 'fragments', targetId: 'chudo_yudo', fragmentCount: 8 },
    locationId: 'voda',
    hasTrophy: true,
    reward: { kind: 'title_only', titleId: 'slavyanskiy_geroy' },
  },
  {
    id: 'yarilo',
    ...spiritCopy.yarilo,
    grade: 'epoch',
    chapter: 'epoch',
    unlock: { kind: 'fragments', targetId: 'yarilo', fragmentCount: 8 },
    locationId: 'pole',
    hasTrophy: true,
    reward: { kind: 'title_only', titleId: 'khranitel_vesny' },
  },
  {
    id: 'perun',
    ...spiritCopy.perun,
    grade: 'epoch',
    chapter: 'epoch',
    unlock: { kind: 'fragments', targetId: 'perun', fragmentCount: 10 },
    locationId: 'les',
    hasTrophy: true,
    reward: { kind: 'atmosphere_only', effectId: 'thunder_izba' },
  },
];

export function getSpiritById(id: SpiritId): SpiritDefinition | undefined {
  return spirits.find((s) => s.id === id);
}

const CHAPTER_LABELS: Record<SpiritChapter, LocalizedText> = {
  dom: { ru: 'Дом', en: 'Home', tr: 'Ev' },
  dvor: { ru: 'Двор', en: 'Yard', tr: 'Avlu' },
  les: { ru: 'Лес', en: 'Forest', tr: 'Orman' },
  epoch: { ru: 'Эпоха чудес', en: 'Age of Wonders', tr: 'Mucizeler Çağı' },
};

export function getChapterLabel(chapter: SpiritChapter, locale: Locale): string {
  return resolveText(CHAPTER_LABELS[chapter], locale);
}
