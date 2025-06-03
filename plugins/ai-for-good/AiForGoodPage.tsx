import React from 'react';
import PluginChatContainer from '../sample-plugin/PluginChatContainer';
import { MessageProvider } from '../../core/context/MessageContext';

const AiForGoodPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <MessageProvider>
        <PluginChatContainer 
          header="Welcome to the AI for Good Chat!"
          subheader="This chat is exclusive to AI for Good members."
        />
      </MessageProvider>
    </div>
  );
};

export default AiForGoodPage; 