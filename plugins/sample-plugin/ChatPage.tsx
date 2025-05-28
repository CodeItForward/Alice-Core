import React from 'react';
import PluginChatContainer from './PluginChatContainer';
import { MessageProvider } from '../../core/context/MessageContext';

const ChatPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <MessageProvider>
        <PluginChatContainer 
          header="Welcome to the Sample Plugin Chat!"
          subheader="This chat is fully customizable from the plugin code."
        />
      </MessageProvider>
    </div>
  );
};

export default ChatPage; 