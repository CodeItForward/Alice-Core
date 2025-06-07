import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { getTeamChannels, type Channel } from '../../core/services/api';

const wsUrl = 'wss://restrictedchat.purplemeadow-b77df452.eastus.azurecontainerapps.io/alice/aiforgood/chat';

const getYouTubeId = (url: string) => {
  // Handles both youtu.be and youtube.com URLs
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
};

const getOtherUserColor = (user: string, taken: Set<string>) => {
  const colors = [
    '#E53E3E', // red-600
    '#DD6B20', // orange-600
    '#D69E2E', // yellow-600
    '#38A169', // green-600
    '#319795', // teal-600
    '#3182CE', // blue-600
    '#5A67D8', // indigo-600
    '#805AD5', // purple-600
    '#D53F8C', // pink-600
  ];
  
  for (const color of colors) {
    if (!taken.has(color)) {
      taken.add(color);
      return color;
    }
  }
  
  // If all colors are taken, generate a random one
  const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
  taken.add(randomColor);
  return randomColor;
};

const AI_COLOR = '#6D28D9'; // purple-700
const USER_COLOR = '#2563EB'; // blue-600

const initialMessages = {
  general: [
    { id: 1, user: 'Alice', text: 'Welcome to the General channel!', time: '09:00' },
  ],
};

const AiForGoodPage: React.FC = () => {
  const { user } = useUser();
  const currentUserName = user?.firstName || user?.username || 'You';
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [messages, setMessages] = useState<Record<string, any[]>>(initialMessages);
  const [input, setInput] = useState('');
  const wsRef = useRef<WebSocket | null>(null);
  const [waitingForAlice, setWaitingForAlice] = useState(false);
  const [playedVideos, setPlayedVideos] = useState<number[]>([]);

  // Fetch channels when component mounts
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const teamChannels = await getTeamChannels(1); // Using team ID 1 for now
        setChannels(teamChannels);
        if (teamChannels.length > 0) {
          // Set the first channel as selected
          const defaultChannel = teamChannels.find(c => c.IsDefault) || teamChannels[0];
          setSelectedChannel(defaultChannel.Name);
        }
      } catch (error) {
        console.error('Error fetching channels:', error);
      }
    };
    fetchChannels();
  }, []);

  // Build a map of user -> color for this channel
  const userColorMap = (() => {
    const taken = new Set<string>();
    const map: Record<string, string> = {};
    messages[selectedChannel]?.forEach(msg => {
      if (msg.user === 'Alice') {
        map[msg.user] = AI_COLOR;
      } else if (msg.user === 'You' || msg.user === currentUserName) {
        map[msg.user] = USER_COLOR;
      }
    });
    messages[selectedChannel]?.forEach(msg => {
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
      [selectedChannel]: [...(prev[selectedChannel] || []), newMsg],
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
                ...(prev[selectedChannel] || []),
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
                ...(prev[selectedChannel] || []),
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
            ...(prev[selectedChannel] || []),
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

  if (channels.length === 0) {
    return <div className="p-4 text-center">Loading channels...</div>;
  }

  return (
    <div className="flex h-full bg-gray-50" style={{ minHeight: '500px' }}>
      {/* Channels sidebar */}
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 font-bold text-lg border-b border-gray-100">Channels</div>
        <ul className="flex-1 overflow-auto">
          {channels.map(channel => (
            <li key={channel.ChannelId}>
              <button
                className={`w-full text-left px-4 py-2 hover:bg-purple-50 ${selectedChannel === channel.Name ? 'bg-purple-100 font-semibold' : ''}`}
                onClick={() => setSelectedChannel(channel.Name)}
              >
                # {channel.Name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
          {messages[selectedChannel]?.map(msg => (
            <div key={msg.id} className="mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                  <span className="text-sm font-medium" style={{ color: userColorMap[msg.user] }}>
                    {msg.user[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="font-medium mr-2" style={{ color: userColorMap[msg.user] }}>
                      {msg.user}
                    </span>
                    <span className="text-xs text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-gray-800">{msg.text}</p>
                  {msg.video_url && (() => {
                    const videoId = getYouTubeId(msg.video_url);
                    if (!videoId) return null;
                    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                    return (
                      <div className="mt-2">
                        {playedVideos.includes(msg.id) ? (
                          <iframe
                            width="320"
                            height="180"
                            src={embedUrl}
                            title="YouTube video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <button
                            onClick={() => setPlayedVideos(prev => [...prev, msg.id])}
                            className="text-purple-600 hover:text-purple-700"
                          >
                            Click to play video
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>
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
            placeholder={`Message #${selectedChannel}`}
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