import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { StreamChat } from 'stream-chat';
import { getStreamToken } from './streamToken'; // ✅ Adjust path if needed

const apiKey = import.meta.env.VITE_STREAM_API_KEY || "d7aeudqjk8n9"; // fallback to default

export const initStream = async (jwtToken) => {
  try {
    const { token, userId } = await getStreamToken(jwtToken);

    // ✅ Chat client
    const chatClient = StreamChat.getInstance(apiKey);
    await chatClient.connectUser(
      { id: userId, name: userId },
      token
    );

    // ✅ Video client
    const videoClient = new StreamVideoClient({
      apiKey,
      user: { id: userId, name: userId },
      token,
    });

    return { videoClient, chatClient, userId };
  } catch (error) {
    console.error("❌ Failed to initialize Stream:", error);
    throw error;
  }
};
