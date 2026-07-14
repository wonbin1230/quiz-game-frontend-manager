import io, { Socket } from 'socket.io-client';
import { ClientState } from '../types/client-state';
import { useClientStateStore } from '../stores/clientStateStore';
import { ManagerLogin } from './events/login';

const socketUrl = `${import.meta.env.VITE_SERVER_SOCKET_URL}:${import.meta.env.VITE_SERVER_SOCKET_PORT}`;

let clientIO: Socket | null = null;

export const ConnectToServer = () => {
  if (clientIO) {
    return clientIO;
  }

  clientIO = io(socketUrl, {
    query: {
      system: 'Manager',
    },
    transports: ['websocket'],
  });

  clientIO.on('connect', () => {
    ManagerLogin();
    useClientStateStore.setState(() => ({ state: ClientState.ServerConnected }));
    console.log('Connected to server');
  });

  clientIO.on('disconnect', () => {
    console.log('Disconnected from server');
  });
};

export const GetSocket = () => {
  if (!clientIO) {
    throw new Error('Socket not connected');
  }

  return clientIO;
};