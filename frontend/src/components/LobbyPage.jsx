import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { StreamChat } from 'stream-chat';

// Utility to decode JWT
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

function LobbyPage({ token }) {
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const joinRoom = async () => {
    if (!roomId || !token) return;

    setLoading(true);

    const payload = parseJwt(token);
    const userId = payload?.sub;

    if (!userId) {
      alert("⚠️ Invalid token or user not found");
      return;
    }

    // Fetch Stream token securely
    const res = await axios.get('http://localhost:8080/api/stream/token', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const { token: streamToken } = res.data;
    const apiKey = 'd7aeudqjk8n9';

    // Setup Stream clients
    const chatClient = new StreamChat(apiKey);
    await chatClient.connectUser({ id: userId, name: userId }, streamToken);

    const videoClient = new StreamVideoClient({
      apiKey,
      user: { id: userId, name: userId },
      token: streamToken
    });

    navigate(`/room/${roomId}`, {
      state: { videoClient, chatClient }
    });
  };

  return (
    <div className="max-w-md p-6 mx-auto text-center">
      <h2 className="mb-4 text-2xl font-bold">🎥 Join a Room</h2>
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded"
      />
      <button onClick={joinRoom} disabled={loading} className="px-4 py-2 text-white bg-blue-600 rounded">
        {loading ? "Joining..." : "Join Room"}
      </button>
    </div>
  );
}

export default LobbyPage;
