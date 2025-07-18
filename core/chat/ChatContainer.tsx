import React, { useRef, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useMessages } from '../context/MessageContext';
import { useAuth } from '../context/AuthContext';

interface ChatContainerProps {
  openAIApiKey?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ openAIApiKey }) => {
  const { messages } = useMessages();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get personal team/channel IDs for the current user
  const personalTeamId = user?.PersonalTeamId;
  const personalChannelId = user?.PersonalChannelId;

  // For debugging, log the IDs
  useEffect(() => {
    if (personalTeamId && personalChannelId) {
      console.log('Using personal chat:', { personalTeamId, personalChannelId });
    }
  }, [personalTeamId, personalChannelId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Log the OpenAI API key for debugging (in production, don't log sensitive data)
  useEffect(() => {
    if (openAIApiKey) {
      console.log('ChatContainer initialized with OpenAI API key:', openAIApiKey.substring(0, 10) + '...');
    }
  }, [openAIApiKey]);
  
  return (
    <div className="flex flex-col h-full max-h-full">
      <div className="flex-grow overflow-y-auto px-4 py-6 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="py-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Welcome to Alice
            </h2>
            <p className="text-gray-600 mb-6">
              NYU's AI assistant to help you with documentation, tickets, and reports.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
              <QuickActionButton label="Find a policy" />
              <QuickActionButton label="Report an issue" />
              <QuickActionButton label="Schedule meeting" />
              <QuickActionButton label="Generate report" />
            </div>
          </div>
          
          <MessageList />
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-2 border-t border-gray-200 bg-white bg-blue-200" style={{ padding: 16 }}>
        <div className="max-w-3xl mx-auto">
          <MessageInput openAIApiKey={openAIApiKey} />
        </div>
      </div>
    </div>
  );
};

const QuickActionButton: React.FC<{ label: string }> = ({ label }) => {
  const handleClick = () => {
    // Placeholder functionality removed - button is now just a visual element
    console.log(`Clicked: ${label}`);
  };
  
  return (
    <button 
      onClick={handleClick}
      className="py-2 px-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200 text-left text-sm"
    >
      {label}
    </button>
  );
};

export default ChatContainer;