import { useEffect, useState } from "react";
import io from "socket.io-client";

// ✅ Get token from localStorage
const token = localStorage.getItem("token");

// ✅ Connect to socket with token in auth handshake
const socket = io("http://localhost:3001", {
  auth: { token },
});

function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  //const [username] = useState("User" + Math.floor(Math.random() * 1000));

  useEffect(() => {
    socket.on("chatMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("chatMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chatMessage", message); // ✅ Send just text
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
            className="px-4 py-2 text-white rounded bg-primary"
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
