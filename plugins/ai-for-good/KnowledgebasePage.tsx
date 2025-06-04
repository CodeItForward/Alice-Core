import React, { useState } from 'react';

const categories = [
  'Getting Started',
  'Project Management',
  'AI Tools',
  'Best Practices',
];

const articles = [
  { id: 1, category: 'Getting Started', title: 'How to join a project', content: 'To join a project, ask your team lead for an invite.' },
  { id: 2, category: 'AI Tools', title: 'Using the AI Chat', content: 'The AI chat can answer your questions about the platform.' },
];

const KnowledgebasePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hi! I am your Knowledgebase AI. How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: input },
      { sender: 'ai', text: 'This is a placeholder AI response. (Integrate with OpenAI or other LLM here.)' },
    ]);
    setInput('');
  };

  return (
    <div className="flex h-full bg-gray-50" style={{ minHeight: '500px' }}>
      {/* Sidebar */}
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 font-bold text-lg border-b border-gray-100">Categories</div>
        <ul className="flex-1 overflow-auto">
          {categories.map(cat => (
            <li key={cat}>
              <button
                className={`w-full text-left px-4 py-2 hover:bg-purple-50 ${selectedCategory === cat ? 'bg-purple-100 font-semibold' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full">
        <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center">
          <span className="font-bold text-xl">{selectedCategory}</span>
        </div>
        <div className="flex-1 overflow-auto px-6 py-4 space-y-4 bg-gray-50">
          {articles.filter(a => a.category === selectedCategory).length === 0 ? (
            <div className="text-gray-500">No articles in this category yet.</div>
          ) : (
            articles.filter(a => a.category === selectedCategory).map(article => (
              <div key={article.id} className="mb-6">
                <div className="text-lg font-semibold mb-1">{article.title}</div>
                <div className="text-gray-700 text-sm">{article.content}</div>
              </div>
            ))
          )}
        </div>
        {/* AI Chat */}
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="max-h-48 overflow-y-auto mb-2 space-y-2">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}>{msg.text}</div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              type="text"
              placeholder="Ask the AI..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-purple-700 transition"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KnowledgebasePage; 