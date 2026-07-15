import { create } from 'zustand';

import { SessionState } from '../types/session';

interface SessionStore {
  state: SessionState,
  setState: (state: SessionState) => void,
}

export const useSessionStore = create<SessionStore>((set) => ({
  state: SessionState.Initialize,
  setState: (state: SessionState) => set({ state }),
}));
