import React from 'react';
import Message from './Message';
import { useMessages } from '../../context/MessageContext';

const MessageList: React.FC = () => {
  const { messages } = useMessages();
  
  if (messages.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
        />
      ))}
    </div>
  );
};

export default MessageList;