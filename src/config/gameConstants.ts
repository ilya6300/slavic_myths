/**
 * Игровые константы — дефолты баланса.
 * Канон: instruction/dev/technical_requirements.md §6
 */

export const SAVE_VERSION = 12;

export const STARTER_PACK_PRICE_RUB = 199;
export const STARTER_PACK_ENERGY_BONUS = 100;
export const STARTER_PACK_OBEREG_BONUS = 5;
export const STARTER_PACK_CAT_SKIN_ID = 'cat_pilgrim';
export const LOCAL_SAVE_KEY = 'slavic_myths_save_v1';
export const CLOUD_SAVE_KEY = 'gameSave';

export const PERSIST_DEBOUNCE_MS = 2500;

/** Энергия */
export const START_ENERGY = 120;
export const START_MAX_ENERGY = 120;
export const ENERGY_PER_CLICK = 1;
export const ENERGY_PER_QUEST = 10;
/** Энергия за «сметану» в сундуке / у Овинника (plan: прямая награда). */
export const CHEST_ENERGY_BONUS = 50;
export const CHEST_ENERGY_X2_BONUS = 100;
/** Реклама за энергию при 0 (plan Epic 6). */
export const REWARDED_ENERGY_BONUS = 50;
export const ENERGY_REGEN_PER_MINUTE = 1.2;
/** Награда daily-find монетки на сцене (plan §3.1). */
export const DAILY_FIND_ENERGY = 10;
export const ONBOARDING_ENERGY_FLOOR = 20;

/** Монеты удачи */
export const LUCK_COINS_CAP = 200;
export const LUCK_COINS_CAP_KOSCHEI_BONUS = 20;
export const LUCK_COINS_PER_CLICK = 1;
/** +0.05% к весу rare/epic/epoch за 1 монету удачи в обычном сундуке */
export const LUCK_COIN_GRADE_WEIGHT_BONUS_PER_COIN = 0.0005;

/** Обереги */
export const START_TALISMANS = 3;

/** Кот */
export const CAT_SLEEP_MIN_MS = 45_000;
export const CAT_SLEEP_MAX_MS = 60_000;
/** Сноска над головой кота каждые N кликов */
export const CAT_CLICK_FOOTNOTE_EVERY = 5;

/** Локаль UI */
export const LOCALE_STORAGE_KEY = 'slavic_myths_locale';

export const SPARE_CHEST_KEYS_CAP = 3;

/** Сундук */
export const CHEST_COOLDOWN_HOURS = 3;
export const CHEST_REWARDED_SKIP_MINUTES = 30;
/** Ночь (локальное время) */
export const NIGHT_START_HOUR = 20;
export const NIGHT_END_HOUR = 6;

/** Суседко-вор */
export const SUSEDKO_STEAL_WARNING_MS = 5_000;
export const SUSEDKO_STEAL_START_DELAY_MS = 5_000;
export const SUSEDKO_STEAL_COIN_INTERVAL_MS = 3_000;
export const SUSEDKO_STEAL_STOP_LOSS_COINS = 15;
export const SUSEDKO_STEAL_COOLDOWN_MS = 30 * 60 * 1000;
export const SUSEDKO_CLICKS_TO_FLEE = 5;

/** Жирдяй */
export const ZHIRDYAY_CLICKS_MIN = 8;
export const ZHIRDYAY_CLICKS_MAX = 12;

/** Полудница — дневной бонус монет */
export const POLUDNICA_BONUS_START_HOUR = 11;
export const POLUDNICA_BONUS_END_HOUR = 15;
export const POLUDNICA_COIN_BONUS_PERCENT = 10;

/** Русалка — снижение шанса Жирдяя */
export const RUSALKA_ZHIRDYAY_REDUCTION_PERCENT = 20;

/** Домовой — бонус удачи по грейду скина (%) */
export const BROWNIE_LUCK_BY_SKIN_GRADE: Record<string, number> = {
  common: 1,
  rare: 2,
  epic: 3,
  epoch: 5,
};

export const appConfig = {
  isTestMode: import.meta.env.VITE_TEST_MODE === 'true',
  /** DEV: выход на двор ночью (прод: блок по nightTime). */
  debugAllowStreetAtNight: import.meta.env.DEV,
} as const;
