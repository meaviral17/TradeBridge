import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const URL = 'http://localhost:8080/ws';

export const connectStomp = (onMessage) => {
  const socket = new SockJS(URL);
  const client = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("🔌 Connected to STOMP");
      client.subscribe('/topic/signals/room1', (msg) => {
        const data = JSON.parse(msg.body);
        onMessage(data);
      });
    },
  });
  client.activate();
  return client;
};
