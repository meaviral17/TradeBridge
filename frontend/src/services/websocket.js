import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient = null;

export const connectWebSocket = (onMessageReceived) => {
  const socket = new SockJS('https://tradebridge.onrender.com/ws');
  stompClient = Stomp.over(socket);

  stompClient.connect({}, (frame) => {
    console.log('Connected: ' + frame);
    stompClient.subscribe('/topic/trades', (message) => {
      const trade = JSON.parse(message.body);
      onMessageReceived(trade);
    });
  });
};

export const disconnectWebSocket = () => {
  if (stompClient !== null) {
    stompClient.disconnect(() => {
      console.log('Disconnected');
    });
  }
};
