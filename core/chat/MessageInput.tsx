import React, { useState } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import { useMessages } from '../context/MessageContext';

interface MessageInputProps {
  openAIApiKey?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ openAIApiKey }) => {
  const [message, setMessage] = useState('');
  const { addMessage } = useMessages();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      // Add user message
      addMessage({
        id: Date.now().toString(),
        sender: 'user',
        content: message.trim(),
        timestamp: new Date()
      });
      
      // Clear input
      setMessage('');

      // Regular text response
      setTimeout(() => {
        const responseMessage = openAIApiKey && openAIApiKey !== 'YOUR_OPENAI_KEY' 
          ? `I'm Alice, your AI assistant with OpenAI integration. How can I help you with "${message.trim()}"?`
          : `I'm Alice, your NYU AI assistant. How can I help you with "${message.trim()}"? (Note: OpenAI integration not configured)`;
          
        addMessage({
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          content: responseMessage,
          timestamp: new Date()
        });
      }, 1000);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center h-10 rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent">
        <button
          type="button"
          className="p-2 h-full text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <Paperclip size={18} />
        </button>
        
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask Alice a question..."
          className="flex-grow px-3 py-0 h-full bg-transparent outline-none resize-none min-h-0 text-sm"
          rows={1}
          style={{ lineHeight: '1.5', paddingTop: 0, paddingBottom: 0, margin: 0 }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        
        <button
          type="button"
          className="p-2 h-full text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <Mic size={18} />
        </button>
        
        <button
          type="submit"
          disabled={!message.trim()}
          className={`p-2 h-full mr-1 rounded-md ${
            message.trim()
              ? 'text-white bg-purple-600 hover:bg-purple-700'
              : 'text-gray-400 bg-gray-200'
          } transition-colors duration-200`}
        >
          <Send size={16} />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;