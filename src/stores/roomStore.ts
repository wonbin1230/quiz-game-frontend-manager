import { create } from 'zustand';

import { IRoom, RoomState } from '../types/room';

interface RoomStore {
  room: IRoom,
  setRoomId: (roomId: string) => void,
  setRoomName: (roomName: string) => void,
  setRoomState: (roomState: RoomState) => void,
}

export const useRoomStore = create<RoomStore>((set) => ({
  room: {
    roomId: '',
    roomName: '',
    roomState: RoomState.Prepare,
  },
  setRoomId: (roomId: string) => set((state) => ({ room: { ...state.room, roomId } })),
  setRoomName: (roomName: string) => set((state) => ({ room: { ...state.room, roomName } })),
  setRoomState: (roomState: RoomState) => set((state) => ({ room: { ...state.room, roomState } })),
}));