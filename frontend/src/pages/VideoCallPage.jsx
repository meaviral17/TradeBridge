import React, { useEffect, useState } from 'react';
import {
  StreamVideoClient, StreamVideo, StreamCall,
  StreamTheme, SpeakerLayout, CallControls,
  CallingState, useCallStateHooks
} from '@stream-io/video-react-sdk';
import axios from 'axios';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

function VideoCallPage() {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStreamTokenAndJoin = async () => {
      const jwt = localStorage.getItem("token");
      if (!jwt) return alert("No token found");

      try {
        const res = await axios.get("http://localhost:8080/api/stream/token", {
          headers: { Authorization: `Bearer ${jwt}` }
        });

        const { token, userId } = res.data;
        const client = new StreamVideoClient({
          apiKey: 'YOUR_STREAM_API_KEY', // Replace
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

  const particlesInit = async (main) => await loadFull(main);

  if (loading || !call || !client)
    return <div className="p-6 text-white">🔄 Connecting to Stream Video...</div>;

  return (
    <div className="relative min-h-screen pt-16 text-white bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <Particles
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          particles: {
            number: { value: 90 },
            color: { value: "#ffffff" },
            links: {
              enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1
            },
            move: { enable: true, speed: 0.5, outModes: { default: "bounce" } },
            opacity: { value: 0.6, animation: { enable: true, speed: 0.5, minimumValue: 0.2 } },
            size: { value: { min: 1, max: 2.5 } },
          },
          interactivity: {
            events: { onHover: { enable: true, mode: "grab" } },
            modes: { grab: { distance: 150, line_linked: { opacity: 0.4 } } }
          }
        }}
        className="absolute inset-0 z-0"
      />
      <div className="relative z-10">
        <StreamVideo client={client}>
          <StreamCall call={call}>
            <StreamTheme>
              <CallUI />
            </StreamTheme>
          </StreamCall>
        </StreamVideo>
      </div>
    </div>
  );
}

function CallUI() {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED)
    return <div className="p-6 text-white">Joining call...</div>;

  return (
    <div className="h-[calc(100vh-4rem)]">
      <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls />
    </div>
  );
}

export default VideoCallPage;
