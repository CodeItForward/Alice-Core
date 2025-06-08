import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../core/context/AuthContext';
import { getTeamChannels, getChannelMessages, postMessage, createWebSocketConnection, type Channel, type ChatMessage, type WebSocketMessage } from '../../core/services/api';

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

export function AiForGoodPage() {
  const { user } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch channels on component mount
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const fetchedChannels = await getTeamChannels(1);
        setChannels(fetchedChannels);
        // Select the default channel if available
        const defaultChannel = fetchedChannels.find(ch => ch.IsDefault) || fetchedChannels[0];
        if (defaultChannel) {
          setSelectedChannel(defaultChannel);
        }
      } catch (err) {
        setError('Failed to load channels');
        console.error('Error loading channels:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, []);

  // Load messages and setup WebSocket when channel changes
  useEffect(() => {
    if (!selectedChannel || !user) return;

    const loadMessages = async () => {
      try {
        const fetchedMessages = await getChannelMessages(1, selectedChannel.ChannelId);
        setMessages(fetchedMessages);
      } catch (err) {
        setError('Failed to load messages');
        console.error('Error loading messages:', err);
      }
    };

    // Close existing WebSocket connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    // Store user ID in localStorage for WebSocket connection
    localStorage.setItem('userId', user.id);

    // Create new WebSocket connection
    wsRef.current = createWebSocketConnection(
      1,
      selectedChannel.ChannelId,
      (data: WebSocketMessage) => {
        // Clear any existing errors when we receive a message
        setError(null);
        console.log('Received WebSocket message in AiForGoodPage:', {
          type: data.type,
          hasMessages: !!data.messages,
          messageCount: data.messages?.length,
          activeUsers: data.active_users
        });
        switch (data.type) {
          case 'message':
          case 'text':
            if (data.message_id && data.content && data.user_id && data.created_at) {
              console.log('Processing new message:', data);
              setMessages(prevMessages => {
                const newMessage: ChatMessage = {
                  MessageId: data.message_id!,
                  ChannelId: selectedChannel.ChannelId,
                  UserId: data.user_id!,
                  Text: data.content!,
                  Timestamp: data.created_at!,
                  ReplyToMessageId: null,
                  user: {
                    UserId: data.user_id!,
                    DisplayName: data.display_name || (data.user_id === 1 ? 'Alice' : 'User ' + data.user_id),
                    Email: ''
                  }
                };
                return [...prevMessages, newMessage];
              });
            }
            break;
          case 'join':
            if (data.active_users !== undefined) {
              console.log('Updating active users count:', data.active_users);
              setActiveUsers(data.active_users);
            }
            break;
          case 'messages_updated':
            if (data.messages && Array.isArray(data.messages)) {
              console.log('Updating messages with:', data.messages.length, 'messages');
              setMessages(prevMessages => {
                const existingMessages = new Map(prevMessages.map(msg => [msg.MessageId, msg]));
                data.messages.forEach(msg => {
                  existingMessages.set(msg.MessageId, msg);
                });
                return Array.from(existingMessages.values())
                  .sort((a, b) => new Date(a.Timestamp).getTime() - new Date(b.Timestamp).getTime());
              });
            }
            break;
          case 'error':
            console.error('WebSocket error message:', data.message);
            setError(data.message || 'An error occurred');
            break;
          default:
            console.log('Unhandled message type:', data.type);
        }
      },
      (error) => {
        console.error('WebSocket error:', error);
        // Don't set error state here, let the reconnection attempt happen
      },
      (event) => {
        console.log('WebSocket closed:', event);
        // Attempt to reconnect after a delay
        setTimeout(() => {
          if (selectedChannel && user) {
            wsRef.current = createWebSocketConnection(
              1,
              selectedChannel.ChannelId,
              (data) => {
                // Clear any existing errors when we receive a message
                setError(null);
                switch (data.type) {
                  case 'messages_updated':
                    if (data.messages) {
                      setMessages(data.messages);
                    }
                    break;
                  case 'user_joined':
                  case 'user_left':
                    if (data.active_users !== undefined) {
                      setActiveUsers(data.active_users);
                    }
                    break;
                  case 'error':
                    setError(data.message || 'An error occurred');
                    break;
                }
              },
              (error) => {
                console.error('WebSocket error:', error);
                // Don't set error state here, let the reconnection attempt happen
              },
              (event) => {
                console.log('WebSocket closed:', event);
              }
            );
          }
        }, 3000);
      }
    );

    loadMessages();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [selectedChannel, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel || !user) return;

    try {
      // Create a temporary message object
      const tempMessage: ChatMessage = {
        MessageId: Date.now(), // Temporary ID
        ChannelId: selectedChannel.ChannelId,
        UserId: parseInt(user.id),
        Text: newMessage,
        Timestamp: new Date().toISOString(),
        ReplyToMessageId: null,
        user: {
          UserId: parseInt(user.id),
          DisplayName: user.displayName || user.email,
          Email: user.email
        }
      };

      // Update local messages immediately
      setMessages(prev => [...prev, tempMessage]);

      // Send message through WebSocket
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const message = {
          type: 'message',
          text: newMessage,
          user_id: parseInt(user.id),
          reply_to_message_id: null
        };
        console.log('Sending chat message:', JSON.stringify(message, null, 2));
        wsRef.current.send(JSON.stringify(message));
        setNewMessage('');
      } else {
        setError('WebSocket connection is not available');
        // Remove the temporary message if WebSocket is not available
        setMessages(prev => prev.filter(m => m.MessageId !== tempMessage.MessageId));
      }
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    }
  };

  // Build a map of user -> color for this channel
  const userColorMap = (() => {
    const taken = new Set<string>();
    const map: Record<number, string> = {};
    messages.forEach(msg => {
      if (msg.user.UserId === 1) { // Alice's UserId is 1
        map[msg.user.UserId] = AI_COLOR;
      } else if (user && msg.user.UserId === parseInt(user.id)) {
        map[msg.user.UserId] = USER_COLOR;
      }
    });
    messages.forEach(msg => {
      if (!map[msg.user.UserId]) {
        map[msg.user.UserId] = getOtherUserColor(msg.user.DisplayName, taken);
      }
    });
    return map;
  })();

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Channels</h2>
        <div className="space-y-2">
          {channels.map((channel) => (
            <button
              key={channel.ChannelId}
              onClick={() => setSelectedChannel(channel)}
              className={`w-full text-left px-3 py-2 rounded ${
                selectedChannel?.ChannelId === channel.ChannelId
                  ? 'bg-purple-100 text-purple-800'
                  : 'text-gray-600 hover:bg-purple-50'
              }`}
            >
              {channel.Name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChannel ? (
          <>
            {/* Chat Header */}
            <div className="bg-white p-4 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">{selectedChannel.Name}</h3>
              <p className="text-gray-500">{activeUsers} active users</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.MessageId}
                  className="flex items-start space-x-3"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                    style={{
                      backgroundColor: userColorMap[message.user.UserId],
                    }}
                  >
                    {message.user.DisplayName[0]}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-800">
                        {message.user.DisplayName}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(message.Timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-600">{message.Text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a channel to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default AiForGoodPage; 