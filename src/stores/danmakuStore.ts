import { create } from 'zustand';

import { IDanmakuContent } from '../types/danmaku';

/** 上方 20% 區域切成固定列；字級加大時允許略微溢出列界 */
export const LANE_COUNT = 5;

export interface DanmakuItem {
  id: string,
  content: IDanmakuContent,
  lane: number,
  createdAt: number,
}

interface DanmakuStore {
  items: DanmakuItem[],
  addItem: (content: IDanmakuContent) => void,
  removeItem: (id: string) => void,
  clear: () => void,
}

let danmakuId = 0;

/** 優先空軌道；全滿時選數量最少、且最近一則開始最早的軌道 */
const pickLane = (items: DanmakuItem[]) => {
  const counts = Array.from({ length: LANE_COUNT }, () => 0);
  const latestCreated = Array.from({ length: LANE_COUNT }, () => 0);

  for (const item of items) {
    counts[item.lane] += 1;
    latestCreated[item.lane] = Math.max(latestCreated[item.lane], item.createdAt);
  }

  const emptyLanes = counts
    .map((count, lane) => (count === 0 ? lane : -1))
    .filter((lane) => lane >= 0);

  if (emptyLanes.length > 0) {
    return emptyLanes[0];
  }

  let best = 0;
  for (let lane = 1; lane < LANE_COUNT; lane += 1) {
    const fewer = counts[lane] < counts[best];
    const sameCountEarlier =
      counts[lane] === counts[best] && latestCreated[lane] < latestCreated[best];
    if (fewer || sameCountEarlier) {
      best = lane;
    }
  }
  return best;
};

export const useDanmakuStore = create<DanmakuStore>((set) => ({
  items: [],
  addItem: (content) =>
    set((state) => {
      const lane = pickLane(state.items);
      return {
        items: [
          ...state.items,
          {
            id: `danmaku-${++danmakuId}`,
            content,
            lane,
            createdAt: Date.now(),
          },
        ],
      };
    }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clear: () => set({ items: [] }),
}));
