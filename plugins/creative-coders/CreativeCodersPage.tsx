import React from 'react';
import PluginChatContainer from '../sample-plugin/PluginChatContainer';
import { MessageProvider } from '../../core/context/MessageContext';

const CreativeCodersPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <MessageProvider>
        <PluginChatContainer 
          header="Welcome to the Creative Coders Chat!"
          subheader="This chat is exclusive to Creative Coders."
        />
      </MessageProvider>
    </div>
  );
};

export default CreativeCodersPage; 