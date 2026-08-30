/**
 * Игровые константы — дефолты баланса.
 * Канон: instruction/dev/technical_requirements.md §6
 */

export const SAVE_VERSION = 1;
export const LOCAL_SAVE_KEY = 'slavic_myths_save_v1';
export const CLOUD_SAVE_KEY = 'gameSave';

export const PERSIST_DEBOUNCE_MS = 2500;

/** Энергия */
export const START_ENERGY = 100;
export const START_MAX_ENERGY = 100;
export const ENERGY_PER_CLICK = 1;
export const ENERGY_PER_QUEST = 10;
export const ENERGY_REGEN_PER_MINUTE = 1;
export const ONBOARDING_ENERGY_FLOOR = 20;

/** Монеты удачи */
export const LUCK_COINS_CAP = 200;
export const LUCK_COINS_CAP_KOSCHEI_BONUS = 20;
export const LUCK_COINS_PER_CLICK = 1;

/** Обереги */
export const START_TALISMANS = 3;

/** Кот */
export const CAT_SLEEP_MIN_MS = 45_000;
export const CAT_SLEEP_MAX_MS = 60_000;
/** Сноска над головой кота каждые N кликов */
export const CAT_CLICK_FOOTNOTE_EVERY = 5;

/** Локаль UI */
export const LOCALE_STORAGE_KEY = 'slavic_myths_locale';

/** Сундук */
export const CHEST_COOLDOWN_HOURS = 3;
export const CHEST_REWARDED_SKIP_MINUTES = 30;
export const SPARE_CHEST_KEYS_CAP = 3;

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
} as const;
