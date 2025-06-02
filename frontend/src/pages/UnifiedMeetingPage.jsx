import React, { useEffect, useRef } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

function UnifiedMeetingPage() {
  const room = "trade-room-1";
  const jitsiContainerRef = useRef(null);

  useEffect(() => {
    const domain = "meet.jit.si";
    const options = {
      roomName: room,
      parentNode: jitsiContainerRef.current,
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: true,
      },
    };
    new window.JitsiMeetExternalAPI(domain, options);
  }, []);

  const particlesInit = async (main) => await loadFull(main);

  return (
    <div className="relative min-h-screen pt-1 overflow-hidden text-white bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <Particles
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          particles: {
            number: { value: 80 },
            color: { value: "#ffffff" },
            links: {
              enable: true,
              distance: 140,
              color: "#ffffff",
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 0.6,
              outModes: { default: "bounce" },
            },
            opacity: { value: 0.5 },
            size: { value: { min: 1, max: 2 } },
          },
          interactivity: {
            events: { onHover: { enable: true, mode: "grab" } },
            modes: { grab: { distance: 140 } },
          },
        }}
        className="absolute inset-0 z-0"
      />

      <div className="relative z-10 p-3">
        <h2 className="mb-2 text-2xl font-bold text-green-400">
          🧑‍💼 Meeting Room: <span className="text-blue-400">{room}</span>
        </h2>

        <div
          className="w-full overflow-hidden border rounded shadow-lg"
          style={{ height: "600px" }}
          ref={jitsiContainerRef}
        />
      </div>
    </div>
  );
}

export default UnifiedMeetingPage;
