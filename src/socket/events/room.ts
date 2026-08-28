import { GetSocket } from '../client';

import { IServerCreateRoom, IServerUserJoined, IServerUserLeft } from '../../types/server-response';
import { SessionState } from '../../types/session';
import { DanmakuSystemType } from '../../types/danmaku';
import { GamePhase } from '../../types/game';

import { useSessionStore } from '../../stores/sessionStore';
import { useRoomStore } from '../../stores/roomStore';
import { usePlayerCountStore, usePlayerListStore } from '../../stores/playerStore';
import { useDanmakuStore } from '../../stores/danmakuStore';
import { useGameStore } from '../../stores/gameStore';
import { useSceneTransitionStore } from '../../stores/enterRoomTransitionStore';
import { TRANSITION_BY_STAGE } from '../../transitions/config';

/** Prepare 改名：Left 後極短時間內會接到 Joined。超過此時窗才當成真離房。 */
const RENAME_MATCH_MS = 200;

type PendingLeave = {
  userId: string,
  userCount: number,
  timer: ReturnType<typeof setTimeout>,
};

let pendingLeave: PendingLeave | null = null;

const applyUserPresence = (data: { userList: string[], userCount: number }) => {
  usePlayerListStore.getState().setList(data.userList);
  usePlayerCountStore.getState().setCount(data.userCount);
};

const isPreparePhase = () => useGameStore.getState().phase === GamePhase.Idle;

const addJoinDanmaku = (userId: string) => {
  useDanmakuStore.getState().addItem({
    sender: userId,
    systemType: DanmakuSystemType.PlayerJoin,
    content: '已加入房間',
    bonusContent: '',
  });
};

const addLeaveDanmaku = (userId: string) => {
  useDanmakuStore.getState().addItem({
    sender: userId,
    systemType: DanmakuSystemType.PlayerLeave,
    content: '已離開房間',
    bonusContent: '',
  });
};

const discardPendingLeave = () => {
  if (!pendingLeave) return;
  clearTimeout(pendingLeave.timer);
  pendingLeave = null;
};

const flushPendingLeave = () => {
  if (!pendingLeave) return;
  const { userId } = pendingLeave;
  discardPendingLeave();
  addLeaveDanmaku(userId);
};

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
    applyUserPresence(data);

    const isRename =
      pendingLeave !== null &&
      isPreparePhase() &&
      data.userCount === pendingLeave.userCount + 1;

    if (isRename) {
      discardPendingLeave();
      return;
    }

    flushPendingLeave();
    addJoinDanmaku(data.userId);
  });
};

export const OnUserLeft = () => {
  GetSocket().on('Room:UserLeft', (data: IServerUserLeft) => {
    applyUserPresence(data);

    if (!isPreparePhase()) {
      flushPendingLeave();
      addLeaveDanmaku(data.userId);
      return;
    }

    flushPendingLeave();
    pendingLeave = {
      userId: data.userId,
      userCount: data.userCount,
      timer: setTimeout(() => {
        pendingLeave = null;
        addLeaveDanmaku(data.userId);
      }, RENAME_MATCH_MS),
    };
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

export const FinishGame = () => {
  GetSocket().emit('Room:FinishGame', { roomName: 'Wedding' });
};
