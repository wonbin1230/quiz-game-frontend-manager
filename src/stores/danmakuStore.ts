import { create } from 'zustand';

import { DanmakuSystemType, IDanmakuContent } from '../types/danmaku';

/** 上方 20% 區域切成固定列 */
export const LANE_COUNT = 5;

/** 橫越一個視窗寬度的秒數。全員同速，後面的才不會追上前面的 */
const CROSS_SEC = 6;

/**
 * 同一條軌道要等前一則至少走出畫面這個比例，才放下一則。
 * 只擋重疊的話，幾十人同時進房仍會貼在一起。
 */
const MIN_TRAVEL_RATIO = 0.42;

/** 名字很長時，尾端再留一段空隙 */
const TAIL_PAD_PX = 48;

/** 不同軌道錯開出發，避免同一瞬間排成一直線 */
const LAUNCH_STAGGER_MS = 140;

const DUE_SLACK_MS = 24;

export interface DanmakuItem {
  id: string,
  content: IDanmakuContent,
  lane: number,
  fromX: number,
  toX: number,
  duration: number,
}

export interface DanmakuTrackMetrics {
  viewportWidth: number,
  offsetLeft: number,
  measure: (text: string) => number,
}

interface DanmakuStore {
  items: DanmakuItem[],
  addItem: (content: IDanmakuContent) => void,
  removeItem: (id: string) => void,
  clear: () => void,
}

export const formatDanmakuText = (
  sender: string,
  systemType: DanmakuSystemType,
  content: string,
) => {
  if (systemType === DanmakuSystemType.PlayerJoin) {
    return `${sender} ${content || '已加入房間'}`;
  }
  if (systemType === DanmakuSystemType.PlayerLeave) {
    return `${sender} ${content || '已離開房間'}`;
  }
  return content ? `${sender} ${content}` : sender;
};

let danmakuId = 0;
let metrics: DanmakuTrackMetrics | null = null;
let pending: IDanmakuContent[] = [];
let laneReadyAt = Array.from({ length: LANE_COUNT }, () => 0);
let nextLaunchAt = 0;
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let flushing = false;

const resetSchedule = () => {
  laneReadyAt = Array.from({ length: LANE_COUNT }, () => 0);
  nextLaunchAt = 0;
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
};

const scheduleFlush = (at: number) => {
  if (flushTimer) clearTimeout(flushTimer);
  const delay = Math.max(0, at - performance.now());
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushQueue();
  }, delay);
};

const findFreeLane = (now: number) => {
  let lane = -1;
  let readyAt = Infinity;
  for (let i = 0; i < LANE_COUNT; i += 1) {
    if (laneReadyAt[i] <= now + DUE_SLACK_MS && laneReadyAt[i] < readyAt) {
      lane = i;
      readyAt = laneReadyAt[i];
    }
  }
  return lane;
};

const earliestLaneReady = () => {
  let earliest = Infinity;
  for (let i = 0; i < LANE_COUNT; i += 1) {
    earliest = Math.min(earliest, laneReadyAt[i]);
  }
  return earliest;
};

const flushQueue = () => {
  if (flushing) return;
  flushing = true;
  try {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }

    const track = metrics;
    if (!track || track.viewportWidth <= 0 || pending.length === 0) return;

    const now = performance.now();
    if (nextLaunchAt > now + DUE_SLACK_MS) {
      scheduleFlush(nextLaunchAt);
      return;
    }

    const lane = findFreeLane(now);
    if (lane < 0) {
      scheduleFlush(earliestLaneReady());
      return;
    }

    const content = pending.shift();
    if (!content) return;

    const text = formatDanmakuText(content.sender, content.systemType, content.content);
    const textWidth = Math.max(1, Math.ceil(track.measure(text) || text.length * 22));
    const speed = track.viewportWidth / CROSS_SEC;
    const fromX = track.viewportWidth - track.offsetLeft;
    const toX = -(track.offsetLeft + textWidth);
    const duration = Math.max(0.1, (fromX - toX) / speed);
    const clearance = Math.max(
      textWidth + TAIL_PAD_PX,
      track.viewportWidth * MIN_TRAVEL_RATIO,
    );

    laneReadyAt[lane] = now + (clearance / speed) * 1000;
    nextLaunchAt = now + LAUNCH_STAGGER_MS;

    const item: DanmakuItem = {
      id: `danmaku-${++danmakuId}`,
      content,
      lane,
      fromX,
      toX,
      duration,
    };

    useDanmakuStore.setState((state) => ({
      items: [...state.items, item],
    }));

    if (pending.length > 0) {
      scheduleFlush(Math.max(nextLaunchAt, earliestLaneReady()));
    }
  } finally {
    flushing = false;
  }
};

export const setDanmakuTrackMetrics = (next: DanmakuTrackMetrics | null) => {
  if (!next) {
    metrics = null;
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    return;
  }

  const unchanged =
    metrics !== null &&
    metrics.viewportWidth === next.viewportWidth &&
    Math.abs(metrics.offsetLeft - next.offsetLeft) < 0.5;

  metrics = next;
  if (unchanged) return;
  flushQueue();
};

export const useDanmakuStore = create<DanmakuStore>((set) => ({
  items: [],
  addItem: (content) => {
    pending.push(content);
    flushQueue();
  },
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clear: () => {
    pending = [];
    resetSchedule();
    set({ items: [] });
  },
}));
