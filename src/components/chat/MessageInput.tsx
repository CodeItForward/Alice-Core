import React, { useState } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import { useMessages } from '../../context/MessageContext';

const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const { addMessage } = useMessages();
  
  const handleSubmit = (e: React.FormEvent) => {
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
      
      // Simulate AI response after a short delay
      setTimeout(() => {
        addMessage({
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          content: `I'm Alice, your NYU AI assistant. How can I help you with "${message.trim()}"?`,
          timestamp: new Date()
        });
      }, 1000);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end rounded-lg border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent">
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <Paperclip size={20} />
        </button>
        
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask Alice a question..."
          className="flex-grow px-3 py-2 bg-transparent outline-none resize-none max-h-32"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <Mic size={20} />
        </button>
        
        <button
          type="submit"
          disabled={!message.trim()}
          className={`p-2 mr-1 rounded-md ${
            message.trim()
              ? 'text-white bg-purple-600 hover:bg-purple-700'
              : 'text-gray-400 bg-gray-200'
          } transition-colors duration-200`}
        >
          <Send size={18} />
        </button>
      </div>
    </form>
  );
};

export default MessageInput;