import React, { useRef, useEffect, useState } from 'react';
import Peer from 'simple-peer';
import { io } from 'socket.io-client';

function VideoCallPage({ token }) {
  const [myId, setMyId] = useState('');
  const [remoteId, setRemoteId] = useState('');
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const socket = useRef();

  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      auth: { token }
    });
    socket.current = newSocket;
  
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      myVideo.current.srcObject = stream;
  
      newSocket.on('your-id', id => setMyId(id));
      newSocket.on('all-users', (userIds) => setOnlineUsers(userIds));
  
      newSocket.on('call-made', ({ signal, from }) => {
        const peer = new Peer({ initiator: false, trickle: false, stream });
  
        peer.on('signal', signal => {
          newSocket.emit('answer-call', { signal, to: from });
        });
  
        peer.on('stream', remoteStream => {
          userVideo.current.srcObject = remoteStream;
        });
  
        peer.signal(signal);
        connectionRef.current = peer;
        setConnected(true);
      });
  
      newSocket.on('call-answered', data => {
        connectionRef.current?.signal(data.signal);
      });
  
      // ✅ MESSAGE HANDLER — add this regardless of who initiates
      newSocket.on('receive-message', ({ message, from }) => {
        setChat(prev => [...prev, { from, message }]);
      });
    });
  
    return () => {
      newSocket.disconnect();
    };
  }, [token]);
  

  const callUser = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      const peer = new Peer({ initiator: true, trickle: false, stream });

      peer.on('signal', signal => {
        socket.current.emit('call-user', {
          userToCall: remoteId,
          signalData: signal,
          from: myId
        });
      });

      peer.on('stream', remoteStream => {
        userVideo.current.srcObject = remoteStream;
      });

      socket.current.on('call-answered', data => {
        peer.signal(data.signal);
        setConnected(true);
      });

      connectionRef.current = peer;
    });
  };

  const toggleMute = () => {
    const enabled = !muted;
    setMuted(enabled);
    myVideo.current.srcObject.getAudioTracks()[0].enabled = !enabled;
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
      const sender = connectionRef.current._pc.getSenders().find(s => s.track.kind === 'video');
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

  const sendMessage = () => {
    if (!message.trim()) return;
    setChat(prev => [...prev, { from: 'You', message }]);
    socket.current.emit('send-message', { message, from: myId });
    setMessage('');
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
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message"
            />
            <button onClick={sendMessage} className="px-2 py-1 text-white bg-blue-500 rounded">
              Send
            </button>
          </div>
        </div>
      </div>

      {!connected && (
        <div className="flex flex-col items-center mt-4">
          <select className="w-64 px-3 py-2 mb-3 border rounded" onChange={(e) => setRemoteId(e.target.value)} defaultValue="">
            <option value="" disabled>Select a user to call</option>
            {onlineUsers.map(id => <option key={id} value={id}>{id}</option>)}
          </select>
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
