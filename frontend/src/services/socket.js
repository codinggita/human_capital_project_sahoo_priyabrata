import { io } from 'socket.io-client';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SOCKET_URL = new URL(baseUrl).origin;

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});
