import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../core/context/AuthContext';
import { getTeamChannels, getChannelMessages, postMessage, createWebSocketConnection, type Channel, type ChatMessage, type WebSocketMessage } from '../../core/services/api';
import { Bot, User as UserIcon, Loader2 } from 'lucide-react';

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

const getUserColor = (userId: number) => {
  const colors = ['#ADBDAD', '#E6A4A4', '#6FA5B3'];
  return colors[userId % colors.length];
};

export function AiForGoodPage() {
  const { user } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsSetupRef = useRef(false);
  const isConnectingRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const processedMessageIds = useRef<Set<number>>(new Set());
  const MAX_RECONNECT_ATTEMPTS = 5;
  const [loadingImageId, setLoadingImageId] = useState<number | null>(null);

  // Wrapper to log every setMessages call
  const setMessagesWithLog = (...args: Parameters<typeof setMessages>) => {
    console.log('setMessages called with args:', args);
    setMessages(...args);
  };

  // Cleanup function for WebSocket
  const cleanupWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.onclose = null; // Remove the onclose handler to prevent reconnection
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    isConnectingRef.current = false;
    reconnectAttemptsRef.current = 0;
    wsSetupRef.current = false;
  };

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

    if (wsSetupRef.current) {
      console.log('WebSocket setup already in progress, skipping...');
      return;
    }
    wsSetupRef.current = true;

    const loadMessages = async () => {
      try {
        const fetchedMessages = await getChannelMessages(1, selectedChannel.ChannelId);
        setMessagesWithLog(fetchedMessages);
      } catch (err) {
        setError('Failed to load messages');
        console.error('Error loading messages:', err);
      }
    };

    // Cleanup existing connection
    cleanupWebSocket();

    // Store user ID in localStorage for WebSocket connection
    localStorage.setItem('userId', user.id);

    // Add log for WebSocket creation
    console.log('WebSocket CREATED for channel', selectedChannel.ChannelId, 'user', user.id, 'at', new Date().toISOString());

    // Add log for handler attachment
    console.log('Attaching WebSocket message handler for channel', selectedChannel.ChannelId, 'user', user.id, 'at', new Date().toISOString());

    // Create new WebSocket connection
    if (!isConnectingRef.current) {
      isConnectingRef.current = true;
      const ws = createWebSocketConnection(
        1,
        selectedChannel.ChannelId,
        (data: WebSocketMessage) => {
          // Log all incoming WebSocket messages
          console.log('WebSocket received message:', data);
          
          // Skip if no message_id
          if (!data.message_id) {
            console.log('Skipping message without message_id');
            return;
          }

          // Skip duplicate messages
          if (processedMessageIds.current.has(data.message_id)) {
            console.log('Skipping duplicate message_id:', data.message_id);
            return;
          }

          // Add message_id to processed set
          processedMessageIds.current.add(data.message_id);
          
          // Clear any existing errors
          setError(null);

          // Handle the message based on type
          if (data.content && data.user_id && data.created_at) {
            setMessagesWithLog(prevMessages => {
              // Check if this is an image request from Alice
              if (data.user_id === 1 && data.content?.toLowerCase().includes('image request')) {
                const loadingMessage: ChatMessage = {
                  MessageId: data.message_id!,
                  ChannelId: selectedChannel!.ChannelId,
                  UserId: 1,
                  Text: "Generating your image...",
                  Timestamp: data.created_at!,
                  ReplyToMessageId: null,
                  user: {
                    UserId: 1,
                    DisplayName: 'Alice',
                    Email: ''
                  },
                  type: 'loading'
                };
                setLoadingImageId(data.message_id!);
                console.log('Adding loading message');
                return [...prevMessages, loadingMessage];
              }

              // If this is a message with an image from Alice and we have a loading message
              if (data.user_id === 1 && data.image_url && loadingImageId) {
                const newMessage: ChatMessage = {
                  MessageId: data.message_id!,
                  ChannelId: selectedChannel!.ChannelId,
                  UserId: data.user_id!,
                  Text: data.content || '',
                  Timestamp: data.created_at!,
                  ReplyToMessageId: null,
                  user: {
                    UserId: data.user_id!,
                    DisplayName: data.display_name || 'Alice',
                    Email: ''
                  },
                  type: 'image',
                  image_url: data.image_url
                };
                setLoadingImageId(null);
                // Remove any loading messages and add the new image message
                const filteredMessages = prevMessages.filter(msg => msg.type !== 'loading');
                console.log('Removing loading messages');
                console.log('Messages after filter:', filteredMessages);
                return [...filteredMessages, newMessage];
              }

              // Regular message handling
              const newMessage: ChatMessage = {
                MessageId: data.message_id!,
                ChannelId: selectedChannel!.ChannelId,
                UserId: data.user_id!,
                Text: data.content || '',
                Timestamp: data.created_at!,
                ReplyToMessageId: null,
                user: {
                  UserId: data.user_id!,
                  DisplayName: data.display_name || (data.user_id === 1 ? 'Alice' : 'User ' + data.user_id),
                  Email: ''
                },
                type: data.type || 'text',
                video_url: data.video_url,
                image_url: data.image_url
              };

              return [...prevMessages, newMessage];
            });
          }
        },
        (error) => {
          console.error('WebSocket error:', error);
          // Don't set error state for connection errors, let the onclose handler handle reconnection
        },
        (event) => {
          console.log('WebSocket closed:', event.code, event.reason);
          if (event.code === 1000) {
            // Normal closure
            return;
          }
          
          // Attempt to reconnect if not at max attempts
          if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttemptsRef.current++;
            console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})...`);
            reconnectTimeoutRef.current = window.setTimeout(() => {
              if (selectedChannel && user) {
                isConnectingRef.current = false;
                // Trigger the effect again
                setSelectedChannel({ ...selectedChannel });
              }
            }, 1000 * Math.min(30, Math.pow(2, reconnectAttemptsRef.current)));
          } else {
            setError('Connection lost. Please refresh the page.');
          }
        }
      );

      wsRef.current = ws;
      isConnectingRef.current = false;
    }

    loadMessages();

    // Cleanup on unmount or channel change
    return () => {
      cleanupWebSocket();
      wsSetupRef.current = false;
    };
  }, [selectedChannel, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    console.log('Messages state updated:', messages);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChannel || !user) return;

    const trimmedMessage = newMessage.trim();
    setNewMessage('');

    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const message = {
          type: 'message',
          text: trimmedMessage,
          user_id: parseInt(user.id),
          reply_to_message_id: null
        };
        wsRef.current.send(JSON.stringify(message));
        console.log('Sending chat message:', message);
      } else {
        setError('WebSocket connection is not available');
      }
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    }
  };

  // Update the WebSocket message handler
  const handleWebSocketMessage = (data: WebSocketMessage) => {
    // Log all incoming WebSocket messages
    console.log('WebSocket received message:', data);
    
    // Skip if no message_id
    if (!data.message_id) {
      console.log('Skipping message without message_id');
      return;
    }

    // Skip duplicate messages
    if (processedMessageIds.current.has(data.message_id)) {
      console.log('Skipping duplicate message_id:', data.message_id);
      return;
    }

    // Add message_id to processed set
    processedMessageIds.current.add(data.message_id);
    
    // Clear any existing errors
    setError(null);

    // Handle the message based on type
    if (data.content && data.user_id && data.created_at) {
      setMessagesWithLog(prevMessages => {
        // Check if this is an image request from Alice
        if (data.user_id === 1 && data.content?.toLowerCase().includes('image request')) {
          const loadingMessage: ChatMessage = {
            MessageId: data.message_id!,
            ChannelId: selectedChannel!.ChannelId,
            UserId: 1,
            Text: "Generating your image...",
            Timestamp: data.created_at!,
            ReplyToMessageId: null,
            user: {
              UserId: 1,
              DisplayName: 'Alice',
              Email: ''
            },
            type: 'loading'
          };
          setLoadingImageId(data.message_id!);
          console.log('Adding loading message');
          return [...prevMessages, loadingMessage];
        }

        // If this is a message with an image from Alice and we have a loading message
        if (data.user_id === 1 && data.image_url && loadingImageId) {
          const newMessage: ChatMessage = {
            MessageId: data.message_id!,
            ChannelId: selectedChannel!.ChannelId,
            UserId: data.user_id!,
            Text: data.content || '',
            Timestamp: data.created_at!,
            ReplyToMessageId: null,
            user: {
              UserId: data.user_id!,
              DisplayName: data.display_name || 'Alice',
              Email: ''
            },
            type: 'image',
            image_url: data.image_url
          };
          setLoadingImageId(null);
          // Remove any loading messages and add the new image message
          const filteredMessages = prevMessages.filter(msg => msg.type !== 'loading');
          console.log('Removing loading messages');
          console.log('Messages after filter:', filteredMessages);
          return [...filteredMessages, newMessage];
        }

        // Regular message handling
        const newMessage: ChatMessage = {
          MessageId: data.message_id!,
          ChannelId: selectedChannel!.ChannelId,
          UserId: data.user_id!,
          Text: data.content || '',
          Timestamp: data.created_at!,
          ReplyToMessageId: null,
          user: {
            UserId: data.user_id!,
            DisplayName: data.display_name || (data.user_id === 1 ? 'Alice' : 'User ' + data.user_id),
            Email: ''
          },
          type: data.type || 'text',
          video_url: data.video_url,
          image_url: data.image_url
        };

        return [...prevMessages, newMessage];
      });
    }
  };

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
              {messages.map((message) => {
                const isAlice = message.user.UserId === 1;
                const isCurrentUser = user && message.user.UserId === parseInt(user.id);
                const userColor = getUserColor(message.user.UserId);
                return (
                  <div
                    key={message.MessageId}
                    className="flex justify-start"
                  >
                    <div className="flex max-w-[80%] flex-row">
                      {/* Avatar */}
                      <div className="flex-shrink-0 mr-4">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          isAlice
                            ? 'bg-blue-100'
                            : isCurrentUser
                            ? 'bg-purple-100'
                            : 'bg-gray-100'
                        }`} style={{ backgroundColor: isAlice ? undefined : isCurrentUser ? undefined : userColor }}>
                          {isAlice ? (
                            <Bot size={16} className="text-blue-800" />
                          ) : isCurrentUser ? (
                            <UserIcon size={16} className="text-purple-800" />
                          ) : (
                            <span className="text-white font-bold">{message.user.DisplayName?.[0]?.toUpperCase() || '?'}</span>
                          )}
                        </div>
                      </div>
                      {/* Message Bubble */}
                      <div>
                        <div className={`rounded-2xl px-4 py-3 ${
                          isAlice
                            ? 'bg-blue-100 border border-gray-200 shadow-sm rounded-tl-none'
                            : isCurrentUser
                            ? 'bg-purple-600 text-white rounded-tr-none'
                            : 'border border-gray-200 shadow-sm rounded-tl-none'
                        }`} style={{ backgroundColor: isAlice ? undefined : isCurrentUser ? undefined : userColor }}>
                          <div className="text-sm">
                            {/* Always show the message text */}
                            <div>{message.Text}</div>
                            {/* If video, show YouTube embed */}
                            {message.type === 'video' && message.video_url && (
                              <div className="mt-2">
                                <iframe
                                  width="560"
                                  height="315"
                                  src={`https://www.youtube.com/embed/${getYouTubeId(message.video_url)}`}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            )}
                            {/* If image, show image */}
                            {message.type === 'image' && message.image_url && (
                              <div className="mt-2">
                                <img 
                                  src={message.image_url} 
                                  alt="Shared image" 
                                  className="max-w-full rounded-lg shadow-sm"
                                  style={{ maxHeight: '400px' }}
                                />
                              </div>
                            )}
                            {/* If loading, show loading indicator */}
                            {message.type === 'loading' && (
                              <div className="mt-1 flex items-center space-x-2">
                                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                <span className="text-gray-600">Generating your image...</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-1 text-xs text-gray-500 text-left"> 
                          {isAlice ? 'Alice' : isCurrentUser ? 'You' : message.user.DisplayName} · {new Date(message.Timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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