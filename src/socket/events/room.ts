import { GetSocket } from '../client';

import { IServerCreateRoom, IServerUserJoined } from '../../types/server-response';

import { ClientState } from '../../types/client-state';
import { useClientStateStore } from '../../stores/clientStateStore';
import { useRoomStore } from '../../stores/roomStore';
import { usePlayerCountStore, usePlayerListStore } from '../../stores/playerStore';
import { useDanmakuStore } from '../../stores/danmakuStore';
import { DanmakuSystemType } from '../../types/danmaku';

export const CreateRoom = () => {
  GetSocket().emit('Room:CreateRoom', { roomName: 'Wedding' });
};

export const OnCreateRoom = () => {
  GetSocket().on('Room:CreateRoom', (data: IServerCreateRoom) => {
    useClientStateStore.getState().setState(ClientState.RoomCreated);
    useRoomStore.getState().setRoomId(data.roomId);
  });
};

export const OnUserJoin = () => {
  GetSocket().on('Room:UserJoined', (data: IServerUserJoined) => {
    console.log(data);
    usePlayerListStore.getState().setList(data.userList);
    usePlayerCountStore.getState().setCount(data.userCount);
    useDanmakuStore.getState().addItem({
      sender: data.userId,
      systemType: DanmakuSystemType.PlayerJoin,
      content: '已加入房間',
      bonusContent: '',
    });
  });
};