import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MessageType } from '../types/message';

interface MessageContextType {
  messages: MessageType[];
  addMessage: (message: MessageType) => void;
  clearMessages: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  
  const addMessage = (message: MessageType) => {
    setMessages(prev => [...prev, message]);
  };
  
  const clearMessages = () => {
    setMessages([]);
  };
  
  return (
    <MessageContext.Provider value={{ messages, addMessage, clearMessages }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};