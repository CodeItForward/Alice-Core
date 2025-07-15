import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../core/context/AuthContext';
import { getChannelMessages, postMessage, createWebSocketConnection, type ChatMessage, type WebSocketMessage, getTeamChannels, type Channel, getUserTeams, type Team } from '../../core/services/api';
import { Bot, User as UserIcon, Loader2, ChevronDown } from 'lucide-react';

// Helper function to get a consistent color for a user
const getUserColor = (userId: number): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
    '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71'
  ];
  return colors[userId % colors.length];
};

// Helper function to extract YouTube video ID from URL
const getYouTubeId = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
};

const CodeItForwardChatPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState(0);
  const [team, setTeam] = useState<Team | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isConnectingRef = useRef(false);
  const reconnectTimeoutRef = useRef<number>();
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const wsSetupRef = useRef(false);
  const processedMessageIds = useRef<Set<number>>(new Set());

  // Debug logging for user data
  useEffect(() => {
    console.log('User data:', user);
  }, [user]);

  // Wrapper function to log every call to setMessages
  const setMessagesWithLog = (updater: (prev: ChatMessage[]) => ChatMessage[]) => {
    console.log('setMessages called from', new Error().stack);
    setMessages(updater);
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
      reconnectTimeoutRef.current = undefined;
    }
    isConnectingRef.current = false;
    reconnectAttemptsRef.current = 0;
    wsSetupRef.current = false;
  };

  // Always use personal team/channel for chat logic
  const teamId = user?.PersonalTeamId;
  const channelId = user?.PersonalChannelId;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Scroll to bottom when channel changes (i.e., when channelId changes)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [channelId]);

  // On mount, fetch team and channel info for display (not for selection)
  useEffect(() => {
    if (!user) return;
    const fetchInfo = async () => {
      setIsLoading(true);
      try {
        const [teamInfo, channelInfo] = await Promise.all([
          getUserTeams(parseInt(user.id)).then(teams => teams.find(t => t.TeamId === user.PersonalTeamId) || null),
          getTeamChannels(user.PersonalTeamId).then(chs => chs.find(ch => ch.ChannelId === user.PersonalChannelId) || null)
        ]);
        setTeam(teamInfo);
        setChannel(channelInfo);
      } catch (err) {
        setError('Failed to load team/channel info');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInfo();
  }, [user]);

  // Load messages for personal team/channel
  useEffect(() => {
    if (!teamId || !channelId) return;
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const initialMessages = await getChannelMessages(teamId, channelId, 50, 0);
        setMessages(initialMessages);
      } catch (err) {
        setError('Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };
    loadMessages();
  }, [teamId, channelId]);

  // WebSocket connection for personal team/channel
  useEffect(() => {
    if (!teamId || !channelId || !user) return;
    if (wsSetupRef.current) return;
    wsSetupRef.current = true;
    // Cleanup existing connection
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }
    localStorage.setItem('userId', user.id);
    const ws = createWebSocketConnection(
      teamId,
      channelId,
      (data: WebSocketMessage) => {
        if (data.message_id && processedMessageIds.current.has(data.message_id)) return;
        if (data.message_id) processedMessageIds.current.add(data.message_id);
        setError(null);
        switch (data.type) {
          case 'message':
          case 'text':
          case 'video':
          case 'image':
            if (data.message_id && data.content && data.user_id && data.created_at) {
              setMessages(prevMessages => {
                if (prevMessages.some(msg => msg.MessageId === data.message_id)) return prevMessages;
                const newMessage: ChatMessage = {
                  MessageId: data.message_id!,
                  ChannelId: channelId,
                  UserId: data.user_id!,
                  Text: data.content!,
                  Timestamp: data.created_at!,
                  ReplyToMessageId: null,
                  user: {
                    UserId: data.user_id!,
                    DisplayName: data.display_name || (data.user_id === 1 ? 'Alice' : 'User ' + data.user_id),
                    Email: ''
                  },
                  type: data.type,
                  video_url: data.video_url,
                  image_url: data.image_url
                };
                return [...prevMessages, newMessage];
              });
            }
            break;
          case 'join':
          case 'user_joined':
            setActiveUsers(prev => prev + 1);
            break;
          case 'user_left':
            setActiveUsers(prev => Math.max(0, prev - 1));
            break;
          case 'error':
            setError(data.message || 'An error occurred');
            break;
        }
      },
      (error) => setError('Connection error occurred'),
      (event) => {
        if (event.code === 1006) setError('Connection lost. Please refresh the page to reconnect.');
      },
      (ws) => {
        // Send join message with user_id as soon as the connection is open
        if (user && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'join', user_id: parseInt(user.id) }));
          console.log('Sent join message with user_id:', user.id);
        }
      }
    );
    wsRef.current = ws;
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      wsSetupRef.current = false;
    };
  }, [teamId, channelId, user]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    // Prevent form submission if event is provided
    if (e) {
      e.preventDefault();
    }

    if (!newMessage.trim() || !user) return;

    // Prepend @alice if not already present (case-insensitive)
    let outgoingMessage = newMessage.trim();
    if (!/^@alice\b/i.test(outgoingMessage)) {
      outgoingMessage = `@alice ${outgoingMessage}`;
    }

    // Check if the message is requesting an image generation
    const isImageRequest = outgoingMessage.toLowerCase().includes('generate image') || 
                          outgoingMessage.toLowerCase().includes('create image') ||
                          outgoingMessage.toLowerCase().includes('draw');

    if (isImageRequest) {
      setIsGeneratingImage(true);
    }

    const tempMessage = {
      MessageId: Date.now(),
      ChannelId: channelId || '',
      UserId: parseInt(user.id),
      Text: outgoingMessage,
      Timestamp: new Date().toISOString(),
      ReplyToMessageId: null,
      user: {
        UserId: parseInt(user.id),
        DisplayName: user.displayName || user.email,
        Email: user.email
      },
      type: isImageRequest ? 'image' : 'text'
    };

    setNewMessage('');
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const message = {
          type: isImageRequest ? 'image' : 'message',
          text: outgoingMessage,
          user_id: parseInt(user.id),
          reply_to_message_id: null,
          temp_id: tempMessage.MessageId
        };
        wsRef.current.send(JSON.stringify(message));
        console.log('Sending chat message:', message);
      } else {
        setError('WebSocket connection is not available');
      }
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      if (isImageRequest) {
        // Keep the loading state for a minimum time to show the animation
        setTimeout(() => {
          setIsGeneratingImage(false);
        }, 2000);
      }
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <Bot className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">CodeItForward Chat</h2>
            <p className="text-sm text-gray-500">{activeUsers} active users</p>
          </div>
        </div>
        
        {/* Team and Channel Selection */}
        <div className="flex items-center space-x-4">
          {team && <span className="text-sm text-gray-600">Team: {team.Name}</span>}
          {channel && <span className="text-sm text-gray-600">Channel: {channel.Name}</span>}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>Hi, I'm Alice.  Use this space to have an individual chat with me.  You can ask me anything related to the course.</p>
          </div>
        ) : (
          <>
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
            {isGeneratingImage && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <Bot className="w-8 h-8 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">Alice</span>
                  </div>
                  <div className="mt-1 flex items-center space-x-2">
                    <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                    <span className="text-gray-600">Generating your image...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default {
  name: 'CodeItForward Chat',
  navLinks: [
    { label: "Let's Chat", path: '/codeitforward-chat' }
  ],
  routes: [
    { path: '/codeitforward-chat', component: CodeItForwardChatPage }
  ]
}; 