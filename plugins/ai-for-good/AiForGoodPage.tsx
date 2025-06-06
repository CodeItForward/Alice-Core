import React, { useState, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';

const channels = [
  { id: 'general', name: 'General' },
  { id: 'random', name: 'Random' },
  { id: 'announcements', name: 'Announcements' },
  { id: 'course', name: 'Course' },
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
  course: [
    { id: 1, user: 'Alice', text: 'Welcome to the Course channel! Mention @alice to ask me a question.', time: '09:00' },
  ],
};

const wsUrl = 'wss://restrictedchat.purplemeadow-b77df452.eastus.azurecontainerapps.io/alice/aiforgood/chat';

const getYouTubeId = (url: string) => {
  // Handles both youtu.be and youtube.com URLs
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
};

const AI_COLOR = 'bg-blue-200 text-blue-800';
const USER_COLOR = 'bg-purple-200 text-purple-700';
const OTHER_COLORS = [
  'bg-green-200 text-green-800',
  'bg-yellow-200 text-yellow-800',
  'bg-pink-200 text-pink-800',
  'bg-orange-200 text-orange-800',
  'bg-cyan-200 text-cyan-800',
  'bg-red-200 text-red-800',
  'bg-indigo-200 text-indigo-800',
  'bg-teal-200 text-teal-800',
];

function getOtherUserColor(name, taken) {
  // Deterministically assign a color based on name, skipping taken colors
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  let idx = Math.abs(hash) % OTHER_COLORS.length;
  let tries = 0;
  while (taken.has(idx) && tries < OTHER_COLORS.length) {
    idx = (idx + 1) % OTHER_COLORS.length;
    tries++;
  }
  taken.add(idx);
  return OTHER_COLORS[idx];
}

const AiForGoodPage: React.FC = () => {
  const { user } = useUser();
  const currentUserName = user?.firstName || user?.username || 'You';
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const wsRef = useRef<WebSocket | null>(null);
  const [waitingForAlice, setWaitingForAlice] = useState(false);
  const [playedVideos, setPlayedVideos] = useState<number[]>([]);

  // Build a map of user -> color for this channel
  const userColorMap = (() => {
    const taken = new Set();
    const map = {};
    messages[selectedChannel].forEach(msg => {
      if (msg.user === 'Alice') {
        map[msg.user] = AI_COLOR;
      } else if (msg.user === 'You' || msg.user === currentUserName) {
        map[msg.user] = USER_COLOR;
      }
    });
    messages[selectedChannel].forEach(msg => {
      if (!map[msg.user]) {
        map[msg.user] = getOtherUserColor(msg.user, taken);
      }
    });
    return map;
  })();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      user: 'You',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => ({
      ...prev,
      [selectedChannel]: [...prev[selectedChannel], newMsg],
    }));

    // If in #Course and message contains @alice, send to websocket
    if (selectedChannel === 'course' && /@alice/i.test(input)) {
      setWaitingForAlice(true);
      const ws = new window.WebSocket(wsUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({ message: input, username: 'You' }));
      };
      ws.onmessage = (event) => {
        setWaitingForAlice(false);
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'video') {
            setMessages(prev => ({
              ...prev,
              [selectedChannel]: [
                ...prev[selectedChannel],
                {
                  id: Date.now() + 1,
                  user: 'Alice',
                  text: data.message,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  video_url: data.video_url
                }
              ]
            }));
          } else if (data.type === 'text') {
            setMessages(prev => ({
              ...prev,
              [selectedChannel]: [
                ...prev[selectedChannel],
                {
                  id: Date.now() + 1,
                  user: 'Alice',
                  text: data.message,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ]
            }));
          }
        } catch {}
        ws.close();
      };
      ws.onerror = () => {
        setWaitingForAlice(false);
        setMessages(prev => ({
          ...prev,
          [selectedChannel]: [
            ...prev[selectedChannel],
            {
              id: Date.now() + 2,
              user: 'System',
              text: 'Error: Could not connect to Alice or no response received.',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        }));
        ws.close();
      };
      ws.onclose = () => setWaitingForAlice(false);
    }
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
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-base ${userColorMap[msg.user]}`}
                title={msg.user}
              >
                {msg.user[0]}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{msg.user}</span>
                  <span className="text-xs text-gray-400">{msg.time}</span>
                </div>
                <div className="text-gray-800">{msg.text}</div>
                {msg.video_url && (() => {
                  const ytId = getYouTubeId(msg.video_url);
                  if (!ytId) return null;
                  const isPlayed = playedVideos.includes(msg.id);
                  const thumbUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
                  const embedUrl = `https://www.youtube.com/embed/${ytId}?autoplay=1&vq=hd1080&rel=0`;
                  return (
                    <div className="mt-2">
                      {!isPlayed ? (
                        <div
                          className="relative w-80 h-44 cursor-pointer group bg-black/10 rounded-lg overflow-hidden"
                          style={{ maxWidth: 320, maxHeight: 180 }}
                          onClick={() => setPlayedVideos(p => [...p, msg.id])}
                        >
                          <img
                            src={thumbUrl}
                            alt="YouTube thumbnail"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition">
                            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                              <circle cx="32" cy="32" r="32" fill="rgba(0,0,0,0.5)" />
                              <polygon points="26,20 48,32 26,44" fill="#fff" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <iframe
                          width="320"
                          height="180"
                          src={embedUrl}
                          title="YouTube video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          ))}
          {waitingForAlice && selectedChannel === 'course' && (
            <div className="text-center text-purple-600">Alice is typing...</div>
          )}
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