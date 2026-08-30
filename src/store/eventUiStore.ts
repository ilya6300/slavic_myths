import { makeAutoObservable } from 'mobx';

import { susedkoStealPositions } from '../config/sceneLayout';

import {

  SUSEDKO_CLICKS_TO_FLEE,

  SUSEDKO_STEAL_COIN_INTERVAL_MS,

  SUSEDKO_STEAL_WARNING_MS,

} from '../config/gameConstants';

import { getSusedkoCatWarning, pickSusedkoTaunt, getSusedkoFleeLine } from '../data/susedkoDialogs';

import {

  advanceStealPhase,

  canStartSusedkoSteal,

  canStealCoins,

  isSusedkoStealCooldownElapsed,

  shouldStopStealing,

  type SusedkoStealPhase,

} from '../domain/susedkoSteal';

import {

  isZhirdyayDefeated,

  shouldSpawnZhirdyay,

} from '../domain/zhirdyay';

import { getNightId } from '../domain/GameSave';

import { isNightTime } from '../domain/nightTime';

import { getZhirdyayWinLine } from '../data/catDialogs';

import { gameStore } from './GameStore';

import { sceneUiStore } from './sceneUiStore';

import { saveService } from '../services/saveService';

import { catDialogStore } from './catDialogStore';



const IDLE_TICKER_KEY = '__slavic_idle_ticker_id';



export class EventUiStore {

  susedkoPhase: SusedkoStealPhase = 'idle';

  catSleepedAt: number | null = null;

  susedkoStealNextAt: number | null = null;

  susedkoClicks = 0;

  susedkoPositionIndex = 0;

  susedkoBubble: string | null = null;

  stealWarningShown = false;

  stealSuppressedThisSleep = false;

  zhirdyaySpawnAttemptedForNight: string | null = null;



  constructor() {

    makeAutoObservable(this);

  }



  get isStealing(): boolean {

    return this.susedkoPhase === 'stealing';

  }



  resetSusedkoSteal(): void {

    this.susedkoPhase = 'idle';

    this.susedkoStealNextAt = null;

    this.susedkoClicks = 0;

    this.susedkoBubble = null;

    gameStore.susedkoStealActive = false;

  }



  private endStealCycleForSleep(): void {

    this.resetSusedkoSteal();

    this.stealSuppressedThisSleep = true;

    this.stealWarningShown = true;

  }



  onCatFellAsleep(now: number = Date.now()): void {

    if (!canStartSusedkoSteal(this.stealContext)) return;

    this.catSleepedAt = now;

    this.susedkoPhase = 'idle';

    this.stealSuppressedThisSleep = false;

    this.stealWarningShown = false;

  }



  onCatWoke(): void {

    this.stealSuppressedThisSleep = false;

    this.stealWarningShown = false;

    if (this.susedkoPhase !== 'idle') {

      this.resetSusedkoSteal();

    }

    this.catSleepedAt = null;

  }



  private get stealContext() {

    return {

      onboardingCompleted: gameStore.onboardingCompleted,

      firstChestOpened: gameStore.firstChestOpened,

      catSleeping: sceneUiStore.catSleeping,

      activeRoom: sceneUiStore.activeRoom,

      zhirdyayActive: gameStore.zhirdyayActive,

    };

  }



  tick(now: number = Date.now()): void {

    gameStore.syncNightState(now);



    if (sceneUiStore.catSleeping && this.catSleepedAt == null) {

      this.onCatFellAsleep(now);

    }

    if (!sceneUiStore.catSleeping && this.catSleepedAt != null) {

      this.onCatWoke();

    }



    this.tickZhirdyaySpawn(now);

    this.tickSusedkoSteal(now);

  }



  private tickZhirdyaySpawn(now: number): void {

    if (gameStore.zhirdyayActive) {

      if (isZhirdyayDefeated(gameStore.zhirdyayClickProgress, gameStore.zhirdyayClicksRequired)) {

        gameStore.completeZhirdyay();

      }

      return;

    }



    const nightId = getNightId(new Date(now));

    if (gameStore.zhirdyaySeenThisNight) return;

    if (!isNightTime(new Date(now))) return;

    if (sceneUiStore.activeRoom !== 1) return;

    if (!gameStore.onboardingCompleted) return;



    if (this.zhirdyaySpawnAttemptedForNight === nightId) return;

    this.zhirdyaySpawnAttemptedForNight = nightId;



    if (

      shouldSpawnZhirdyay({

        isNight: true,

        activeRoom: 1,

        zhirdyaySeenThisNight: false,

        onboardingCompleted: true,

        zhirdyayActive: false,

        rusalkaZhirdyayReductionPercent: gameStore.rusalkaZhirdyayReductionPercent,

      })

    ) {

      gameStore.startZhirdyay(now);

    } else {

      gameStore.zhirdyaySeenThisNight = true;

      saveService.schedulePersist();

    }

  }



  private tickSusedkoSteal(now: number): void {

    if (!canStartSusedkoSteal(this.stealContext)) {

      if (this.susedkoPhase !== 'idle') this.resetSusedkoSteal();

      return;

    }



    if (this.catSleepedAt == null) return;

    if (this.stealSuppressedThisSleep) return;



    const elapsed = now - this.catSleepedAt;

    const coinsOk = canStealCoins(gameStore.luckCoins);

    const cooldownOk = isSusedkoStealCooldownElapsed(

      now,

      gameStore.lastSusedkoStealAt,

    );



    if (!cooldownOk) {

      if (this.susedkoPhase === 'stealing') this.resetSusedkoSteal();

      return;

    }



    if (!coinsOk) {

      if (this.susedkoPhase === 'stealing') {

        this.endStealCycleForSleep();

      }

      return;

    }



    const nextPhase = advanceStealPhase(this.susedkoPhase, this.catSleepedAt, now);



    if (

      this.susedkoPhase === 'idle' &&

      nextPhase !== 'idle' &&

      elapsed >= SUSEDKO_STEAL_WARNING_MS &&

      !this.stealWarningShown

    ) {

      this.stealWarningShown = true;

      const text = getSusedkoCatWarning(gameStore.language);

      gameStore.lastCatBubble = { kind: 'footnote', text };

    }



    if (this.susedkoPhase === 'idle' && nextPhase === 'stealing') {

      this.susedkoPhase = 'stealing';

      gameStore.susedkoStealActive = true;

      gameStore.markSusedkoStealStarted(now);

      this.susedkoStealNextAt = now + SUSEDKO_STEAL_COIN_INTERVAL_MS;

      this.susedkoPositionIndex = Math.floor(

        Math.random() * susedkoStealPositions.length,

      );

    } else if (nextPhase === 'warning') {

      this.susedkoPhase = 'warning';

    }



    if (this.susedkoPhase !== 'stealing') return;



    if (shouldStopStealing(gameStore.luckCoins)) {

      this.endStealCycleForSleep();

      return;

    }



    if (this.susedkoStealNextAt != null && now >= this.susedkoStealNextAt) {

      this.susedkoStealNextAt = now + SUSEDKO_STEAL_COIN_INTERVAL_MS;

      gameStore.luckCoins = Math.max(0, gameStore.luckCoins - 1);

      saveService.schedulePersist();

    }



    if (shouldStopStealing(gameStore.luckCoins)) {

      this.endStealCycleForSleep();

    }

  }



  clickSusedko(rng: () => number = Math.random): void {

    if (this.susedkoPhase !== 'stealing') return;



    this.susedkoClicks += 1;

    this.susedkoPositionIndex =

      (this.susedkoPositionIndex + 1) % susedkoStealPositions.length;



    if (this.susedkoClicks >= SUSEDKO_CLICKS_TO_FLEE) {

      gameStore.lastCatBubble = {

        kind: 'footnote',

        text: getSusedkoFleeLine(gameStore.language),

      };

      this.endStealCycleForSleep();

      return;

    }



    this.susedkoBubble = pickSusedkoTaunt(

      gameStore.language,

      this.susedkoBubble ?? undefined,

      rng,

    ) ?? null;

  }



  clickZhirdyay(): void {

    if (!gameStore.zhirdyayActive) return;

    gameStore.zhirdyayClickProgress += 1;

    saveService.schedulePersist();



    if (isZhirdyayDefeated(gameStore.zhirdyayClickProgress, gameStore.zhirdyayClicksRequired)) {

      gameStore.completeZhirdyay();

      const text = getZhirdyayWinLine(gameStore.language);

      catDialogStore.show([{ text, mode: 'footnote', blocking: false }]);

    }

  }

}



export const eventUiStore = new EventUiStore();



export { IDLE_TICKER_KEY };

