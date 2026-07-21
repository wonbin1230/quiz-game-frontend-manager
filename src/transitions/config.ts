/**
 * 場景轉場設定 — 測試時改這裡即可切換
 *
 * 用法：
 * 1. 改 TRANSITION_BY_STAGE.createRoom
 *    - 'carouselExit'   輪播縮小加速 → 揭幕圖放大蓋滿
 *    - 'veil'           儀式感面紗（soft flash + 左右揭開）
 *    - 'none'           無轉場，直接切畫面
 * 2. 改 TRANSITION_BY_STAGE.startGame
 *    - 'startGameIntro' 變黑 → 打字 → 停頓 → emit → 等 GameStarted → 淡出
 *    - 'veil' | 'none'  等同 createRoom 可用選項
 */

export type TransitionStage = 'createRoom' | 'startGame';

export type TransitionId = 'veil' | 'carouselExit' | 'startGameIntro' | 'none';

/** 各階段使用的轉場（改這個變數來切換） */
export const TRANSITION_BY_STAGE: Record<TransitionStage, TransitionId> = {
  createRoom: 'carouselExit',
  startGame: 'startGameIntro',
};

type VeilPreset = {
  durationSec: number,
  coverRatio: number,
};

type CarouselExitPreset = {
  durationSec: number,
  /** covering 佔總時長比例；carouselExit 為 1（蓋滿瞬間切場景） */
  coverRatio: number,
  /** 輪播 scale 1→0.1 + 加速旋轉 */
  shrinkSec: number,
  /** 揭幕圖 scale 放大蓋滿 */
  revealImageSec: number,
};

type StartGameIntroPreset = {
  /** 與通用邏輯相容；實際節奏以 fade / typing 欄位為準 */
  durationSec: number,
  coverRatio: number,
  fadeInSec: number,
  fadeOutSec: number,
  typeCharMs: number,
  /** 「讓我們」與「開始吧」之間的停頓 */
  typePauseMs: number,
  /** 整句打完後、emit 前的停頓 */
  typeHoldMs: number,
  typeFirst: string,
  typeSecond: string,
};

type NonePreset = {
  durationSec: number,
  coverRatio: number,
};

export const TRANSITION_PRESETS: {
  veil: VeilPreset,
  carouselExit: CarouselExitPreset,
  startGameIntro: StartGameIntroPreset,
  none: NonePreset,
} = {
  veil: {
    durationSec: 1.2,
    coverRatio: 0.4,
  },
  carouselExit: {
    durationSec: 3,
    coverRatio: 1,
    shrinkSec: 2,
    revealImageSec: 1,
  },
  startGameIntro: {
    durationSec: 1,
    coverRatio: 1,
    fadeInSec: 1,
    fadeOutSec: 1,
    typeCharMs: 100,
    typePauseMs: 500,
    typeHoldMs: 1000,
    typeFirst: '讓我們',
    typeSecond: '開始吧',
  },
  none: {
    durationSec: 0,
    coverRatio: 0,
  },
};

export function getTransitionPreset(id: TransitionId) {
  return TRANSITION_PRESETS[id];
}
