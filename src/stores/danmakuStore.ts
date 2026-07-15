import { create } from 'zustand';

import { IDanmakuContent } from '../types/danmaku';

export interface DanmakuItem {
  id: string,
  content: IDanmakuContent,
  /** 在彈幕區域內的垂直位置（0–100%） */
  topPercent: number,
}

interface DanmakuStore {
  items: DanmakuItem[],
  addItem: (content: IDanmakuContent) => void,
  removeItem: (id: string) => void,
  clear: () => void,
}

let danmakuId = 0;

export const useDanmakuStore = create<DanmakuStore>((set) => ({
  items: [],
  addItem: (content) =>
    set((state) => ({
      items: [
        ...state.items,
        {
          id: `danmaku-${++danmakuId}`,
          content,
          topPercent: 5 + Math.random() * 80,
        },
      ],
    })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clear: () => set({ items: [] }),
}));
