import { GetSocket } from '../client';

import { IServerManagerLogin } from '../../types/server-response';
import { SessionState } from '../../types/session';
import { useSessionStore } from '../../stores/sessionStore';

export const ManagerLogin = () => {
  GetSocket().emit('Manager:Login', { managerId: 'Yu' });
};

export const OnManagerLogin = () => {
  GetSocket().on('Manager:Login', (data: IServerManagerLogin) => {
    useSessionStore.getState().setState(SessionState.LoggedIn);
    console.log('Manager logged in:', data.managerId);
  });
};
