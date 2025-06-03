import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const WS_URL = "https://tradebridge.onrender.com/ws";
const token = localStorage.getItem("token");

function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const clientRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS(WS_URL);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        console.log("✅ Connected to chat");
        client.subscribe("/topic/chat", (msg) => {
          const data = JSON.parse(msg.body);
          setMessages((prev) => [...prev, data]);
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      clientRef.current.publish({
        destination: "/app/chat",
        body: JSON.stringify({ message }),
      });
      setMessages((prev) => [...prev, { username: "You", message }]);
      setMessage("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-bold text-primary">💬 TradeBridge Chat</h2>
        <div className="h-64 p-2 mb-3 overflow-y-auto bg-gray-100 rounded">
          {messages.map((msg, i) => (
            <div key={i} className="mb-1 text-sm">
              <span className="font-semibold text-primary">{msg.username}</span>: {msg.message}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-grow px-3 py-2 border border-gray-300 rounded"
            type="text"
            value={message}
            placeholder="Type your message..."
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
