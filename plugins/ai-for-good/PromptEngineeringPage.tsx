import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Video, MessageSquare, Image as ImageIcon, Save, X, BookOpen, Activity, ChevronDown, ChevronRight, CheckCircle, Clock, Loader2, Bot, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../core/context/AuthContext';
import { getTeamChannels, getChannelMessages, postMessage, createWebSocketConnection, type Channel, type ChatMessage, type WebSocketMessage } from '../../core/services/api';

interface ProgressItem {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'activity';
  status: 'not-started' | 'in-progress' | 'completed';
  duration: string;
  link: string;
}

interface ComicPanel {
  id: number;
  imageUrl: string;
  caption: string;
}

const progressItems: ProgressItem[] = [
  {
    id: 'welcome',
    title: 'Welcome to AI for Good',
    type: 'video',
    status: 'completed',
    duration: '5 min',
    link: '/ai-for-good/welcome'
  },
  {
    id: 'intro',
    title: 'Intro to AI',
    type: 'video',
    status: 'completed',
    duration: '10 min',
    link: '/ai-for-good/intro'
  },
  {
    id: 'game-time',
    title: 'Game Time! Group Activity',
    type: 'activity',
    status: 'completed',
    duration: '20 min',
    link: '/ai-for-good/game-time'
  },
  {
    id: 'prompt-best-practices',
    title: 'Prompt Engineering Best Practices',
    type: 'reading',
    status: 'completed',
    duration: '15 min',
    link: '/ai-for-good/prompt-best-practices'
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering Activity',
    type: 'activity',
    status: 'in-progress',
    duration: '30 min',
    link: '/ai-for-good/prompt-engineering'
  },
  {
    id: 'teambuilding',
    title: 'Teambuilding',
    type: 'activity',
    status: 'not-started',
    duration: '25 min',
    link: '/ai-for-good/teambuilding'
  },
  {
    id: 'mind-map',
    title: 'Mind Map Jam',
    type: 'activity',
    status: 'not-started',
    duration: '20 min',
    link: '/ai-for-good/mind-map'
  },
  {
    id: 'ai-ethics',
    title: 'Take Home: AI Ethics',
    type: 'reading',
    status: 'not-started',
    duration: '15 min',
    link: '/ai-for-good/ai-ethics'
  }
];

const PromptEngineeringPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedItem, setSelectedItem] = useState<ProgressItem | null>(null);
  const [comicPanels, setComicPanels] = useState<ComicPanel[]>([
    { id: 1, imageUrl: '', caption: '' },
    { id: 2, imageUrl: '', caption: '' },
    { id: 3, imageUrl: '', caption: '' },
    { id: 4, imageUrl: '', caption: '' }
  ]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(true);
  const [isDay1Expanded, setIsDay1Expanded] = useState(true);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatingPanelId, setGeneratingPanelId] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsSetupRef = useRef(false);
  const isConnectingRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const processedMessageIds = useRef<Set<number>>(new Set());
  const MAX_RECONNECT_ATTEMPTS = 5;
  const [loadingImageId, setLoadingImageId] = useState<number | null>(null);

  // Initialize with prompt engineering channel
  useEffect(() => {
    if (!user) return;

    // Create a default channel for prompt engineering
    const defaultChannel: Channel = {
      ChannelId: user.PromptEngineeringChannelId,
      TeamId: user.PromptEngineeringChatId,
      Name: "Prompt Engineering",
      IsDefault: true,
      CreatedAt: new Date().toISOString()
    };
    
    setChannels([defaultChannel]);
    setSelectedChannel(defaultChannel);
    setIsLoading(false);
  }, [user]);

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
        const fetchedMessages = await getChannelMessages(user.PromptEngineeringChatId, user.PromptEngineeringChannelId);
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

    // Create new WebSocket connection
    if (!isConnectingRef.current) {
      isConnectingRef.current = true;
      const ws = createWebSocketConnection(
        user.PromptEngineeringChatId,
        user.PromptEngineeringChannelId,
        (data: WebSocketMessage) => {
          console.log('WebSocket received message:', data);
          
          if (!data.message_id) {
            console.log('Skipping message without message_id');
            return;
          }

          if (processedMessageIds.current.has(data.message_id)) {
            console.log('Skipping duplicate message_id:', data.message_id);
            return;
          }

          processedMessageIds.current.add(data.message_id);
          setError(null);

          if (data.content && data.user_id && data.created_at) {
            setMessagesWithLog(prevMessages => {
              if (data.user_id === 1 && data.content?.toLowerCase().includes('image request')) {
                const loadingMessage: ChatMessage = {
                  MessageId: data.message_id!,
                  ChannelId: selectedChannel.ChannelId,
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
                return [...prevMessages, loadingMessage];
              }

              if (data.user_id === 1 && data.image_url && loadingImageId) {
                const newMessage: ChatMessage = {
                  MessageId: data.message_id!,
                  ChannelId: selectedChannel.ChannelId,
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
                const filteredMessages = prevMessages.filter(msg => msg.type !== 'loading');
                return [...filteredMessages, newMessage];
              }

              const newMessage: ChatMessage = {
                MessageId: data.message_id!,
                ChannelId: selectedChannel.ChannelId,
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
        },
        (event) => {
          console.log('WebSocket closed:', event.code, event.reason);
          if (event.code === 1000) return;
          
          if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttemptsRef.current++;
            console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})...`);
            reconnectTimeoutRef.current = window.setTimeout(() => {
              if (selectedChannel && user) {
                isConnectingRef.current = false;
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

    return () => {
      cleanupWebSocket();
      wsSetupRef.current = false;
    };
  }, [selectedChannel, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const trimmedMessage = newMessage.trim();
    setNewMessage('');

    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        const message = {
          type: 'message',
          content: trimmedMessage,
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

  const handleItemClick = (item: ProgressItem) => {
    setSelectedItem(item);
    navigate(item.link);
  };

  const handleNextClick = () => {
    if (selectedItem) {
      const currentIndex = progressItems.findIndex(item => item.id === selectedItem.id);
      if (currentIndex < progressItems.length - 1) {
        const nextItem = progressItems[currentIndex + 1];
        setSelectedItem(nextItem);
        navigate(nextItem.link);
      }
    }
  };

  const handleSaveImage = (panelId: number, imageUrl: string) => {
    setComicPanels(panels => 
      panels.map(panel => 
        panel.id === panelId ? { ...panel, imageUrl } : panel
      )
    );
  };

  const handleUpdateCaption = (panelId: number, caption: string) => {
    setComicPanels(panels =>
      panels.map(panel =>
        panel.id === panelId ? { ...panel, caption } : panel
      )
    );
  };

  const handleGenerateImage = async (panelId: number) => {
    setIsGeneratingImage(true);
    setGeneratingPanelId(panelId);
    
    // Simulate image generation delay (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For now, just set a placeholder image
    setComicPanels(panels =>
      panels.map(panel =>
        panel.id === panelId ? { ...panel, imageUrl: 'https://picsum.photos/400/400' } : panel
      )
    );
    
    setIsGeneratingImage(false);
    setGeneratingPanelId(null);
  };

  const nextButtonState = {
    text: 'Next Activity',
    disabled: !selectedItem || selectedItem.id === progressItems[progressItems.length - 1].id
  };

  // Wrapper to log every setMessages call
  const setMessagesWithLog = (...args: Parameters<typeof setMessages>) => {
    console.log('setMessages called with args:', args);
    setMessages(...args);
  };

  // Cleanup function for WebSocket
  const cleanupWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.onclose = null;
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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Your Progress</h2>
        
        {/* Day 1 Section */}
        <div className="mb-4">
          <button
            onClick={() => setIsDay1Expanded(!isDay1Expanded)}
            className="flex items-center w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded"
          >
            {isDay1Expanded ? (
              <ChevronDown size={16} className="mr-2" />
            ) : (
              <ChevronRight size={16} className="mr-2" />
            )}
            <span className="font-semibold">Day 1</span>
          </button>
          
          {isDay1Expanded && (
            <div className="mt-2 space-y-2 pl-4">
              {progressItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`flex items-center w-full text-left px-3 py-2 rounded ${
                    selectedItem?.id === item.id
                      ? 'bg-purple-100 text-purple-800'
                      : item.status === 'completed'
                      ? 'bg-green-50 text-green-800'
                      : item.status === 'in-progress'
                      ? 'bg-yellow-50 text-yellow-800'
                      : 'text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {item.type === 'video' ? <Video size={16} className="text-blue-500" /> : 
                     item.type === 'reading' ? <BookOpen size={16} className="text-purple-500" /> : 
                     <Activity size={16} className="text-orange-500" />}
                    <span className="flex-1">{item.title}</span>
                    {item.status === 'completed' ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : item.status === 'in-progress' ? (
                      <Clock size={16} className="text-yellow-500" />
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Journey Hub</h3>
          <p className="text-gray-500">Track your learning progress and access course materials</p>
        </div>

        {/* Video Introduction */}
        {showVideo && (
          <div className="bg-black bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Welcome to Prompt Engineering!</h3>
                <button 
                  onClick={() => setShowVideo(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="aspect-video bg-gray-900 rounded-lg mb-4">
                {/* Video player will go here */}
                <div className="w-full h-full flex items-center justify-center text-white">
                  Video Introduction
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Learn how to create effective prompts to generate images for your comic strip.
              </p>
              <button
                onClick={() => setShowVideo(false)}
                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">Create Your Comic Strip</h2>
            <button
              onClick={() => setShowVideo(true)}
              className="flex items-center text-purple-600 hover:text-purple-700"
            >
              <Video size={16} className="mr-2" />
              Watch Intro
            </button>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-600">
              Use the chat interface below to work with AI to generate images for your comic strip.
              Each image should tell part of your story. Add captions to complete your narrative.
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Interface */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isAlice = message.user.UserId === 1;
                const isCurrentUser = user && message.user.UserId === parseInt(user.id);
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
                        }`}>
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
                        }`}>
                          <div className="text-sm">
                            <div>{message.Text}</div>
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
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Comic Strip */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              {comicPanels.map(panel => (
                <div key={panel.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <input
                    type="text"
                    value={panel.caption}
                    onChange={(e) => handleUpdateCaption(panel.id, e.target.value)}
                    placeholder={`Caption for panel ${panel.id}`}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center relative">
                    {isGeneratingImage && generatingPanelId === panel.id ? (
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-2" />
                        <p className="text-purple-600">Generating your image...</p>
                      </div>
                    ) : panel.imageUrl ? (
                      <img src={panel.imageUrl} alt={`Panel ${panel.id}`} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <div className="text-gray-400">
                        <ImageIcon size={32} />
                        <p className="mt-2">No image yet</p>
                        <button
                          onClick={() => handleGenerateImage(panel.id)}
                          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                        >
                          Generate Image
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next Button */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex justify-end">
            <button
              onClick={handleNextClick}
              disabled={nextButtonState.disabled}
              className={`flex items-center px-4 py-2 rounded-lg ${
                nextButtonState.disabled
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              <span>{nextButtonState.text}</span>
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptEngineeringPage; 