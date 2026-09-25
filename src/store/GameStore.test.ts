import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  ENERGY_PER_CLICK,
  ENERGY_PER_QUEST,
  LUCK_COINS_PER_CLICK,
  ONBOARDING_ENERGY_FLOOR,
} from '../config/gameConstants';
import { createDefaultSave } from '../domain/GameSave';
import { findNextAvailableSpirit } from '../domain/spiritQueue';
import { GameStore } from '../store/GameStore';
import { energyUiStore } from '../store/energyUiStore';
import { sceneUiStore } from '../store/sceneUiStore';
import { quizUiStore } from '../store/quizUiStore';
import { adsUiStore } from './adsUiStore';
import { divinationUiStore } from './divinationUiStore';

function makeStore(partial?: Partial<ReturnType<typeof createDefaultSave>>): GameStore {
  const store = new GameStore();
  store.hydrate({ ...createDefaultSave(), ...partial });
  return store;
}

describe('GameStore', () => {
  afterEach(() => {
    vi.useRealTimers();
    energyUiStore.close();
    divinationUiStore.closeAll();
    sceneUiStore.panBlocked = false;
    sceneUiStore.tiredClickCount = 0;
    sceneUiStore.catSleepReason = null;
    sceneUiStore.catSleeping = false;
  });

  it('clickCat is free during onboarding', () => {
    const store = makeStore({ onboardingCompleted: false, energy: 25 });
    store.clickCat(() => 0.99);
    expect(store.energy).toBe(25);
    expect(store.catClickCount).toBe(1);
    expect(store.luckCoins).toBe(LUCK_COINS_PER_CLICK);
  });

  it('clickCat spends energy after onboarding', () => {
    const store = makeStore({
      onboardingCompleted: true,
      energy: 50,
      lastEnergyAt: Date.now(),
    });
    store.clickCat(() => 0.99);
    expect(store.energy).toBe(50 - ENERGY_PER_CLICK);
  });

  it('clickCat shows tired bubble when out of energy without opening modal on first click', () => {
    const store = makeStore({
      onboardingCompleted: true,
      energy: 0,
      lastEnergyAt: Date.now(),
    });
    const first = store.clickCat(() => 0.99);
    expect(first.kind).toBe('footnote');
    expect(store.catClickCount).toBe(0);
    expect(energyUiStore.isOpen).toBe(false);
    sceneUiStore.catSleepReason = null;
    sceneUiStore.tiredClickCount = 0;
  });

  it('clickCat opens energy modal after tired clicks', () => {
    const store = makeStore({
      onboardingCompleted: true,
      energy: 0,
      lastEnergyAt: Date.now(),
    });
    store.clickCat(() => 0.99);
    store.clickCat(() => 0.99);
    store.clickCat(() => 0.99);
    expect(energyUiStore.isOpen).toBe(true);
    energyUiStore.close();
    sceneUiStore.tiredClickCount = 0;
    sceneUiStore.catSleepReason = null;
    sceneUiStore.catSleeping = false;
  });

  it('enforces onboarding energy floor of 20', () => {
    const store = makeStore({
      onboardingCompleted: false,
      energy: 5,
      lastEnergyAt: Date.now(),
    });
    store.applyEnergyRegen();
    expect(store.energy).toBe(ONBOARDING_ENERGY_FLOOR);
  });

  it('toSave/hydrate roundtrip preserves catClickCount and language', () => {
    const store = makeStore({ catClickCount: 7, language: 'en' });
    const snapshot = store.toSave();
    const restored = new GameStore();
    restored.hydrate(snapshot);
    expect(restored.catClickCount).toBe(7);
    expect(restored.language).toBe('en');
  });

  it('shows footnote on 5th click', () => {
    const store = makeStore();
    for (let i = 0; i < 4; i++) {
      store.clickCat(() => 0.99);
    }
    const fifth = store.clickCat(() => 0.99);
    expect(fifth.kind).toBe('footnote');
    expect(fifth.text).toBeTruthy();
  });

  it('advances onboarding step via setOnboardingStep', () => {
    const store = makeStore({ onboardingStep: 0 });
    store.setOnboardingStep(1);
    expect(store.onboardingStep).toBe(1);
  });

  it('openBook advances from step 1 to 2', () => {
    const store = makeStore({ onboardingStep: 1 });
    store.openBook();
    expect(store.onboardingStep).toBe(2);
  });

  it('startQuiz brownie is free during onboarding', () => {
    const store = makeStore({ onboardingStep: 2, energy: 25 });
    const ok = store.startQuiz('brownie');
    expect(ok).toBe(true);
    expect(store.energy).toBe(25);
    expect(quizUiStore.activeSpiritId).toBe('brownie');
    quizUiStore.close();
  });

  it('completes brownie quiz and unlocks susedko', () => {
    const store = makeStore({ onboardingStep: 2 });
    store.startQuiz('brownie', () => 0.5);

    while (quizUiStore.phase !== 'victory') {
      const q = quizUiStore.currentQuestion!;
      store.submitQuizAnswer(q.correctIndex);
      if (quizUiStore.phase === 'correct') {
        store.advanceQuizAfterCorrect();
      }
    }

    store.claimQuizVictory();
    expect(store.spiritStatuses.brownie).toBe('defeated');
    expect(store.spiritStatuses.susedko).toBe('available');
    expect(store.onboardingStep).toBe(3);
    expect(store.isBrownieOnScene()).toBe(true);
  });

  it('wrong answer spends talisman and continues quiz', () => {
    const store = makeStore({ talismans: 2 });
    store.spiritStatuses.brownie = 'available';
    store.startQuiz('brownie', () => 0.5);

    const wrongIndex =
      quizUiStore.currentQuestion!.correctIndex === 0 ? 1 : 0;
    store.submitQuizAnswer(wrongIndex);
    expect(store.talismans).toBe(1);
    expect(quizUiStore.phase).toBe('wrong');

    store.advanceQuizAfterWrong();
    expect(quizUiStore.phase).toBe('question');
    quizUiStore.close();
  });

  it('quiz fails at zero talismans', () => {
    const store = makeStore({ talismans: 0 });
    store.spiritStatuses.brownie = 'available';
    store.startQuiz('brownie', () => 0.5);

    const wrongIndex =
      quizUiStore.currentQuestion!.correctIndex === 0 ? 1 : 0;
    store.submitQuizAnswer(wrongIndex);
    expect(quizUiStore.phase).toBe('defeat');
    store.dismissQuizDefeat();
    expect(store.spiritStatuses.brownie).toBe('available');
  });

  it('susedko victory advances onboarding to step 5', () => {
    const store = makeStore({ onboardingStep: 3 });
    store.spiritStatuses.brownie = 'defeated';
    store.spiritStatuses.susedko = 'available';
    store.startQuiz('susedko', () => 0.5);

    while (quizUiStore.phase !== 'victory') {
      const q = quizUiStore.currentQuestion!;
      store.submitQuizAnswer(q.correctIndex);
      store.advanceQuizAfterCorrect();
    }

    store.claimQuizVictory();
    expect(store.onboardingStep).toBe(5);
    expect(store.spiritStatuses.susedko).toBe('defeated');
    expect(findNextAvailableSpirit(store.spiritStatuses)).toBe('bannik');
  });

  it('startQuiz spends energy after onboarding', () => {
    const store = makeStore({
      onboardingCompleted: true,
      energy: 50,
      lastEnergyAt: Date.now(),
    });
    store.spiritStatuses.brownie = 'available';
    store.startQuiz('brownie');
    expect(store.energy).toBe(50 - ENERGY_PER_QUEST);
    quizUiStore.close();
  });

  it('opens first chest without cooldown', () => {
    const store = makeStore({
      onboardingStep: 5,
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        brownie: 'defeated',
        susedko: 'defeated',
      },
    });
    expect(store.isChestReady()).toBe(true);
    const ok = store.openChest(() => 0.5);
    expect(ok).toBe(true);
    expect(store.firstChestOpened).toBe(true);
    expect(store.chestReadyAt).toBeGreaterThan(Date.now());
    store.dismissChestLoot();
  });

  it('should skip 90 minutes of chest cooldown with rewarded stub', () => {
    vi.useFakeTimers();
    const now = 1_000_000;
    const readyAt = now + 3 * 60 * 60 * 1000;
    const store = makeStore({
      firstChestOpened: true,
      chestReadyAt: readyAt,
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        susedko: 'defeated',
      },
    });
    expect(store.isChestReady(now)).toBe(false);
    store.skipChestCooldownWithRewarded(now);
    vi.advanceTimersByTime(10_000);
    expect(store.chestReadyAt).toBe(readyAt - 90 * 60 * 1000);
    vi.useRealTimers();
  });

  it('advances onboarding to step 6 after first chest loot', () => {
    const store = makeStore({
      onboardingStep: 5,
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        brownie: 'defeated',
        susedko: 'defeated',
      },
    });
    store.openChest(() => 0.5);
    store.dismissChestLoot();
    expect(store.onboardingStep).toBe(6);
  });

  it('completes onboarding after step 6 dialog', () => {
    const store = makeStore({ onboardingStep: 6 });
    store.onOnboardingDialogDismissed();
    expect(store.onboardingCompleted).toBe(true);
    expect(store.isFirstLaunch).toBe(false);
  });

  it('equips owned skin and title', () => {
    const store = makeStore({
      onboardingCompleted: true,
      ownedSkinIds: ['cat_standart', 'maycoon'],
      ownedTitleIds: ['novenkiy', 'kot_okhrannik'],
    });
    expect(store.equipSkin('cat', 'maycoon')).toBe(true);
    expect(store.skins.cat).toBe('maycoon');
    expect(store.equipTitle('kot_okhrannik')).toBe(true);
    expect(store.titleId).toBe('kot_okhrannik');
    expect(store.equipSkin('cat', 'ninja')).toBe(false);
  });

  it('completes zhirdyay and grants title', () => {
    const store = makeStore({ onboardingCompleted: true });
    store.startZhirdyay(Date.now(), () => 0);
    store.zhirdyayClickProgress = store.zhirdyayClicksRequired;
    store.completeZhirdyay();
    expect(store.zhirdyayActive).toBe(false);
    expect(store.ownedTitleIds).toContain('groza_zhirdyaev');
    expect(store.zhirdyayDefeatedCount).toBe(1);
  });

  it('returns false from handleZhirdyayBlockedInteraction when zhirdyay inactive', () => {
    const store = makeStore({ onboardingCompleted: true });
    expect(store.handleZhirdyayBlockedInteraction()).toBe(false);
    expect(store.lastCatBubble).toBeNull();
  });

  it('shows afraid_night bubble without side effects when zhirdyay blocks interaction', () => {
    const store = makeStore({ onboardingCompleted: true, energy: 50 });
    store.startZhirdyay(Date.now(), () => 0);
    const energyBefore = store.energy;
    const clicksBefore = store.catClickCount;

    expect(store.handleZhirdyayBlockedInteraction(() => 0)).toBe(true);
    expect(store.lastCatBubble?.kind).toBe('bubble');
    expect(store.lastCatBubble?.text).toBeTruthy();
    expect(store.energy).toBe(energyBefore);
    expect(store.catClickCount).toBe(clicksBefore);
  });

  it('shows wonder chest after susedko and rare+ spirit defeated', () => {
    const store = makeStore({
      onboardingCompleted: true,
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        brownie: 'defeated',
        susedko: 'defeated',
        leshiy: 'defeated',
      },
    });
    expect(store.isWonderChestVisible()).toBe(true);
    expect(store.canOpenWonderChest()).toBe(true);
  });

  it('opens wonder chest free on first week slot', () => {
    const store = makeStore({
      onboardingCompleted: true,
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        brownie: 'defeated',
        susedko: 'defeated',
        leshiy: 'defeated',
      },
      selectedFragmentSpiritId: 'lada',
    });
    const ok = store.openWonderChest(() => 0, Date.now());
    expect(ok).toBe(true);
    expect(store.wonderChestWeekSlotUsed).toBe(true);
  });

  it('grants one-time fragment on rare+ victory', () => {
    const store = makeStore({
      onboardingCompleted: true,
      energy: 100,
      lastEnergyAt: Date.now(),
      selectedFragmentSpiritId: 'lada',
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        brownie: 'defeated',
        susedko: 'defeated',
        bannik: 'defeated',
        kikimora: 'defeated',
        poludnik: 'defeated',
        ovinnik: 'defeated',
        leshiy: 'available',
      },
    });
    store.startQuiz('leshiy', () => 0.5);
    while (quizUiStore.phase !== 'victory') {
      const q = quizUiStore.currentQuestion!;
      store.submitQuizAnswer(q.correctIndex);
      store.advanceQuizAfterCorrect();
    }
    store.claimQuizVictory();
    expect(store.fragmentCounts.baba_yaga).toBe(1);
    expect(store.fragmentVictoryBonusGranted).toContain('leshiy');
  });

  it('selects fragment target in book', () => {
    const store = makeStore({
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        lada: 'locked',
      },
    });
    expect(store.selectFragmentSpirit('lada')).toBe(true);
    expect(store.selectedFragmentSpiritId).toBe('lada');
  });

  it('should persist illustrationRevealed when markIllustrationRevealed called', () => {
    const store = makeStore({ illustrationRevealed: [] });
    store.markIllustrationRevealed('brownie');
    expect(store.illustrationRevealed).toEqual(['brownie']);
    expect(store.toSave().illustrationRevealed).toEqual(['brownie']);
    store.markIllustrationRevealed('brownie');
    expect(store.illustrationRevealed).toEqual(['brownie']);
  });

  it('shows cloud banner after first chest when not dismissed', () => {
    const store = makeStore({ firstChestOpened: true, cloudBannerDismissed: false });
    expect(store.isCloudBannerVisible(false)).toBe(true);
    store.dismissCloudBanner();
    expect(store.isCloudBannerVisible(false)).toBe(false);
  });

  it('resets progress to default save', async () => {
    const store = makeStore({
      onboardingCompleted: true,
      energy: 12,
      luckCoins: 99,
    });
    await store.resetProgress();
    expect(store.onboardingCompleted).toBe(false);
    expect(store.onboardingStep).toBe(0);
    expect(store.energy).toBe(120);
    expect(store.luckCoins).toBe(0);
  });

  it('baba_yaga victory grants title, trophy, and landscape_yaga skin without equipping', () => {
    const store = makeStore({
      onboardingCompleted: true,
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        baba_yaga: 'available',
      },
    });
    store.startQuiz('baba_yaga', () => 0.5);

    while (quizUiStore.phase !== 'victory') {
      const q = quizUiStore.currentQuestion!;
      store.submitQuizAnswer(q.correctIndex);
      if (quizUiStore.phase === 'correct') {
        store.advanceQuizAfterCorrect();
      }
    }

    const windowBefore = store.skins.window;
    store.claimQuizVictory();

    expect(store.spiritStatuses.baba_yaga).toBe('defeated');
    expect(store.ownedTitleIds).toContain('kogot_yagi');
    expect(store.ownedSkinIds).toContain('landscape_yaga');
    expect(store.skins.window).toBe(windowBefore);
    expect(store.trophiesUnlocked).toContain('baba_yaga');
  });

  it('clickMirror before Yaga shows cat line without opening threshold', () => {
    const store = makeStore({
      onboardingCompleted: true,
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        baba_yaga: 'available',
      },
      candles: 2,
    });
    store.clickMirror();
    expect(divinationUiStore.phase).toBe('idle');
    expect(store.lastCatBubble?.text).toMatch(/зеркал|Зачем|Свечи|кого-то/i);
  });

  it('clickHudResourceHint explains luck coins', () => {
    const store = makeStore({ onboardingCompleted: true });
    store.clickHudResourceHint('luck_coins');
    expect(store.lastCatBubble?.text).toMatch(/Кликай кота|монет/i);
  });

  it('confirmDivinationAsk spends one candle and starts session', () => {
    const store = makeStore({
      onboardingCompleted: true,
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        baba_yaga: 'defeated',
        brownie: 'defeated',
      },
      candles: 1,
    });
    store.clickMirror();
    expect(divinationUiStore.phase).toBe('threshold');
    store.confirmDivinationAsk();
    expect(store.candles).toBe(0);
    expect(divinationUiStore.phase).toBe('smoke');
  });

  it('equipPet allows only owned pets', () => {
    const store = makeStore({
      ownedPetIds: ['pet_griffin'],
      equippedPetId: null,
    });
    expect(store.equipPet('pet_griffin')).toBe(true);
    expect(store.equippedPetId).toBe('pet_griffin');
    expect(store.equipPet('pet_firebird')).toBe(false);
    expect(store.equipPet(null)).toBe(true);
    expect(store.equippedPetId).toBeNull();
  });

  it('purchaseYagaShopItem grants title and deducts crumbs', () => {
    const store = makeStore({
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        baba_yaga: 'defeated',
      },
      truthCrumbs: 15,
    });
    const result = store.purchaseYagaShopItem('shop_title_visionary_cat');
    expect(result).toBe('success');
    expect(store.truthCrumbs).toBe(5);
    expect(store.ownedTitleIds).toContain('title_visionary_cat');
    expect(store.purchaseYagaShopItem('shop_title_visionary_cat')).toBe(
      'already_owned',
    );
  });

  it('drops phantom daily reward claimed without fragment grant on hydrate', () => {
    const now = new Date('2026-09-20T12:00:00');
    vi.useFakeTimers();
    vi.setSystemTime(now);
    const store = makeStore({
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        bannik: 'defeated',
      },
      dailyQuestDayId: '2026-09-20',
      dailyQuestRewardClaimedDayId: '2026-09-20',
      dailyQuestFragmentGrantedDayId: null,
      dailyQuestClickProgress: 100,
      dailyQuestTaleCorrect: true,
    });
    expect(store.isDailyQuestRewardClaimedToday(now)).toBe(false);
    expect(store.canClaimDailyQuestFragment(now)).toBe(true);
  });

  it('persists daily quest claim across hydrate', () => {
    const now = new Date('2026-09-20T12:00:00');
    vi.useFakeTimers();
    vi.setSystemTime(now);
    const store = makeStore({
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        bannik: 'defeated',
      },
      dailyQuestDayId: '2026-09-20',
      dailyQuestTaleSpiritId: 'bannik',
      dailyQuestClickProgress: 100,
      dailyQuestTaleCorrect: true,
    });
    expect(store.claimDailyQuestFragment(now)).toBe(true);
    const restored = new GameStore();
    restored.hydrate(store.toSave());
    expect(restored.isDailyQuestRewardClaimedToday(now)).toBe(true);
    expect(restored.dailyQuestFragmentGrantedDayId).toBe('2026-09-20');
    expect(restored.fragmentCounts.baba_yaga).toBe(1);
  });

  it('clears stale daily quest reward flag when tasks were reset', () => {
    const now = new Date('2026-09-20T12:00:00');
    vi.useFakeTimers();
    vi.setSystemTime(now);
    const store = makeStore({
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        bannik: 'defeated',
      },
      dailyQuestDayId: '2026-09-20',
      dailyQuestRewardClaimedDayId: '2026-09-20',
      dailyQuestClickProgress: 0,
      dailyQuestTaleCorrect: false,
    });
    store.canClaimDailyQuestFragment(now);
    expect(store.isDailyQuestRewardClaimedToday(now)).toBe(false);
  });

  it('does not treat daily-find day as daily quest reward claimed', () => {
    const now = new Date('2026-09-20T12:00:00');
    vi.useFakeTimers();
    vi.setSystemTime(now);
    const store = makeStore({
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        bannik: 'defeated',
      },
      dailyFindClaimedDayId: '2026-09-20',
      dailyQuestRewardClaimedDayId: null,
    });
    expect(store.isDailyQuestRewardClaimedToday(now)).toBe(false);
  });

  it('should allow only one daily quest fragment claim per calendar day', () => {
    const now = new Date('2026-09-20T12:00:00');
    vi.useFakeTimers();
    vi.setSystemTime(now);
    const store = makeStore({
      spiritStatuses: {
        ...createDefaultSave().spiritStatuses,
        bannik: 'defeated',
      },
      dailyQuestDayId: '2026-09-20',
      dailyQuestTaleSpiritId: 'bannik',
      dailyQuestClickProgress: 100,
      dailyQuestTaleCorrect: true,
    });
    expect(store.claimDailyQuestFragment(now)).toBe(true);
    expect(store.fragmentCounts.baba_yaga).toBe(1);
    expect(store.claimDailyQuestFragment(now)).toBe(false);
    expect(store.fragmentCounts.baba_yaga).toBe(1);
  });
});
