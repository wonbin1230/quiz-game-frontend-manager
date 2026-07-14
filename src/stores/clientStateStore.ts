import { create } from 'zustand';

import { ClientState } from '../types/client-state';

interface ClientStateStore {
  state: ClientState,
  setState: (state: ClientState) => void,
}

export const useClientStateStore = create<ClientStateStore>((set) => ({
  state: ClientState.Initialize,
  setState: (state: ClientState) => set({ state }),
}));