import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { StreamChat } from 'stream-chat';
import { getStreamToken } from './streamToken'; // ✅ adjust the path if needed

const apiKey = "d7aeudqjk8n9"; // ✅ Your real key from application.properties

export const initStream = async (jwtToken) => {
  const { token, userId } = await getStreamToken(jwtToken);

  const chatClient = new StreamChat(apiKey);
  await chatClient.connectUser({ id: userId, name: userId }, token);

  const videoClient = new StreamVideoClient({
    apiKey,
    user: { id: userId, name: userId },
    token,
  });

  return { videoClient, chatClient, userId };
};
