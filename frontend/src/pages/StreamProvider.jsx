import { StreamVideoClient } from "@stream-io/video-client";
import {
  StreamVideo,
  StreamVideoProvider,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export default function StreamWrapper({ children, userId, token }) {
  const [client, setClient] = useState(null);
  const apiKey = import.meta.env.VITE_STREAM_API_KEY;

  useEffect(() => {
    if (!userId || !token) return;
    const client = new StreamVideoClient({
      apiKey,
      user: { id: userId },
      token,
    });
    setClient(client);
  }, [userId, token, apiKey]);

  if (!client) return <div>🔄 Connecting to Stream...</div>;

  return (
    <StreamVideo client={client}>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </StreamVideo>
  );
}
