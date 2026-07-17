import { GetSocket } from '../client';

import { IServerManagerLogin } from '../../types/server-response';
import { SessionState } from '../../types/session';
import { useSessionStore } from '../../stores/sessionStore';
import { useRoomStore } from '../../stores/roomStore';

export const ManagerLogin = () => {
  GetSocket().emit('Manager:Login', { managerId: 'Yu' });
};

export const OnManagerLogin = () => {
  GetSocket().on('Manager:Login', (data: IServerManagerLogin) => {
    console.log('Manager logged in:', data.managerId);

    const { roomId } = useRoomStore.getState().room;
    if (roomId) {
      useSessionStore.getState().setState(SessionState.InRoom);
      return;
    }

    useSessionStore.getState().setState(SessionState.LoggedIn);
  });
};
