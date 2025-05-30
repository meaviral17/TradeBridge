import React, { useEffect, useState } from 'react';
import { StreamCall, StreamTheme, SpeakerLayout } from '@stream-io/video-react-sdk';
import { Chat, Channel, Window, MessageList, MessageInput } from 'stream-chat-react';
import { useParams } from 'react-router-dom';
import 'stream-chat-react/dist/css/v2/index.css';

function RoomPage({ videoClient, chatClient }) {
  const { roomId } = useParams();
  const [call, setCall] = useState(null);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    if (!videoClient || !chatClient || !roomId) return;
  
    let currentCall = null;
  
    const setupRoom = async () => {
      currentCall = videoClient.call('default', roomId);
      await currentCall.join();
      setCall(currentCall);
  
      const chatChannel = chatClient.channel('messaging', roomId, {
        members: [chatClient.user.id],
      });
      await chatChannel.watch();
      setChannel(chatChannel);
    };
  
    setupRoom();
  
    return () => {
      if (currentCall) currentCall.leave();
      if (chatClient) chatClient.disconnectUser();
    };
  }, [videoClient, chatClient, roomId]);
  

  if (!call || !channel) return <p className="p-6">🔄 Joining room...</p>;

  return (
    <StreamTheme>
      <div className="flex h-screen">
        <div className="flex-1 border-r">
          <StreamCall call={call}>
            <SpeakerLayout />
          </StreamCall>
        </div>
        <div className="w-[400px]">
          <Chat client={chatClient}>
            <Channel channel={channel}>
              <Window>
                <MessageList />
                <MessageInput />
              </Window>
            </Channel>
          </Chat>
        </div>
      </div>
    </StreamTheme>
  );
}

export default RoomPage;
