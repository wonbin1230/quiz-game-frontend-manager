import { GetSocket } from '../client';

import { RoomState } from '../../types/room';
import { useRoomStore } from '../../stores/roomStore';
import { ClientState } from '../../types/client-state';
import { useClientStateStore } from '../../stores/clientStateStore';
import { usePlayerCountStore } from '../../stores/playerStore';
import { usePlayerListStore } from '../../stores/playerStore';

export const CreateRoom = () => {
  GetSocket().emit('Room:CreateRoom', { roomName: 'Wedding' });
};

export const OnCreateRoom = () => {
  GetSocket().on('Room:CreateRoom', (data) => {
    useClientStateStore.getState().setState(ClientState.RoomCreated);
    useRoomStore.getState().setRoomId(data.roomId);
  });
};

export const OnUserJoin = () => {
  GetSocket().on('Room:UserJoined', (data) => {
    console.log(data);
    usePlayerListStore.getState().setList(data.userList);
    usePlayerCountStore.getState().setCount(data.userCount);
  });
};