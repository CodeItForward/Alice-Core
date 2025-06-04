import React, { useState } from 'react';

const channels = [
  { id: 'general', name: 'General' },
  { id: 'random', name: 'Random' },
  { id: 'announcements', name: 'Announcements' },
];

const initialMessages = {
  general: [
    { id: 1, user: 'Alice', text: 'Welcome to the General channel!', time: '09:00' },
    { id: 2, user: 'Bob', text: 'Hi everyone!', time: '09:01' },
    { id: 3, user: 'Carol', text: 'Good morning!', time: '09:02' },
  ],
  random: [
    { id: 1, user: 'Dave', text: 'Random thoughts go here.', time: '09:10' },
  ],
  announcements: [
    { id: 1, user: 'Admin', text: 'Project kickoff at 10am!', time: '08:55' },
  ],
};

const AiForGoodPage: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => ({
      ...prev,
      [selectedChannel]: [
        ...prev[selectedChannel],
        { id: Date.now(), user: 'You', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ],
    }));
    setInput('');
  };

  return (
    <div className="flex h-full bg-gray-50" style={{ minHeight: '500px' }}>
      {/* Channels sidebar */}
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 font-bold text-lg border-b border-gray-100">Channels</div>
        <ul className="flex-1 overflow-auto">
          {channels.map(channel => (
            <li key={channel.id}>
              <button
                className={`w-full text-left px-4 py-2 hover:bg-purple-50 ${selectedChannel === channel.id ? 'bg-purple-100 font-semibold' : ''}`}
                onClick={() => setSelectedChannel(channel.id)}
              >
                # {channel.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Chat area */}
      <div className="flex flex-col flex-1 h-full">
        <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center">
          <span className="font-bold text-xl"># {channels.find(c => c.id === selectedChannel)?.name}</span>
        </div>
        <div className="flex-1 overflow-auto px-6 py-4 space-y-4 bg-gray-50" style={{ minHeight: 0 }}>
          {messages[selectedChannel].map(msg => (
            <div key={msg.id} className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-full bg-purple-200 flex items-center justify-center font-bold text-purple-700">
                {msg.user[0]}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{msg.user}</span>
                  <span className="text-xs text-gray-400">{msg.time}</span>
                </div>
                <div className="text-gray-800">{msg.text}</div>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="px-6 py-4 bg-white border-t border-gray-200 flex items-center">
          <input
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            type="text"
            placeholder={`Message #${channels.find(c => c.id === selectedChannel)?.name}`}
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
  );
};

export default AiForGoodPage; 