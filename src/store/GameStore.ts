import { makeAutoObservable } from 'mobx';
import type { SpiritId } from '../config/assetRegistry';
import {
  ENERGY_PER_CLICK,
  ENERGY_PER_QUEST,
  DAILY_FIND_ENERGY,
  LUCK_COINS_CAP,
  LUCK_COINS_PER_CLICK,
  REWARDED_ENERGY_BONUS,
  CLOUD_SAVE_KEY,
} from '../config/gameConstants';
import {
  applyRewardedSkip,
  chestReadyAtAfterOpen,
  getChestCooldownRemainingMs,
  isChestReady,
} from '../domain/chestCooldown';
import { applyChestLoot, rollRegularChestLoot, type ChestLootPatch } from '../domain/chestLoot';
import {
  resolveCatClickDialog,
  type CatClickDialogResult,
} from '../domain/catClick';
import { applyEnergyRegen } from '../domain/energyRegen';
import { addRewardEnergy } from '../domain/rewardEnergy';
import {
  isChestOpenable,
  shouldConsumeSpareKeyOnOpen,
} from '../domain/spareChestKey';
import {
  applySpiritReward,
  createRewardStateFromStore,
} from '../domain/applySpiritReward';
import {
  createDefaultSave,
  onboardingEnergyFloor,
  type GameSave,
  type SpiritStatus,
} from '../domain/GameSave';
import { applyDefeatAndUnlock, applyFragmentUnlocks } from '../domain/spiritQueue';
import {
  applyMiracleChestLoot,
  rollMiracleChestLoot,
} from '../domain/miracleChestLoot';
import {
  canOpenWonderChest as canOpenWonderChestDomain,
  isWonderChestEligible,
  shouldIncrementWonderClickProgress,
  syncWonderChestWeekState,
  wonderChestClicksRequired,
} from '../domain/wonderChest';
import { shouldShowCloudBanner } from '../domain/retention';
import { isDailyFindAvailable as isDailyFindAvailableDomain } from '../domain/dailyFind';
import { getCalendarDayId } from '../domain/calendarDay';
import {
  pickIzbaItemLine,
  type IzbaItemId,
} from '../domain/izbaItemDialog';
import { rollZhirdyayClicksRequired } from '../domain/zhirdyay';
import { getNightId } from '../domain/GameSave';
import { isDefaultOwnedSkin } from '../data/profileCatalog';
import { detectBrowserLocale } from '../i18n/resolve';
import type { Locale } from '../i18n/types';
import { LOCALES } from '../i18n/types';
import { pickCatLine } from '../data/catDialogs';
import { getSpiritById } from '../data/spirits';
import { getQuizBySpiritId, shuffleQuizQuestions } from '../data/quiz';
import { miracleChest, fragmentVictoryBonusSpiritIds } from '../config/lootTables';
import {
  DEFAULT_VIEW_SKIN,
  viewSkins,
  type ViewSkinId,
} from '../config/assetRegistry';
import { adsService } from '../services/adsService';
import { clearLocalSave } from '../services/localSave';
import { saveService } from '../services/saveService';
import { getPlatformSdk, isAuthorized } from '../platform/platformService';
import { catDialogStore } from './catDialogStore';
import { bookUiStore } from './bookUiStore';
import { chestUiStore } from './chestUiStore';
import { energyUiStore } from './energyUiStore';
import { eventUiStore } from './eventUiStore';
import { profileUiStore } from './profileUiStore';
import { quizUiStore } from './quizUiStore';
import { sceneUiStore } from './sceneUiStore';

import { LOCALE_STORAGE_KEY } from '../config/gameConstants';

function readStoredLocale(): Locale | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (raw && (LOCALES as readonly string[]).includes(raw)) {
    return raw as Locale;
  }
  return null;
}

function applyDocumentLang(locale: Locale): void {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale;
  }
}

function sanitizeWindowSkinId(id: string): ViewSkinId {
  return id in viewSkins ? (id as ViewSkinId) : DEFAULT_VIEW_SKIN;
}

export class GameStore {
  version = 1;
  savedAt = Date.now();

  onboardingStep = 0;
  onboardingCompleted = false;
  isFirstLaunch = true;
  firstChestOpened = false;

  energy = 100;
  maxEnergy = 100;
  lastEnergyAt = Date.now();
  luckCoins = 0;
  talismans = 3;
  titleId: string | null = 'novenkiy';

  spiritStatuses: Record<string, SpiritStatus> = {};
  fragmentCounts: Record<string, number> = {};
  selectedFragmentSpiritId: string | null = null;
  skins = { cat: 'cat_standart', domovoy: 'brownie_standart', izba: 'hut_standart', window: 'landscape_standart' };
  ownedSkinIds: string[] = [];
  ownedTitleIds: string[] = [];
  trophiesUnlocked: string[] = [];

  chestReadyAt: number | null = null;
  spareChestKeys = 0;
  wonderChestWeekSlotUsed = false;
  wonderChestClickProgress = 0;
  wonderChestPityCounter = 0;
  wonderChestWeekId: string | null = null;
  fragmentVictoryBonusGranted: string[] = [];
  cloudBannerDismissed = false;
  illustrationRevealed: string[] = [];
  dailyFindClaimedDayId: string | null = null;
  folktaleIntroShown = false;

  izbaItemDialogState: { lastTag: IzbaItemId | null; lastLineIndex: number } = {
    lastTag: null,
    lastLineIndex: 0,
  };

  susedkoStealActive = false;
  lastSusedkoStealAt: number | null = null;
  zhirdyaySeenThisNight = false;
  nightId: string | null = null;
  zhirdyayActive = false;
  zhirdyayClickProgress = 0;
  zhirdyayClicksRequired = 0;

  language: Locale = readStoredLocale() ?? detectBrowserLocale();
  catClickCount = 0;
  lastCatBubble: CatClickDialogResult | null = null;

  totalPlaySeconds = 0;

  energyRegenBonusPercent = 0;
  poludnicaCoinBonusPercent = 0;
  rusalkaZhirdyayReductionPercent = 0;
  luckCoinsCapBonus = 0;

  constructor() {
    makeAutoObservable(this);
    applyDocumentLang(this.language);
    saveService.bind(() => this.toSave());
  }

  get isOnboarding(): boolean {
    return !this.onboardingCompleted;
  }

  get luckCoinsCap(): number {
    return LUCK_COINS_CAP + this.luckCoinsCapBonus;
  }

  get isZhirdyayBlocking(): boolean {
    return this.zhirdyayActive;
  }

  handleZhirdyayBlockedInteraction(
    rng: () => number = Math.random,
  ): boolean {
    if (!this.zhirdyayActive) return false;

    const text = pickCatLine('afraid_night', this.language, rng);
    this.lastCatBubble = text ? { kind: 'bubble', text } : null;
    return true;
  }

  isBrownieOnScene(): boolean {
    return this.spiritStatuses.brownie === 'defeated';
  }

  isChestVisible(): boolean {
    return (
      this.spiritStatuses.susedko === 'defeated' || this.firstChestOpened
    );
  }

  isChestReady(now: number = Date.now()): boolean {
    if (!this.isChestVisible()) return false;
    return isChestOpenable(
      this.firstChestOpened,
      this.chestReadyAt,
      this.spareChestKeys,
      now,
    );
  }

  getChestCooldownRemainingMs(now: number = Date.now()): number {
    return getChestCooldownRemainingMs(
      this.firstChestOpened,
      this.chestReadyAt,
      now,
    );
  }

  isWonderChestVisible(): boolean {
    return isWonderChestEligible(this.spiritStatuses);
  }

  canOpenWonderChest(): boolean {
    if (!this.isWonderChestVisible()) return false;
    return canOpenWonderChestDomain(
      this.wonderChestWeekSlotUsed,
      this.wonderChestClickProgress,
    );
  }

  getWonderChestClickProgress(): number {
    return this.wonderChestClickProgress;
  }

  getWonderChestClicksRequired(): number {
    return wonderChestClicksRequired();
  }

  isWonderChestFreeThisWeek(): boolean {
    return !this.wonderChestWeekSlotUsed;
  }

  isCloudBannerVisible(isAuthorizedNow: boolean): boolean {
    return shouldShowCloudBanner(
      this.firstChestOpened,
      this.cloudBannerDismissed,
      isAuthorizedNow,
    );
  }

  dismissCloudBanner(): void {
    this.cloudBannerDismissed = true;
    saveService.schedulePersist();
  }

  async resetProgress(): Promise<void> {
    await saveService.flushPersist();
    clearLocalSave();

    try {
      if (await isAuthorized()) {
        const player = await getPlatformSdk().getPlayer();
        await player.setData({ [CLOUD_SAVE_KEY]: createDefaultSave() }, true);
      }
    } catch {
      // offline / mock
    }

    this.hydrate(createDefaultSave());
    this.resetUiAfterProgressReset();
    saveService.schedulePersist();
  }

  private resetUiAfterProgressReset(): void {
    chestUiStore.close();
    bookUiStore.close();
    quizUiStore.close();
    profileUiStore.close();
    catDialogStore.dismiss();
    sceneUiStore.activeRoom = 1;
    sceneUiStore.catSleeping = false;
    sceneUiStore.panBlocked = false;
    sceneUiStore.registerActivity();
    eventUiStore.resetSusedkoSteal();
    this.lastCatBubble = null;
  }

  isOnboardingFreeQuest(spiritId: SpiritId): boolean {
    if (!this.isOnboarding) return false;
    return spiritId === 'brownie' || spiritId === 'susedko';
  }

  hydrate(save: GameSave): void {
    this.version = save.version;
    this.savedAt = save.savedAt;

    this.onboardingStep = save.onboardingStep;
    this.onboardingCompleted = save.onboardingCompleted;
    this.isFirstLaunch = save.isFirstLaunch;
    this.firstChestOpened = save.firstChestOpened;

    this.energy = save.energy;
    this.maxEnergy = save.maxEnergy;
    this.lastEnergyAt = save.lastEnergyAt;
    this.luckCoins = save.luckCoins;
    this.talismans = save.talismans;
    this.titleId = save.titleId;

    this.spiritStatuses = { ...save.spiritStatuses };
    this.fragmentCounts = { ...save.fragmentCounts };
    this.selectedFragmentSpiritId = save.selectedFragmentSpiritId;
    this.skins = {
      ...save.skins,
      window: sanitizeWindowSkinId(save.skins.window),
    };
    this.ownedSkinIds = [...save.ownedSkinIds];
    this.ownedTitleIds = [...save.ownedTitleIds];
    this.trophiesUnlocked = [...save.trophiesUnlocked];

    this.chestReadyAt = save.chestReadyAt;
    this.spareChestKeys = save.spareChestKeys ?? 0;
    this.wonderChestWeekSlotUsed = save.wonderChestWeekSlotUsed;
    this.wonderChestClickProgress = save.wonderChestClickProgress;
    this.wonderChestPityCounter = save.wonderChestPityCounter;
    this.wonderChestWeekId = save.wonderChestWeekId;
    this.fragmentVictoryBonusGranted = [...(save.fragmentVictoryBonusGranted ?? [])];
    this.cloudBannerDismissed = save.cloudBannerDismissed ?? false;
    this.illustrationRevealed = [...(save.illustrationRevealed ?? [])];
    this.dailyFindClaimedDayId = save.dailyFindClaimedDayId ?? null;
    this.folktaleIntroShown = save.folktaleIntroShown ?? false;
    this.izbaItemDialogState = { lastTag: null, lastLineIndex: 0 };

    this.susedkoStealActive = save.susedkoStealActive;
    this.lastSusedkoStealAt = save.lastSusedkoStealAt ?? null;
    this.zhirdyaySeenThisNight = save.zhirdyaySeenThisNight;
    this.nightId = save.nightId;
    this.zhirdyayActive = save.zhirdyayActive ?? false;
    this.zhirdyayClickProgress = save.zhirdyayClickProgress ?? 0;
    this.zhirdyayClicksRequired = save.zhirdyayClicksRequired ?? 0;

    this.language = save.language;
    this.catClickCount = save.catClickCount;
    this.totalPlaySeconds = save.totalPlaySeconds ?? 0;

    this.energyRegenBonusPercent = save.energyRegenBonusPercent ?? 0;
    this.poludnicaCoinBonusPercent = save.poludnicaCoinBonusPercent ?? 0;
    this.rusalkaZhirdyayReductionPercent = save.rusalkaZhirdyayReductionPercent ?? 0;
    this.luckCoinsCapBonus = save.luckCoinsCapBonus ?? 0;

    applyDocumentLang(this.language);
    this.applyEnergyRegen();
    this.syncWonderChestWeek();
  }

  toSave(): GameSave {
    return {
      version: this.version,
      savedAt: this.savedAt,

      onboardingStep: this.onboardingStep,
      onboardingCompleted: this.onboardingCompleted,
      isFirstLaunch: this.isFirstLaunch,
      firstChestOpened: this.firstChestOpened,

      energy: this.energy,
      maxEnergy: this.maxEnergy,
      lastEnergyAt: this.lastEnergyAt,
      luckCoins: this.luckCoins,
      talismans: this.talismans,
      titleId: this.titleId,

      spiritStatuses: { ...this.spiritStatuses },
      fragmentCounts: { ...this.fragmentCounts },
      selectedFragmentSpiritId: this.selectedFragmentSpiritId,
      skins: { ...this.skins },
      ownedSkinIds: [...this.ownedSkinIds],
      ownedTitleIds: [...this.ownedTitleIds],
      trophiesUnlocked: [...this.trophiesUnlocked],

      chestReadyAt: this.chestReadyAt,
      spareChestKeys: this.spareChestKeys,
      wonderChestWeekSlotUsed: this.wonderChestWeekSlotUsed,
      wonderChestClickProgress: this.wonderChestClickProgress,
      wonderChestPityCounter: this.wonderChestPityCounter,
      wonderChestWeekId: this.wonderChestWeekId,
      fragmentVictoryBonusGranted: [...this.fragmentVictoryBonusGranted],
      cloudBannerDismissed: this.cloudBannerDismissed,
      illustrationRevealed: [...this.illustrationRevealed],
      dailyFindClaimedDayId: this.dailyFindClaimedDayId,
      folktaleIntroShown: this.folktaleIntroShown,

      susedkoStealActive: this.susedkoStealActive,
      lastSusedkoStealAt: this.lastSusedkoStealAt,
      zhirdyaySeenThisNight: this.zhirdyaySeenThisNight,
      nightId: this.nightId,
      zhirdyayActive: this.zhirdyayActive,
      zhirdyayClickProgress: this.zhirdyayClickProgress,
      zhirdyayClicksRequired: this.zhirdyayClicksRequired,

      language: this.language,
      catClickCount: this.catClickCount,
      totalPlaySeconds: this.totalPlaySeconds,

      energyRegenBonusPercent: this.energyRegenBonusPercent,
      poludnicaCoinBonusPercent: this.poludnicaCoinBonusPercent,
      rusalkaZhirdyayReductionPercent: this.rusalkaZhirdyayReductionPercent,
      luckCoinsCapBonus: this.luckCoinsCapBonus,
    };
  }

  setLocale(locale: Locale): void {
    this.language = locale;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    }
    applyDocumentLang(locale);
    saveService.schedulePersist();
  }

  applyEnergyRegen(now: number = Date.now()): void {
    const result = applyEnergyRegen(
      this.energy,
      this.maxEnergy,
      this.lastEnergyAt,
      now,
      this.energyRegenBonusPercent,
    );
    this.energy = result.energy;
    this.lastEnergyAt = result.lastEnergyAt;
    this.enforceOnboardingEnergyFloor();
  }

  private enforceOnboardingEnergyFloor(): void {
    if (!this.isOnboarding) return;
    const floor = onboardingEnergyFloor(this.onboardingCompleted);
    if (this.energy < floor) {
      this.energy = floor;
    }
  }

  clickCat(rng: () => number = Math.random): CatClickDialogResult {
    this.applyEnergyRegen();

    const freeClick = this.isOnboarding;

    if (!freeClick && this.energy < ENERGY_PER_CLICK) {
      if (this.onboardingCompleted) {
        energyUiStore.open();
      }
      return { kind: 'none' };
    }

    if (!freeClick) {
      this.energy -= ENERGY_PER_CLICK;
    }

    if (this.luckCoins < this.luckCoinsCap) {
      this.luckCoins = Math.min(
        this.luckCoinsCap,
        this.luckCoins + LUCK_COINS_PER_CLICK,
      );
    }

    this.catClickCount += 1;

    if (
      shouldIncrementWonderClickProgress(
        this.isWonderChestVisible(),
        this.wonderChestWeekSlotUsed,
        this.wonderChestClickProgress,
      )
    ) {
      this.wonderChestClickProgress += 1;
    }

    const result = resolveCatClickDialog(this.catClickCount, this.language, rng);
    this.lastCatBubble = result.kind === 'none' ? null : result;

    saveService.schedulePersist();
    return result;
  }

  clearLastCatBubble(): void {
    this.lastCatBubble = null;
  }

  isDailyFindAvailable(): boolean {
    return isDailyFindAvailableDomain(
      this.onboardingCompleted,
      this.dailyFindClaimedDayId,
    );
  }

  claimDailyFind(): boolean {
    if (!this.isDailyFindAvailable()) return false;
    this.applyEnergyRegen();
    this.energy = addRewardEnergy(this.energy, DAILY_FIND_ENERGY);
    this.dailyFindClaimedDayId = getCalendarDayId();
    const line = pickCatLine('daily_find', this.language);
    if (line) {
      this.lastCatBubble = { kind: 'footnote', text: line };
    }
    saveService.schedulePersist();
    return true;
  }

  clickIzbaItem(itemId: IzbaItemId): void {
    if (!this.onboardingCompleted) return;
    if (this.handleZhirdyayBlockedInteraction()) return;
    const { text, nextState } = pickIzbaItemLine(
      itemId,
      this.language,
      this.izbaItemDialogState,
    );
    this.izbaItemDialogState = nextState;
    if (!text) return;
    this.lastCatBubble = { kind: 'footnote', text };
    sceneUiStore.registerActivity();
  }

  markFolktaleIntroShown(): void {
    if (this.folktaleIntroShown) return;
    this.folktaleIntroShown = true;
    saveService.schedulePersist();
  }

  setSpiritStatus(spiritId: SpiritId | string, status: SpiritStatus): void {
    this.spiritStatuses[spiritId] = status;
    saveService.schedulePersist();
  }

  setOnboardingStep(step: number): void {
    if (this.onboardingCompleted) return;
    this.onboardingStep = Math.max(0, Math.min(6, step));
    saveService.schedulePersist();
  }

  /** После закрытия novel-диалога онбординга */
  onOnboardingDialogDismissed(): void {
    if (this.onboardingCompleted) return;

    if (this.onboardingStep === 0) {
      this.setOnboardingStep(1);
      catDialogStore.showOnboardingStep(1, this.language);
      return;
    }

    if (this.onboardingStep === 6) {
      this.completeOnboarding();
    }
  }

  completeOnboarding(): void {
    this.onboardingCompleted = true;
    this.isFirstLaunch = false;
    saveService.schedulePersist();
  }

  openBook(): void {
    if (!this.onboardingCompleted && this.onboardingStep === 1) {
      this.setOnboardingStep(2);
    }
  }

  canStartQuiz(spiritId: SpiritId): boolean {
    return this.spiritStatuses[spiritId] === 'available';
  }

  startQuiz(spiritId: SpiritId, rng: () => number = Math.random): boolean {
    if (this.zhirdyayActive) return false;
    if (!this.canStartQuiz(spiritId)) return false;

    this.applyEnergyRegen();

    const freeQuest = this.isOnboardingFreeQuest(spiritId);
    if (!freeQuest && this.energy < ENERGY_PER_QUEST) return false;

    const quiz = getQuizBySpiritId(spiritId);
    const spirit = getSpiritById(spiritId);
    if (!quiz || !spirit) return false;

    if (!freeQuest) {
      this.energy -= ENERGY_PER_QUEST;
    }

    if (!this.onboardingCompleted) {
      if (spiritId === 'brownie' && this.onboardingStep === 2) {
        catDialogStore.showOnboardingStep(2, this.language);
      }
      if (spiritId === 'susedko' && this.onboardingStep === 3) {
        this.setOnboardingStep(4);
        catDialogStore.showOnboardingStep(4, this.language);
      }
    }

    const shuffled = shuffleQuizQuestions(quiz.questions, rng);
    quizUiStore.open(spiritId, shuffled);
    saveService.schedulePersist();
    return true;
  }

  submitQuizAnswer(answerIndex: number): void {
    if (!quizUiStore.isActive || quizUiStore.phase !== 'question') return;

    const question = quizUiStore.currentQuestion;
    if (!question) return;

    quizUiStore.setPendingAnswer(answerIndex);

    if (answerIndex === question.correctIndex) {
      quizUiStore.setPhase('correct');
      return;
    }

    if (this.talismans > 0) {
      this.talismans -= 1;
      quizUiStore.setOberegShieldFlash(true);
      quizUiStore.setPhase('wrong');
      saveService.schedulePersist();
      return;
    }

    const spirit = getSpiritById(quizUiStore.activeSpiritId!);
    quizUiStore.showDefeat(spirit?.loseMessage ?? '');
    saveService.schedulePersist();
  }

  advanceQuizAfterCorrect(): void {
    if (!quizUiStore.isActive || quizUiStore.phase !== 'correct') return;

    const nextIndex = quizUiStore.questionIndex + 1;
    if (nextIndex >= quizUiStore.totalQuestions) {
      quizUiStore.showVictory();
      return;
    }

    quizUiStore.questionIndex = nextIndex;
    quizUiStore.setPhase('question');
    quizUiStore.pendingAnswerIndex = null;
  }

  advanceQuizAfterWrong(): void {
    if (!quizUiStore.isActive || quizUiStore.phase !== 'wrong') return;
    quizUiStore.setOberegShieldFlash(false);
    quizUiStore.setPhase('question');
    quizUiStore.pendingAnswerIndex = null;
  }

  claimQuizVictory(): void {
    const spiritId = quizUiStore.activeSpiritId;
    if (!spiritId || quizUiStore.phase !== 'victory') return;

    const spirit = getSpiritById(spiritId);
    if (!spirit) return;

    this.spiritStatuses = applyDefeatAndUnlock(
      spiritId,
      this.spiritStatuses,
      this.fragmentCounts,
    );

    this.grantFragmentVictoryBonus(spiritId);

    const rewardState = createRewardStateFromStore(this);
    const patch = applySpiritReward(spirit.reward, rewardState);
    this.applyRewardPatch(patch);

    if (spirit.hasTrophy && !this.trophiesUnlocked.includes(spiritId)) {
      this.trophiesUnlocked = [...this.trophiesUnlocked, spiritId];
      sceneUiStore.triggerTrophyReveal(spiritId);
    }

    this.handleOnboardingAfterVictory(spiritId);
    quizUiStore.close();
    saveService.schedulePersist();
  }

  private applyRewardPatch(
    patch: ReturnType<typeof applySpiritReward>,
  ): void {
    if (patch.energy != null) this.energy = patch.energy;
    if (patch.maxEnergy != null) this.maxEnergy = patch.maxEnergy;
    if (patch.talismans != null) this.talismans = patch.talismans;
    if (patch.luckCoins != null) this.luckCoins = patch.luckCoins;
    if (patch.luckCoinsCapBonus != null) {
      this.luckCoinsCapBonus = patch.luckCoinsCapBonus;
    }
    if (patch.ownedTitleIds != null) {
      this.ownedTitleIds = patch.ownedTitleIds;
    }
    if (patch.ownedSkinIds != null) {
      this.ownedSkinIds = patch.ownedSkinIds;
    }
    if (patch.energyRegenBonusPercent != null) {
      this.energyRegenBonusPercent = patch.energyRegenBonusPercent;
    }
    if (patch.poludnicaCoinBonusPercent != null) {
      this.poludnicaCoinBonusPercent = patch.poludnicaCoinBonusPercent;
    }
    if (patch.rusalkaZhirdyayReductionPercent != null) {
      this.rusalkaZhirdyayReductionPercent = patch.rusalkaZhirdyayReductionPercent;
    }
  }

  private handleOnboardingAfterVictory(spiritId: SpiritId): void {
    if (this.onboardingCompleted) return;

    if (spiritId === 'brownie' && this.onboardingStep <= 2) {
      this.setOnboardingStep(3);
      catDialogStore.showOnboardingStep(3, this.language);
      return;
    }

    if (spiritId === 'susedko') {
      this.setOnboardingStep(5);
      catDialogStore.showOnboardingStep(5, this.language);
    }
  }

  dismissQuizDefeat(): void {
    quizUiStore.close();
  }

  abandonQuiz(): void {
    quizUiStore.close();
  }

  private buildChestRollState() {
    return {
      ownedSkinIds: this.ownedSkinIds,
      ownedTitleIds: this.ownedTitleIds,
      spiritStatuses: this.spiritStatuses,
      fragmentCounts: this.fragmentCounts,
      selectedFragmentSpiritId: this.selectedFragmentSpiritId,
      domovoySkinId: this.skins.domovoy,
      firstChestOpened: this.firstChestOpened,
      chestReadyAt: this.chestReadyAt,
      spareChestKeys: this.spareChestKeys,
    };
  }

  private applyChestLootPatch(patch: ChestLootPatch): void {
    if (patch.ownedSkinIds) this.ownedSkinIds = patch.ownedSkinIds;
    if (patch.ownedTitleIds) this.ownedTitleIds = patch.ownedTitleIds;
    if (patch.spiritStatuses) this.spiritStatuses = patch.spiritStatuses;
    if (patch.fragmentCounts) this.fragmentCounts = patch.fragmentCounts;
    if (patch.energy != null) this.energy = patch.energy;
    if (patch.talismans != null) this.talismans = patch.talismans;
    if (patch.chestReadyAt !== undefined) this.chestReadyAt = patch.chestReadyAt;
    if (patch.spareChestKeys != null) this.spareChestKeys = patch.spareChestKeys;
    if (patch.fragmentCounts) {
      this.spiritStatuses = applyFragmentUnlocks(
        this.spiritStatuses,
        this.fragmentCounts,
      );
    }
  }

  openChest(rng: () => number = Math.random, now: number = Date.now()): boolean {
    if (!this.isChestVisible() || !this.isChestReady(now)) return false;

    const useSpareKey = shouldConsumeSpareKeyOnOpen(
      this.firstChestOpened,
      this.chestReadyAt,
      this.spareChestKeys,
      now,
    );

    const rollState = this.buildChestRollState();
    const loot = rollRegularChestLoot(rollState, rng);
    const patch = applyChestLoot(loot, {
      ...rollState,
      energy: this.energy,
      maxEnergy: this.maxEnergy,
      talismans: this.talismans,
      skins: this.skins,
      now,
    });

    this.applyChestLootPatch(patch);

    if (useSpareKey) {
      this.spareChestKeys -= 1;
    }

    this.firstChestOpened = true;
    this.chestReadyAt = chestReadyAtAfterOpen(now);

    chestUiStore.showLoot(loot);
    saveService.schedulePersist();
    return true;
  }

  dismissChestLoot(): void {
    const wasMiracle = chestUiStore.source === 'miracle';
    chestUiStore.close();

    if (!wasMiracle && !this.onboardingCompleted && this.onboardingStep === 5) {
      this.setOnboardingStep(6);
      catDialogStore.showOnboardingStep(6, this.language);
    }

    saveService.schedulePersist();
  }

  selectFragmentSpirit(spiritId: SpiritId): boolean {
    const fragmentSpirits: SpiritId[] = [
      'lada',
      'veles',
      'baba_yaga',
      'koschei_immortal',
      'chudo_yudo',
    ];
    if (!fragmentSpirits.includes(spiritId)) return false;
    if (this.spiritStatuses[spiritId] !== 'locked') return false;

    this.selectedFragmentSpiritId = spiritId;
    saveService.schedulePersist();
    return true;
  }

  markIllustrationRevealed(spiritId: SpiritId): void {
    if (this.illustrationRevealed.includes(spiritId)) return;
    this.illustrationRevealed = [...this.illustrationRevealed, spiritId];
    saveService.schedulePersist();
  }

  openWonderChest(
    rng: () => number = Math.random,
    now: number = Date.now(),
  ): boolean {
    if (!this.canOpenWonderChest()) return false;

    this.syncWonderChestWeek(now);

    if (this.wonderChestWeekSlotUsed) {
      this.wonderChestClickProgress = Math.max(
        0,
        this.wonderChestClickProgress - miracleChest.clicksToOpen,
      );
    } else {
      this.wonderChestWeekSlotUsed = true;
    }

    const rollState = this.buildChestRollState();
    const { loot, gotFragment, nextPityCounter } = rollMiracleChestLoot(
      rollState,
      this.wonderChestPityCounter,
      rng,
    );
    this.wonderChestPityCounter = nextPityCounter;

    const patch = applyMiracleChestLoot(loot, {
      ...rollState,
      energy: this.energy,
      maxEnergy: this.maxEnergy,
      talismans: this.talismans,
      skins: this.skins,
      now,
    });

    this.applyChestLootPatch(patch);

    chestUiStore.showLoot(loot, 'miracle');
    this.showMiracleLootCatLine(gotFragment);
    saveService.schedulePersist();
    return true;
  }

  private syncWonderChestWeek(now: number = Date.now()): void {
    const sync = syncWonderChestWeekState(
      this.wonderChestWeekId,
      this.wonderChestWeekSlotUsed,
      new Date(now),
    );
    const wasEligible = this.isWonderChestVisible();
    this.wonderChestWeekId = sync.wonderChestWeekId;
    this.wonderChestWeekSlotUsed = sync.wonderChestWeekSlotUsed;

    if (sync.isNewWeek && wasEligible) {
      const line = pickCatLine('miracle_chest_event', this.language);
      if (line) {
        catDialogStore.show([
          { text: line, mode: 'footnote', tag: 'miracle_chest_event' },
        ]);
      }
    }
  }

  private grantFragmentVictoryBonus(spiritId: SpiritId): void {
    if (
      !(fragmentVictoryBonusSpiritIds as readonly string[]).includes(spiritId)
    ) {
      return;
    }
    if (this.fragmentVictoryBonusGranted.includes(spiritId)) return;

    const target =
      (this.selectedFragmentSpiritId as SpiritId | null) ?? spiritId;
    const prev = this.fragmentCounts[target] ?? 0;
    this.fragmentCounts = { ...this.fragmentCounts, [target]: prev + 1 };
    this.fragmentVictoryBonusGranted = [
      ...this.fragmentVictoryBonusGranted,
      spiritId,
    ];
    this.spiritStatuses = applyFragmentUnlocks(
      this.spiritStatuses,
      this.fragmentCounts,
    );
  }

  private showMiracleLootCatLine(gotFragment: boolean): void {
    const tag = gotFragment ? 'fragment_drop' : 'miracle_consolation';
    const line = pickCatLine(tag, this.language);
    if (!line) return;
    catDialogStore.show([{ text: line, mode: 'footnote', tag }]);
  }

  skipChestCooldownWithRewarded(now: number = Date.now()): void {
    if (!this.firstChestOpened) return;
    if (this.isChestReady(now)) return;

    adsService.showRewarded(() => {
      this.chestReadyAt = applyRewardedSkip(this.chestReadyAt, now);
      saveService.schedulePersist();
    });
  }

  restoreEnergyWithRewarded(): void {
    adsService.showRewarded(() => {
      this.energy = addRewardEnergy(this.energy, REWARDED_ENERGY_BONUS);
      energyUiStore.close();
      saveService.schedulePersist();
    });
  }

  markSusedkoStealStarted(now: number = Date.now()): void {
    this.lastSusedkoStealAt = now;
    saveService.schedulePersist();
  }

  syncNightState(now: number = Date.now()): void {
    const current = getNightId(new Date(now));
    if (this.nightId === current) return;
    this.nightId = current;
    this.zhirdyaySeenThisNight = false;
    if (!this.zhirdyayActive) {
      this.zhirdyayClickProgress = 0;
      this.zhirdyayClicksRequired = 0;
    }
    saveService.schedulePersist();
  }

  startZhirdyay(
    _now: number = Date.now(),
    rng: () => number = Math.random,
  ): void {
    this.zhirdyayActive = true;
    this.zhirdyayClickProgress = 0;
    this.zhirdyayClicksRequired = rollZhirdyayClicksRequired(rng);
    saveService.schedulePersist();
  }

  completeZhirdyay(): void {
    this.zhirdyayActive = false;
    this.zhirdyaySeenThisNight = true;
    this.zhirdyayClickProgress = 0;
    this.zhirdyayClicksRequired = 0;
    if (!this.ownedTitleIds.includes('groza_zhirdyaev')) {
      this.ownedTitleIds = [...this.ownedTitleIds, 'groza_zhirdyaev'];
    }
    saveService.schedulePersist();
  }

  isSkinOwned(skinId: string): boolean {
    return this.ownedSkinIds.includes(skinId) || isDefaultOwnedSkin(skinId);
  }

  isTitleOwned(titleId: string): boolean {
    return this.ownedTitleIds.includes(titleId);
  }

  isTrophyUnlocked(spiritId: SpiritId): boolean {
    return this.trophiesUnlocked.includes(spiritId);
  }

  equipSkin(
    category: 'cat' | 'domovoy' | 'izba' | 'window',
    skinId: string,
  ): boolean {
    if (!this.isSkinOwned(skinId)) return false;
    this.skins = { ...this.skins, [category]: skinId };
    saveService.schedulePersist();
    return true;
  }

  equipTitle(titleId: string): boolean {
    if (!this.isTitleOwned(titleId)) return false;
    this.titleId = titleId;
    saveService.schedulePersist();
    return true;
  }
}

export function createGameStoreFromDefault(): GameStore {
  const store = new GameStore();
  store.hydrate(createDefaultSave());
  return store;
}

export const gameStore = createGameStoreFromDefault();
