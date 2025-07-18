import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageSquare, Image as ImageIcon, Save, X, Loader2, Bot, User as UserIcon, Video } from 'lucide-react';
import { useAuth } from '../../core/context/AuthContext';
import { getTeamChannels, getChannelMessages, postMessage, createWebSocketConnection, type Channel, type ChatMessage, type WebSocketMessage, getComicStrip, getUserComicStrips, createComicStrip, updateComicStrip, type ComicStrip, getUserTeamsByType } from '../../core/services/api';

interface ComicPanel {
  id: number;
  imageUrl: string;
  caption: string;
}

const PromptEngineeringPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [comicPanels, setComicPanels] = useState<ComicPanel[]>([
    { id: 1, imageUrl: '', caption: '' },
    { id: 2, imageUrl: '', caption: '' },
    { id: 3, imageUrl: '', caption: '' },
    { id: 4, imageUrl: '', caption: '' }
  ]);
  const [currentComicStripId, setCurrentComicStripId] = useState<number | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatingPanelId, setGeneratingPanelId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsSetupRef = useRef(false);
  const isConnectingRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const processedMessageIds = useRef<Set<number>>(new Set());
  const MAX_RECONNECT_ATTEMPTS = 5;
  const [loadingImageId, setLoadingImageId] = useState<number | null>(null);
  const VERSION = '1.0.1';

  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);
  const [showTeammateComic, setShowTeammateComic] = useState(false);
  const [teammateComicPanels, setTeammateComicPanels] = useState<any[]>([]);
  const [teammateComicLoading, setTeammateComicLoading] = useState(false);
  const [teammateComicError, setTeammateComicError] = useState<string | null>(null);
  const [selectedTeammate, setSelectedTeammate] = useState<any>(null);
  const [teammatesWithComics, setTeammatesWithComics] = useState<any[]>([]);

  // Log version on component mount
  useEffect(() => {
    console.log('PromptEngineeringPage version:', VERSION);
  }, []);

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
        // Clear processed message IDs when loading initial messages
        processedMessageIds.current.clear();
        // Add all message IDs to processed set
        fetchedMessages.forEach(msg => {
          if (msg.MessageId) {
            processedMessageIds.current.add(msg.MessageId);
          }
        });
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
              // Check if message already exists
              if (prevMessages.some(msg => msg.MessageId === data.message_id)) {
                console.log('Message already exists, skipping:', data.message_id);
                return prevMessages;
              }

              // Check if this is an image request from Alice
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

              if (data.user_id === 1 && data.image_url) {
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
                // Remove any loading messages
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
          setError('Connection error occurred');
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
                wsSetupRef.current = false;
                setSelectedChannel({ ...selectedChannel });
              }
            }, 1000 * Math.min(30, Math.pow(2, reconnectAttemptsRef.current)));
          } else {
            setError('Connection lost. Please refresh the page.');
          }
        },
        (ws) => {
          // Send join message with user_id as soon as the connection is open
          if (user && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ user_id: parseInt(user.id) }));
            console.log('Sent join message with user_id:', user.id);
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
          text: `@alice ${trimmedMessage}`,
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

  // Load or create comic strip when component mounts
  useEffect(() => {
    const loadComicStrip = async () => {
      if (!user) return;

      try {
        // Try to get existing comic strips
        const userComicStrips = await getUserComicStrips(parseInt(user.id));
        
        if (userComicStrips.length > 0) {
          // Use the most recent comic strip
          const comicStrip = userComicStrips[0];
          setCurrentComicStripId(comicStrip.ComicStripId);
          setComicPanels([
            { id: 1, imageUrl: comicStrip.Panel1Image, caption: comicStrip.Panel1Caption },
            { id: 2, imageUrl: comicStrip.Panel2Image, caption: comicStrip.Panel2Caption },
            { id: 3, imageUrl: comicStrip.Panel3Image, caption: comicStrip.Panel3Caption },
            { id: 4, imageUrl: comicStrip.Panel4Image, caption: comicStrip.Panel4Caption }
          ]);
        } else {
          // Create a new comic strip
          const newComicStrip = await createComicStrip({
            UserId: parseInt(user.id),
            Panel1Image: '',
            Panel1Caption: '',
            Panel2Image: '',
            Panel2Caption: '',
            Panel3Image: '',
            Panel3Caption: '',
            Panel4Image: '',
            Panel4Caption: ''
          });
          setCurrentComicStripId(newComicStrip.ComicStripId);
        }
      } catch (error) {
        console.error('Error loading/creating comic strip:', error);
        setError('Failed to load comic strip data');
      }
    };

    loadComicStrip();
  }, [user]);

  const handleSaveImage = async (panelId: number, imageUrl: string) => {
    if (!currentComicStripId || !user) return;

    try {
      // Update local state
      setComicPanels(panels => 
        panels.map(panel => 
          panel.id === panelId ? { ...panel, imageUrl } : panel
        )
      );

      // Update in database
      const updateData: Partial<ComicStrip> = {
        [`Panel${panelId}Image`]: imageUrl
      };
      await updateComicStrip(currentComicStripId, updateData);
    } catch (error) {
      console.error('Error saving image:', error);
      setError('Failed to save image to comic strip');
    }
  };

  const handleUpdateCaption = async (panelId: number, caption: string) => {
    if (!currentComicStripId || !user) return;

    try {
      // Update local state
      setComicPanels(panels =>
        panels.map(panel =>
          panel.id === panelId ? { ...panel, caption } : panel
        )
      );

      // Update in database
      const updateData: Partial<ComicStrip> = {
        [`Panel${panelId}Caption`]: caption
      };
      await updateComicStrip(currentComicStripId, updateData);
    } catch (error) {
      console.error('Error updating caption:', error);
      setError('Failed to update caption');
    }
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

  const handleClearComicStrip = async () => {
    if (!currentComicStripId || !user) return;

    try {
      // Reset local state
      setComicPanels([
        { id: 1, imageUrl: '', caption: '' },
        { id: 2, imageUrl: '', caption: '' },
        { id: 3, imageUrl: '', caption: '' },
        { id: 4, imageUrl: '', caption: '' }
      ]);

      // Update in database
      const updateData: Partial<ComicStrip> = {
        Panel1Image: '',
        Panel1Caption: '',
        Panel2Image: '',
        Panel2Caption: '',
        Panel3Image: '',
        Panel3Caption: '',
        Panel4Image: '',
        Panel4Caption: ''
      };
      await updateComicStrip(currentComicStripId, updateData);
    } catch (error) {
      console.error('Error clearing comic strip:', error);
      setError('Failed to clear comic strip');
    }
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

  // Fetch team members on mount
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!user) return;
      setIsLoadingMembers(true);
      setMembersError(null);
      try {
        // Get user's teams (type 4 for AI for Good)
        const teams = await getUserTeamsByType(parseInt(user.id), 4);
        const team = teams && teams.length > 0 ? teams.reduce((prev, current) => (prev.TeamId > current.TeamId ? prev : current)) : null;
        if (!team) throw new Error('No team found');
        // Fetch team members
        const res = await fetch(`https://restrictedchat.purplemeadow-b77df452.eastus.azurecontainerapps.io/teams/${team.TeamId}/members`);
        if (!res.ok) throw new Error('Failed to fetch team members');
        const members = await res.json();
        setTeamMembers(members);
        
        // Check which teammates have comics
        const teammatesWithComicsData: any[] = [];
        for (const member of members) {
          const hasComics = await checkTeammateHasComics(member);
          if (hasComics) {
            teammatesWithComicsData.push(member);
          }
        }
        setTeammatesWithComics(teammatesWithComicsData);
      } catch (err: any) {
        setMembersError(err.message || 'Failed to load team members');
      } finally {
        setIsLoadingMembers(false);
      }
    };
    fetchTeamMembers();
  }, [user]);

  // Check if a teammate has comics
  const checkTeammateHasComics = async (member: any): Promise<boolean> => {
    try {
      const strips = await getUserComicStrips(member.user.UserId);
      if (strips && strips.length > 0) {
        const comic = strips[0];
        // Check if the comic has at least one image or caption
        return !!(comic.Panel1Image || comic.Panel1Caption || 
                 comic.Panel2Image || comic.Panel2Caption || 
                 comic.Panel3Image || comic.Panel3Caption || 
                 comic.Panel4Image || comic.Panel4Caption);
      }
      return false;
    } catch (err) {
      console.error('Error checking teammate comics:', err);
      return false;
    }
  };

  // Handler to show teammate's comic strip
  const handleShowTeammateComic = async (member: any) => {
    setSelectedTeammate(member);
    setShowTeammateComic(true);
    setTeammateComicLoading(true);
    setTeammateComicError(null);
    setTeammateComicPanels([]);
    try {
      const strips = await getUserComicStrips(member.user.UserId);
      if (strips && strips.length > 0) {
        const comic = strips[0];
        setTeammateComicPanels([
          { id: 1, imageUrl: comic.Panel1Image, caption: comic.Panel1Caption },
          { id: 2, imageUrl: comic.Panel2Image, caption: comic.Panel2Caption },
          { id: 3, imageUrl: comic.Panel3Image, caption: comic.Panel3Caption },
          { id: 4, imageUrl: comic.Panel4Image, caption: comic.Panel4Caption }
        ]);
      } else {
        setTeammateComicError('No comic strip found for this teammate.');
      }
    } catch (err: any) {
      setTeammateComicError(err.message || 'Failed to load comic strip.');
    } finally {
      setTeammateComicLoading(false);
    }
  };

  // Handler to close teammate comic modal
  const handleCloseTeammateComic = () => {
    setShowTeammateComic(false);
    setSelectedTeammate(null);
    setTeammateComicPanels([]);
    setTeammateComicError(null);
  };

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Prompt Engineering</h3>
              <p className="text-gray-500">Create your comic strip using AI</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleClearComicStrip}
                className="flex items-center text-red-600 hover:text-red-700"
              >
                <X size={16} className="mr-2" />
                Clear Comic Strip
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex overflow-hidden">
              {/* Chat Interface */}
              <div className="w-1/2 border-r border-gray-200 flex flex-col bg-white h-[600px]">
                <div className="bg-white border-b border-gray-200 p-4">
                  <h4 className="text-lg font-semibold text-gray-800">AI Chat Interface</h4>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
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
                                      className="max-w-full rounded-lg shadow-sm cursor-pointer hover:opacity-90 transition"
                                      style={{ maxHeight: '400px' }}
                                      onClick={() => message.image_url && setSelectedImage(message.image_url)}
                                    />
                                    {isAlice && (
                                      <div className="mt-2 grid grid-cols-2 gap-2">
                                        {[1, 2, 3, 4].map((panelId) => (
                                          <button
                                            key={panelId}
                                            onClick={() => message.image_url && handleSaveImage(panelId, message.image_url)}
                                            className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition text-sm"
                                          >
                                            Use for Panel {panelId}
                                          </button>
                                        ))}
                                      </div>
                                    )}
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
                <div className="bg-gray-50 border-t border-gray-200 p-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message to generate comic images..."
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
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
              <div className="w-1/2 flex flex-col bg-white">
                <div className="bg-white border-b border-gray-200 p-4">
                  <h4 className="text-lg font-semibold text-gray-800">Your Comic Strip</h4>
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
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
                              <ImageIcon size={16} />
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
            </div>
          </div>
        </div>
      </div>

      {/* Teammate Comics List */}
      <div className="bg-white border-t border-gray-200 p-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-lg font-semibold mb-2 text-purple-800">View Teammates Comics</h3>
          {isLoadingMembers ? (
            <div className="text-gray-500">Loading team members...</div>
          ) : membersError ? (
            <div className="text-red-500">{membersError}</div>
          ) : teammatesWithComics.length > 0 ? (
            <div className="flex flex-wrap gap-3 mb-2">
              {teammatesWithComics.map(member => (
                <button
                  key={member.TeamMemberId}
                  onClick={() => handleShowTeammateComic(member)}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-purple-200 transition"
                >
                  {member.user.DisplayName}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No teammates have created comics yet.</div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="bg-black bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Image Preview</h3>
              <button 
                onClick={() => setSelectedImage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="rounded-lg overflow-hidden max-h-[calc(100vh-12rem)]">
              <img
                src={selectedImage}
                alt="Full size"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptEngineeringPage;