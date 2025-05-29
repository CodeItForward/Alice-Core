import React, { useRef, useEffect } from 'react';
import MessageList from '../../core/chat/MessageList';
import MessageInput from '../../core/chat/MessageInput';
import { useMessages } from '../../core/context/MessageContext';

interface PluginChatContainerProps {
  header?: string;
  subheader?: string;
  openAIApiKey?: string;
}

const PluginChatContainer: React.FC<PluginChatContainerProps> = ({ header, subheader, openAIApiKey }) => {
  const { messages } = useMessages();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-h-full">
      <div className="flex-grow overflow-y-auto px-4 py-6 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {(header || subheader) && (
            <div className="py-6 text-center">
              {header && (
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{header}</h2>
              )}
              {subheader && (
                <p className="text-gray-600 mb-6">{subheader}</p>
              )}
            </div>
          )}
          <MessageList />
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-2 border-t border-gray-200 bg-white" style={{ padding: 16 }}>
        <div className="max-w-3xl mx-auto">
          <MessageInput openAIApiKey={openAIApiKey} />
        </div>
      </div>
    </div>
  );
};

export default PluginChatContainer; 