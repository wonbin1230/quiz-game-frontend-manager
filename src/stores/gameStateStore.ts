import { create } from 'zustand';

import { ServerGameState } from '../types/server-response';

interface GameStateStore {
  state: ServerGameState,
  setState: (state: ServerGameState) => void,
}

export const useGameStateStore = create<GameStateStore>((set) => ({
  state: ServerGameState.Prepare,
  setState: (state: ServerGameState) => set({ state }),
}));