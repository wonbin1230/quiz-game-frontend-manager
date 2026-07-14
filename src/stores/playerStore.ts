import { create } from 'zustand';

interface PlayerListStore {
  list: string[],
  setList: (list: string[]) => void,
}

export const usePlayerListStore = create<PlayerListStore>((set) => ({
  list: [],
  setList: (list: string[]) => set({ list }),
}));

interface PlayerCountStore {
  count: number,
  setCount: (count: number) => void,
}

export const usePlayerCountStore = create<PlayerCountStore>((set) => ({
  count: 0,
  setCount: (count: number) => set({ count }),
}));