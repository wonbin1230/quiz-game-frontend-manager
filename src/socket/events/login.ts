import { GetSocket } from '../client';

import { ClientState } from '../../types/client-state';
import { useClientStateStore } from '../../stores/clientStateStore';

export const ManagerLogin = () => {
  GetSocket().emit('Manager:Login', { managerId: 'Yu' });
};

export const OnManagerLogin = () => {
  GetSocket().on('Manager:Login', (data) => {
    useClientStateStore.getState().setState(ClientState.LoggedIn);
    console.log('Manager logged in:', data.managerId);
  });
};