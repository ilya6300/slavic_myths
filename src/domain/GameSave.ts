/**
 * Снимок сохранения — единственная схема persist.
 * Канон: instruction/scenario_draft.md §2.1 + дыры из плана Epic 0.
 */

import {
  LOCAL_SAVE_KEY,
  ONBOARDING_ENERGY_FLOOR,
  SAVE_VERSION,
  START_ENERGY,
  START_MAX_ENERGY,
  START_TALISMANS,
} from '../config/gameConstants';
import {
  DEFAULT_BROWNIE_SKIN,
  DEFAULT_CAT_SKIN_ID,
  DEFAULT_HOUSE_SKIN,
  DEFAULT_VIEW_SKIN,
} from '../config/assetRegistry';
import type { Locale } from '../i18n/types';
import { DEFAULT_LOCALE } from '../i18n/types';

export type SpiritStatus = 'available' | 'defeated' | 'locked';

export interface GameSkins {
  cat: string;
  domovoy: string;
  izba: string;
  window: string;
}

export interface GameSave {
  version: number;
  savedAt: number;

  onboardingStep: number;
  onboardingCompleted: boolean;
  isFirstLaunch: boolean;
  firstChestOpened: boolean;

  energy: number;
  maxEnergy: number;
  lastEnergyAt: number;
  luckCoins: number;
  talismans: number;
  titleId: string | null;

  spiritStatuses: Record<string, SpiritStatus>;
  fragmentCounts: Record<string, number>;
  selectedFragmentSpiritId: string | null;
  skins: GameSkins;
  ownedSkinIds: string[];
  ownedTitleIds: string[];
  trophiesUnlocked: string[];

  chestReadyAt: number | null;
  spareChestKeys: number;
  wonderChestWeekSlotUsed: boolean;
  wonderChestClickProgress: number;
  wonderChestPityCounter: number;
  wonderChestWeekId: string | null;

  /** Разовый бонус фрагмента за победу rare+ духов */
  fragmentVictoryBonusGranted: string[];

  /** Баннер «Сохраним в облаке?» закрыт игроком */
  cloudBannerDismissed: boolean;

  susedkoStealActive: boolean;
  /** Timestamp последнего старта кражи Суседко (кулдаун 30 мин) */
  lastSusedkoStealAt: number | null;
  zhirdyaySeenThisNight: boolean;
  nightId: string | null;
  zhirdyayActive: boolean;
  zhirdyayClickProgress: number;
  zhirdyayClicksRequired: number;

  language: Locale;
  catClickCount: number;

  totalPlaySeconds?: number;

  /** Бонусы наград духов §5.5 */
  energyRegenBonusPercent?: number;
  poludnicaCoinBonusPercent?: number;
  rusalkaZhirdyayReductionPercent?: number;
  luckCoinsCapBonus?: number;
}

/** Локальная «ночь» для сброса Жирдяя: дата рассвета 06:00 */
export function getNightId(date: Date = new Date()): string {
  const d = new Date(date);
  if (d.getHours() < 6) {
    d.setDate(d.getDate() - 1);
  }
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function createDefaultSpiritStatuses(): Record<string, SpiritStatus> {
  return {
    brownie: 'available',
    susedko: 'locked',
    bannik: 'locked',
    kikimora: 'locked',
    poludnik: 'locked',
    ovinnik: 'locked',
    leshiy: 'locked',
    vodyanoy: 'locked',
    dedushka_toptygin: 'locked',
    poludnica: 'locked',
    rusalka: 'locked',
    lada: 'locked',
    veles: 'locked',
    baba_yaga: 'locked',
    koschei_immortal: 'locked',
    chudo_yudo: 'locked',
  };
}

export function createDefaultSave(now: number = Date.now()): GameSave {
  return {
    version: SAVE_VERSION,
    savedAt: now,

    onboardingStep: 0,
    onboardingCompleted: false,
    isFirstLaunch: true,
    firstChestOpened: false,

    energy: START_ENERGY,
    maxEnergy: START_MAX_ENERGY,
    lastEnergyAt: now,
    luckCoins: 0,
    talismans: START_TALISMANS,
    titleId: 'novenkiy',

    spiritStatuses: createDefaultSpiritStatuses(),
    fragmentCounts: {},
    selectedFragmentSpiritId: null,
    skins: {
      cat: DEFAULT_CAT_SKIN_ID,
      domovoy: DEFAULT_BROWNIE_SKIN,
      izba: DEFAULT_HOUSE_SKIN,
      window: DEFAULT_VIEW_SKIN,
    },
    ownedSkinIds: [DEFAULT_CAT_SKIN_ID],
    ownedTitleIds: ['novenkiy'],
    trophiesUnlocked: [],

    chestReadyAt: null,
    spareChestKeys: 0,
    wonderChestWeekSlotUsed: false,
    wonderChestClickProgress: 0,
    wonderChestPityCounter: 0,
    wonderChestWeekId: null,

    fragmentVictoryBonusGranted: [],

    cloudBannerDismissed: false,

    susedkoStealActive: false,
    lastSusedkoStealAt: null,
    zhirdyaySeenThisNight: false,
    nightId: getNightId(new Date(now)),
    zhirdyayActive: false,
    zhirdyayClickProgress: 0,
    zhirdyayClicksRequired: 0,

    language: DEFAULT_LOCALE,
    catClickCount: 0,

    totalPlaySeconds: 0,

    energyRegenBonusPercent: 0,
    poludnicaCoinBonusPercent: 0,
    rusalkaZhirdyayReductionPercent: 0,
    luckCoinsCapBonus: 0,
  };
}

/** Минимальный floor энергии в онбординге */
export function onboardingEnergyFloor(onboardingCompleted: boolean): number {
  return onboardingCompleted ? 0 : ONBOARDING_ENERGY_FLOOR;
}

export { LOCAL_SAVE_KEY };
