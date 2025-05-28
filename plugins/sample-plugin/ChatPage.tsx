import React from 'react';
import ChatContainer from '../../core/chat/ChatContainer';
import { MessageProvider } from '../../core/context/MessageContext';

const ChatPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <MessageProvider>
        <ChatContainer />
      </MessageProvider>
    </div>
  );
};

export default ChatPage; 