import { create } from 'zustand';

import { ServerRoomState } from '../types/server-response';

interface RoomStateStore {
  state: ServerRoomState,
  setState: (state: ServerRoomState) => void,
}

export const useRoomStateStore = create<RoomStateStore>((set) => ({
  state: ServerRoomState.Prepare,
  setState: (state: ServerRoomState) => set({ state }),
}));