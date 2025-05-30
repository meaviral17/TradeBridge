import React, { useEffect, useState } from 'react';
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  StreamTheme,
  SpeakerLayout,
  CallControls,
  CallingState,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import axios from 'axios';

function VideoCallPage() {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreamTokenAndJoin = async () => {
      const jwt = localStorage.getItem("token");
      if (!jwt) {
        alert("No token found");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8080/api/stream/token", {
          headers: { Authorization: `Bearer ${jwt}` }
        });

        const { token, userId } = res.data;

        const client = new StreamVideoClient({
          apiKey: 'YOUR_STREAM_API_KEY', // ✅ REPLACE
          user: { id: userId },
          token
        });

        const newCall = client.call('default', 'room1');
        await newCall.join({ create: true });

        setClient(client);
        setCall(newCall);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("❌ Failed to connect to video");
      }
    };

    fetchStreamTokenAndJoin();
  }, []);

  if (loading || !call || !client) return <div className="p-6">🔄 Connecting to Stream Video...</div>;

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <StreamTheme>
          <CallUI />
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
}

function CallUI() {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) return <div className="p-6">Joining call...</div>;

  return (
    <div className="h-screen">
      <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls />
    </div>
  );
}

export default VideoCallPage;
