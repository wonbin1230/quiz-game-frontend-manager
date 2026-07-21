import { create } from 'zustand';

import {
  getTransitionPreset,
  TRANSITION_BY_STAGE,
  TRANSITION_PRESETS,
  type TransitionId,
  type TransitionStage,
} from '../transitions/config';

export type SceneTransitionPhase = 'idle' | 'covering' | 'revealing';

/** covering 細分：面紗 cover；輪播 shrink → revealImage；開局 fadeIn → typing → holding */
export type CoverBeat =
  | 'none'
  | 'cover'
  | 'shrink'
  | 'revealImage'
  | 'fadeIn'
  | 'typing'
  | 'holding';

interface SceneTransitionStore {
  phase: SceneTransitionPhase,
  stage: TransitionStage | null,
  transitionId: TransitionId | null,
  coverBeat: CoverBeat,
  play: (stage: TransitionStage) => void,
  /** 開局打字＋停頓結束（由 StartGameIntro 呼叫；隨後才 emit） */
  markPerformanceDone: () => void,
  /** 收到 QuizGame:GameStarted */
  notifyGameStarted: () => void,
  startReveal: () => void,
  finish: () => void,
}

let beatTimer: ReturnType<typeof setTimeout> | null = null;
let coverTimer: ReturnType<typeof setTimeout> | null = null;
let finishTimer: ReturnType<typeof setTimeout> | null = null;

/** startGameIntro：避免打字結束回呼重複觸發 emit */
let performanceDone = false;

function clearTimers() {
  if (beatTimer) {
    clearTimeout(beatTimer);
    beatTimer = null;
  }
  if (coverTimer) {
    clearTimeout(coverTimer);
    coverTimer = null;
  }
  if (finishTimer) {
    clearTimeout(finishTimer);
    finishTimer = null;
  }
}

function resetStartGameFlags() {
  performanceDone = false;
}

export const useSceneTransitionStore = create<SceneTransitionStore>((set, get) => ({
  phase: 'idle',
  stage: null,
  transitionId: null,
  coverBeat: 'none',
  play: (stage) => {
    clearTimers();
    resetStartGameFlags();
    const transitionId = TRANSITION_BY_STAGE[stage];
    const preset = getTransitionPreset(transitionId);

    if (transitionId === 'none' || preset.durationSec <= 0) {
      set({
        phase: 'idle',
        stage: null,
        transitionId: null,
        coverBeat: 'none',
      });
      return;
    }

    // 開局：變黑 → 打字 → 停頓 → emit → 等 GameStarted → 淡出
    if (transitionId === 'startGameIntro' && 'fadeInSec' in preset) {
      set({
        phase: 'covering',
        stage,
        transitionId,
        coverBeat: 'fadeIn',
      });

      beatTimer = setTimeout(() => {
        beatTimer = null;
        if (get().phase !== 'covering') return;
        if (get().transitionId !== 'startGameIntro') return;
        set({ coverBeat: 'typing' });
      }, preset.fadeInSec * 1000);
      return;
    }

    const totalMs = preset.durationSec * 1000;
    const coverMs = preset.durationSec * preset.coverRatio * 1000;

    if (transitionId === 'carouselExit' && 'shrinkSec' in preset) {
      set({
        phase: 'covering',
        stage,
        transitionId,
        coverBeat: 'shrink',
      });

      beatTimer = setTimeout(() => {
        beatTimer = null;
        if (get().phase !== 'covering') return;
        set({ coverBeat: 'revealImage' });
      }, preset.shrinkSec * 1000);
    } else {
      set({
        phase: 'covering',
        stage,
        transitionId,
        coverBeat: 'cover',
      });
    }

    coverTimer = setTimeout(() => {
      coverTimer = null;
      get().startReveal();
    }, coverMs);

    finishTimer = setTimeout(() => {
      finishTimer = null;
      get().finish();
    }, totalMs + 40);
  },
  markPerformanceDone: () => {
    if (get().transitionId !== 'startGameIntro') return;
    if (get().phase !== 'covering') return;
    if (performanceDone) return;
    performanceDone = true;
    set({ coverBeat: 'holding' });
  },
  notifyGameStarted: () => {
    if (get().transitionId !== 'startGameIntro') return;
    if (get().phase !== 'covering') return;
    get().startReveal();
  },
  startReveal: () => {
    if (get().phase !== 'covering') return;
    set({ phase: 'revealing', coverBeat: 'none' });

    if (get().transitionId === 'startGameIntro') {
      clearTimers();
      finishTimer = setTimeout(() => {
        finishTimer = null;
        get().finish();
      }, TRANSITION_PRESETS.startGameIntro.fadeOutSec * 1000 + 40);
    }
  },
  finish: () => {
    if (get().phase === 'idle') return;
    clearTimers();
    resetStartGameFlags();
    set({
      phase: 'idle',
      stage: null,
      transitionId: null,
      coverBeat: 'none',
    });
  },
}));
