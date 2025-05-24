import React, { useRef, useEffect, useState } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';

const socket = io("http://localhost:3001"); // ✅ Same server used for chat

function VideoCallPage() {
  const [myId, setMyId] = useState('');
  const [remoteId, setRemoteId] = useState('');
  const [connected, setConnected] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      myVideo.current.srcObject = stream;

      socket.on('your-id', id => {
        setMyId(id);
      });

      socket.on('call-made', ({ signal, from }) => {
        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on('signal', signal => {
          socket.emit('answer-call', { signal, to: from });
        });

        peer.on('stream', remoteStream => {
          userVideo.current.srcObject = remoteStream;
        });

        peer.signal(signal);
        connectionRef.current = peer;
        setConnected(true);
      });
    });
  }, []);

  const callUser = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      const peer = new Peer({ initiator: true, trickle: false, stream });

      peer.on('signal', signal => {
        socket.emit('call-user', { userToCall: remoteId, signalData: signal, from: myId });
      });

      peer.on('stream', remoteStream => {
        userVideo.current.srcObject = remoteStream;
      });

      socket.on('call-answered', data => {
        peer.signal(data.signal);
        setConnected(true);
      });

      connectionRef.current = peer;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <h1 className="mb-4 text-xl font-bold text-primary">📹 TradeBridge Video Call</h1>
      <div className="flex gap-4 mb-4">
        <div>
          <p className="text-sm font-semibold">My Video</p>
          <video ref={myVideo} autoPlay playsInline muted className="w-64 h-40 bg-black rounded" />
        </div>
        <div>
          <p className="text-sm font-semibold">Remote Video</p>
          <video ref={userVideo} autoPlay playsInline className="w-64 h-40 bg-black rounded" />
        </div>
      </div>
      {!connected && (
        <div className="flex flex-col items-center">
          <input
            className="px-3 py-2 mb-2 border rounded"
            value={remoteId}
            onChange={(e) => setRemoteId(e.target.value)}
            placeholder="Enter partner ID"
          />
          <button onClick={callUser} className="px-4 py-2 text-white rounded bg-primary">
            Call
          </button>
        </div>
      )}
    </div>
  );
}

export default VideoCallPage;
