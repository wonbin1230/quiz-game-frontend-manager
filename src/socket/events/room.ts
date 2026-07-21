import { GetSocket } from '../client';

import { IServerCreateRoom, IServerUserJoined } from '../../types/server-response';
import { SessionState } from '../../types/session';
import { DanmakuSystemType } from '../../types/danmaku';

import { useSessionStore } from '../../stores/sessionStore';
import { useRoomStore } from '../../stores/roomStore';
import { usePlayerCountStore, usePlayerListStore } from '../../stores/playerStore';
import { useDanmakuStore } from '../../stores/danmakuStore';
import { useSceneTransitionStore } from '../../stores/enterRoomTransitionStore';
import { TRANSITION_BY_STAGE } from '../../transitions/config';

export const CreateRoom = () => {
  GetSocket().emit('Room:CreateRoom', { roomName: 'Wedding' });
};

export const OnCreateRoom = () => {
  GetSocket().on('Room:CreateRoom', (data: IServerCreateRoom) => {
    useSessionStore.getState().setState(SessionState.InRoom);
    useRoomStore.getState().setRoomId(data.roomId);
    useSceneTransitionStore.getState().play('createRoom');
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

/** 送出開始遊戲（startGameIntro 在表演結束後才呼叫） */
export const EmitStartGame = () => {
  GetSocket().emit('Room:StartGame', { roomName: 'Wedding' });
};

/** 按下開始：先播轉場；startGameIntro 會在表演完再 EmitStartGame */
export const StartGame = () => {
  const { phase } = useSceneTransitionStore.getState();
  if (phase !== 'idle') return;

  const transitionId = TRANSITION_BY_STAGE.startGame;
  if (transitionId === 'startGameIntro') {
    useSceneTransitionStore.getState().play('startGame');
    return;
  }

  EmitStartGame();
  if (transitionId !== 'none') {
    useSceneTransitionStore.getState().play('startGame');
  }
};

export const NextQuestion = () => {
  GetSocket().emit('Room:NextQuestion', { roomName: 'Wedding' });
};
