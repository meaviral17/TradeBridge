import React, { useEffect, useRef, useState, useCallback } from 'react';
import Peer from 'simple-peer';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WS_URL = 'http://localhost:8080/ws';

function VideoCallPage({ token }) {
  const [room] = useState("room1");
  const [connected, setConnected] = useState(false);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  const stompClient = useRef();
  const peerRef = useRef();
  const myVideo = useRef();
  const userVideo = useRef();

  useEffect(() => {
    const socket = new SockJS(WS_URL);
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => {
        console.log("🟢 Connected to STOMP");
        client.subscribe(`/topic/signals/${room}`, (msg) => {
          const data = JSON.parse(msg.body);
          handleSignal(data);
        });
        sendSignal({ type: "join", room });
      },
    });
    client.activate();
    stompClient.current = client;
  
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      myVideo.current.srcObject = stream;
    });
  
    return () => {
      client.deactivate();
    };
  }, [token, room, handleSignal]); // ✅ added handleSignal
  

  const sendSignal = (payload) => {
    stompClient.current.publish({
      destination: "/app/signal",
      body: JSON.stringify(payload),
    });
  };

  const handleSignal = useCallback((data) => {
    if (data.sender === token) return;
  
    if (data.type === "offer") {
      const peer = new Peer({ initiator: false, trickle: false, stream: myVideo.current.srcObject });
      peer.on("signal", signal => sendSignal({ ...signal, type: "answer", room, sender: token }));
      peer.on("stream", stream => userVideo.current.srcObject = stream);
      peer.signal(JSON.parse(data.payload));
      peerRef.current = peer;
      setConnected(true);
    } else if (data.type === "answer") {
      peerRef.current?.signal(JSON.parse(data.payload));
      setConnected(true);
    }
  }, [room, token]);
  

  const callUser = () => {
    const peer = new Peer({ initiator: true, trickle: false, stream: myVideo.current.srcObject });
    peer.on("signal", signal => {
      sendSignal({ type: "offer", payload: JSON.stringify(signal), room, sender: token });
    });
    peer.on("stream", stream => userVideo.current.srcObject = stream);
    peerRef.current = peer;
  };

  const toggleMute = () => {
    const newState = !muted;
    setMuted(newState);
    myVideo.current.srcObject.getAudioTracks()[0].enabled = !newState;
  };

  const toggleVideo = () => {
    const off = !videoOff;
    setVideoOff(off);
    myVideo.current.srcObject.getVideoTracks()[0].enabled = !off;
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];
      const sender = peerRef.current._pc.getSenders().find(s => s.track.kind === 'video');
      sender.replaceTrack(screenTrack);
      myVideo.current.srcObject = screenStream;

      screenTrack.onended = async () => {
        const camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const camTrack = camStream.getVideoTracks()[0];
        sender.replaceTrack(camTrack);
        myVideo.current.srcObject = camStream;
      };
    } catch (err) {
      console.error("Screen share error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="mb-4 text-xl font-bold text-primary">📹 TradeBridge Video Call</h1>
      <div className="grid w-full max-w-6xl grid-cols-3 gap-4">
        <div className="flex col-span-2 gap-4">
          <div>
            <p className="mb-1 text-sm font-semibold">My Video</p>
            <video ref={myVideo} autoPlay muted playsInline className="w-64 h-40 bg-black rounded" />
          </div>
          <div>
            <p className="mb-1 text-sm font-semibold">Remote Video</p>
            <video ref={userVideo} autoPlay playsInline className="w-64 h-40 bg-black rounded" />
          </div>
        </div>
        <div className="col-span-1 p-3 overflow-y-auto bg-white border rounded h-80">
          <h2 className="mb-2 font-bold text-md">💬 Chat</h2>
          <div className="flex flex-col gap-1 mb-2 overflow-y-auto text-sm max-h-56">
            {chat.map((c, i) => (
              <div key={i}><strong>{c.from}:</strong> {c.message}</div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 px-2 py-1 border rounded"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setChat([...chat, { from: 'You', message }])}
              placeholder="Type a message"
            />
            <button onClick={() => setChat([...chat, { from: 'You', message }])} className="px-2 py-1 text-white bg-blue-500 rounded">
              Send
            </button>
          </div>
        </div>
      </div>

      {!connected && (
        <div className="flex flex-col items-center mt-4">
          <button onClick={callUser} className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">📞 Call</button>
        </div>
      )}

      {connected && (
        <div className="flex gap-3 mt-4">
          <button onClick={toggleMute} className="px-4 py-1 text-white bg-blue-600 rounded">
            {muted ? "🎙 Unmute" : "🔇 Mute"}
          </button>
          <button onClick={toggleVideo} className="px-4 py-1 text-white bg-blue-600 rounded">
            {videoOff ? "🎥 Turn Video On" : "📷 Turn Video Off"}
          </button>
          <button onClick={startScreenShare} className="px-4 py-1 text-white bg-purple-600 rounded">
            🖥 Share Screen
          </button>
        </div>
      )}
    </div>
  );
}

export default VideoCallPage;
