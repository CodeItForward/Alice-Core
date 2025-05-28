import React from 'react';
import { MessageType } from '../../types/message';
import { Bot, User } from 'lucide-react';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 ${isUser ? 'ml-4' : 'mr-4'}`}>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-purple-100' : 'bg-blue-100'
          }`}>
            {isUser ? (
              <User size={16} className="text-purple-800" />
            ) : (
              <Bot size={16} className="text-blue-800" />
            )}
          </div>
        </div>
        
        <div>
          <div className={`rounded-2xl px-4 py-3 ${
            isUser 
              ? 'bg-purple-600 text-white rounded-tr-none' 
              : 'bg-white border border-gray-200 shadow-sm rounded-tl-none'
          }`}>
            <div className="text-sm">{message.content}</div>
          </div>
          
          <div className={`mt-1 text-xs text-gray-500 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

export default Message;