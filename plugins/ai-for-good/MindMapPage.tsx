import React, { useState, useEffect, useRef } from 'react';
import { Video, BookOpen, Activity, CheckCircle, Clock, ArrowRight, ChevronDown, ChevronRight, Lightbulb, Users, Target, Zap, MessageCircle, User, Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/context/AuthContext';
import { 
  getDesignThinkingChats, 
  getChannelMessages, 
  createWebSocketConnection,
  getUserTeamsByType,
  postMessage,
  type DesignThinkingChats,
  type ChatMessage,
  type WebSocketMessage,
  type Team
} from '../../core/services/api';

interface ProgressItem {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'activity';
  status: 'completed' | 'in-progress' | 'not-started';
  duration?: string;
  link: string;
  videoUrl?: string;
}

interface ConversationCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  teamId: number;
  channelId: number;
  messages: ChatMessage[];
  isActive: boolean;
  isLoading: boolean;
}

const progressItems: ProgressItem[] = [
  {
    id: '1',
    title: 'Welcome to AI for Good',
    type: 'video',
    status: 'completed',
    duration: '15 min',
    link: '/ai-for-good/welcome',
    videoUrl: 'https://www.youtube.com/embed/reLFHLlNBbk'
  },
  {
    id: '2',
    title: 'Intro to AI',
    type: 'video',
    status: 'in-progress',
    duration: '20 min',
    link: '/ai-for-good/intro-to-ai',
    videoUrl: 'https://www.youtube.com/embed/F26Ni2776hQ'
  },
  {
    id: '3',
    title: 'Game Time! Group Activity',
    type: 'activity',
    status: 'in-progress',
    duration: '45 min',
    link: '/ai-for-good/game-time'
  },
  {
    id: '4',
    title: 'Prompt Engineering Best Practices',
    type: 'reading',
    status: 'not-started',
    duration: '20 min',
    link: '/ai-for-good/prompt-best-practices'
  },
  {
    id: '5',
    title: 'Prompt Engineering Activity',
    type: 'activity',
    status: 'not-started',
    duration: '30 min',
    link: '/ai-for-good/prompt-engineering'
  },
  {
    id: '6',
    title: 'Teambuilding',
    type: 'activity',
    status: 'not-started',
    duration: '30 min',
    link: '/ai-for-good/teambuilding'
  },
  {
    id: '7',
    title: 'Design Thinking',
    type: 'activity',
    status: 'not-started',
    duration: '40 min',
    link: '/ai-for-good/mind-map'
  },
  {
    id: '8',
    title: 'Take Home: AI Ethics',
    type: 'reading',
    status: 'not-started',
    duration: '25 min',
    link: '/ai-for-good/ai-ethics'
  }
];

const getTypeIcon = (type: ProgressItem['type']) => {
  switch (type) {
    case 'video':
      return <Video size={16} className="text-blue-500" />;
    case 'reading':
      return <BookOpen size={16} className="text-purple-500" />;
    case 'activity':
      return <Activity size={16} className="text-orange-500" />;
  }
};

const getStatusIcon = (status: ProgressItem['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle size={16} className="text-green-500" />;
    case 'in-progress':
      return <Clock size={16} className="text-yellow-500" />;
    default:
      return null;
  }
};

// Helper function to get a consistent color for a user
const getUserColor = (userId: number): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
    '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71'
  ];
  return colors[userId % colors.length];
};

// Helper function to get user display name
const getUserDisplayName = (userId: number, displayName?: string): string => {
  if (userId === 1) return 'Alice';
  return displayName || `User ${userId}`;
};

// Helper function to get additional context for each conversation
const getAdditionalContext = (conversationType: 'persona' | 'problem'): string => {
  switch (conversationType) {
    case 'persona': return 'persona_helping';
    case 'problem': return 'problem_statement_empathy';
    default: return '';
  }
};

const StatusIndicator: React.FC<{ status: ProgressItem['status']; size?: 'sm' | 'md'; className?: string }> = ({ 
  status, 
  size = 'md',
  className = ''
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-full";
  const sizeClasses = size === 'sm' ? 'w-4 h-4 text-xs' : 'w-6 h-6 text-sm';
  
  switch (status) {
    case 'completed':
      return (
        <span className={`${baseClasses} ${sizeClasses} bg-green-100 text-green-800 ${className}`}>
          ✓
        </span>
      );
    case 'in-progress':
      return (
        <span className={`${baseClasses} ${sizeClasses} bg-yellow-100 text-yellow-800 ${className}`}>
          ⟳
        </span>
      );
    default:
      return (
        <span className={`${baseClasses} ${sizeClasses} bg-gray-100 text-gray-400 ${className}`}>
          ○
        </span>
      );
  }
};

const MindMapPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedItem, setSelectedItem] = useState<ProgressItem | null>(null);
  const [isDay1Expanded, setIsDay1Expanded] = useState(true);
  const [designThinkingChats, setDesignThinkingChats] = useState<DesignThinkingChats | null>(null);
  const [aiForGoodTeam, setAiForGoodTeam] = useState<Team | null>(null);
  
  // Persona conversation
  const [personaMessages, setPersonaMessages] = useState<ChatMessage[]>([]);
  const [personaResponse, setPersonaResponse] = useState('');
  const [personaWsConnected, setPersonaWsConnected] = useState(false);
  
  // Problem statement conversation
  const [problemMessages, setProblemMessages] = useState<ChatMessage[]>([]);
  const [problemResponse, setProblemResponse] = useState('');
  const [problemWsConnected, setProblemWsConnected] = useState(false);
  
  const [error, setError] = useState<string | null>(null);

  const personaWsRef = useRef<WebSocket | null>(null);
  const problemWsRef = useRef<WebSocket | null>(null);
  const navigate = useNavigate();

  // Simple cleanup function for WebSocket
  const cleanupWebSocket = (wsRef: React.MutableRefObject<WebSocket | null>) => {
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  // Load AI For Good team first
  useEffect(() => {
    const loadAiForGoodTeam = async () => {
      console.log('Loading AI For Good team, user:', user);
      if (!user) {
        console.log('No user found, skipping team load');
        return;
      }

      try {
        console.log('Loading AI For Good teams for user:', user.id, 'type: 4');
        const fetchedTeams = await getUserTeamsByType(parseInt(user.id), 4);
        console.log('Loaded AI For Good teams:', fetchedTeams);
        
        // Select the team with the highest TeamId (same logic as TeambuildingPage)
        if (fetchedTeams.length > 0) {
          const highestTeam = fetchedTeams.reduce((prev, current) => 
            (prev.TeamId > current.TeamId) ? prev : current
          );
          console.log('Selected highest AI For Good team:', highestTeam);
          setAiForGoodTeam(highestTeam);
        } else {
          console.log('No AI For Good teams found for user');
          setError('No AI For Good teams found for this user');
        }
      } catch (error) {
        console.error('Error loading AI For Good teams:', error);
        setError('Failed to load AI For Good teams');
      }
    };

    loadAiForGoodTeam();
  }, [user]);

  // Load design thinking chats when AI For Good team is available
  useEffect(() => {
    const loadDesignThinkingChats = async () => {
      console.log('Loading design thinking chats, user:', user, 'team:', aiForGoodTeam);
      if (!user || !aiForGoodTeam) {
        console.log('No user or team found, skipping API call');
        return;
      }

      try {
        console.log('Calling getDesignThinkingChats with teamId:', aiForGoodTeam.TeamId, 'userId:', parseInt(user.id));
        const chats = await getDesignThinkingChats(aiForGoodTeam.TeamId, parseInt(user.id));
        console.log('Received chats:', chats);
        setDesignThinkingChats(chats);
      } catch (error) {
        console.error('Error loading design thinking chats:', error);
        setError('Failed to load design thinking chats');
      }
    };

    loadDesignThinkingChats();
  }, [user, aiForGoodTeam]);

  // Setup Persona WebSocket connection
  useEffect(() => {
    if (!user || !aiForGoodTeam || !designThinkingChats) return;

    const setupPersonaWebSocket = () => {
      cleanupWebSocket(personaWsRef);
      
      console.log('Setting up Persona WebSocket with teamId:', designThinkingChats.PersonaHelping, 'channelId:', designThinkingChats.PersonaHelping);
      
      const ws = createWebSocketConnection(
        designThinkingChats.PersonaHelping,
        designThinkingChats.PersonaHelping,
        (data: WebSocketMessage) => {
          setPersonaWsConnected(true);
          setError(null);
          
          if (data.content && data.user_id && data.created_at) {
            const newMessage: ChatMessage = {
              MessageId: data.message_id || Date.now(),
              ChannelId: designThinkingChats.PersonaHelping,
              UserId: data.user_id,
              Text: data.content,
              Timestamp: data.created_at,
              ReplyToMessageId: data.reply_to_message_id || null,
              user: {
                UserId: data.user_id,
                DisplayName: data.display_name || `User ${data.user_id}`,
                Email: ''
              },
              type: data.type || 'text',
              video_url: data.video_url || undefined,
              image_url: data.image_url || undefined
            };

            setPersonaMessages(prev => [...prev, newMessage]);
          }
        },
        (error) => {
          console.error('Persona WebSocket error:', error);
          setPersonaWsConnected(false);
          setError('Persona connection error occurred');
        },
        (event) => {
          setPersonaWsConnected(false);
          if (event.code !== 1000) {
            setError('Persona connection lost. Messages will be sent via REST API.');
          }
        }
      );

      personaWsRef.current = ws;

      // Send user_id and additional context immediately after connection
      ws.onopen = () => {
        console.log('Persona WebSocket connected, sending user_id and additional context');
        const additionalContext = getAdditionalContext('persona');
        
        const joinMessage = {
          user_id: parseInt(user.id),
          additional_context: [additionalContext]
        };
        ws.send(JSON.stringify(joinMessage));
        console.log('=== PERSONA WEBSOCKET JOIN MESSAGE SENT ===');
        console.log('Additional Context:', additionalContext);
        console.log('Join Message JSON:', JSON.stringify(joinMessage, null, 2));
        console.log('===========================================');
      };
    };

    setupPersonaWebSocket();

    return () => {
      cleanupWebSocket(personaWsRef);
    };
  }, [user, aiForGoodTeam, designThinkingChats]);

  // Setup Problem WebSocket connection
  useEffect(() => {
    if (!user || !aiForGoodTeam || !designThinkingChats) return;

    const setupProblemWebSocket = () => {
      cleanupWebSocket(problemWsRef);
      
      console.log('Setting up Problem WebSocket with teamId:', designThinkingChats.ProblemStatementEmpathy, 'channelId:', designThinkingChats.ProblemStatementEmpathy);
      
      const ws = createWebSocketConnection(
        designThinkingChats.ProblemStatementEmpathy,
        designThinkingChats.ProblemStatementEmpathy,
        (data: WebSocketMessage) => {
          setProblemWsConnected(true);
          setError(null);
          
          if (data.content && data.user_id && data.created_at) {
            const newMessage: ChatMessage = {
              MessageId: data.message_id || Date.now(),
              ChannelId: designThinkingChats.ProblemStatementEmpathy,
              UserId: data.user_id,
              Text: data.content,
              Timestamp: data.created_at,
              ReplyToMessageId: data.reply_to_message_id || null,
              user: {
                UserId: data.user_id,
                DisplayName: data.display_name || `User ${data.user_id}`,
                Email: ''
              },
              type: data.type || 'text',
              video_url: data.video_url || undefined,
              image_url: data.image_url || undefined
            };

            setProblemMessages(prev => [...prev, newMessage]);
          }
        },
        (error) => {
          console.error('Problem WebSocket error:', error);
          setProblemWsConnected(false);
          setError('Problem connection error occurred');
        },
        (event) => {
          setProblemWsConnected(false);
          if (event.code !== 1000) {
            setError('Problem connection lost. Messages will be sent via REST API.');
          }
        }
      );

      problemWsRef.current = ws;

      // Send user_id and additional context immediately after connection
      ws.onopen = () => {
        console.log('Problem WebSocket connected, sending user_id and additional context');
        const additionalContext = getAdditionalContext('problem');
        
        const joinMessage = {
          user_id: parseInt(user.id),
          additional_context: [additionalContext]
        };
        ws.send(JSON.stringify(joinMessage));
        console.log('=== PROBLEM WEBSOCKET JOIN MESSAGE SENT ===');
        console.log('Additional Context:', additionalContext);
        console.log('Join Message JSON:', JSON.stringify(joinMessage, null, 2));
        console.log('===========================================');
      };
    };

    setupProblemWebSocket();

    return () => {
      cleanupWebSocket(problemWsRef);
    };
  }, [user, aiForGoodTeam, designThinkingChats]);

  // Automatically select the Design Thinking activity when the page loads
  useEffect(() => {
    const designThinking = progressItems.find(item => item.id === '7');
    if (designThinking) {
      setSelectedItem(designThinking);
    }
  }, []);

  const handleItemClick = (item: ProgressItem) => {
    setSelectedItem(item);
    navigate(item.link);
  };

  const handleNextClick = () => {
    if (!selectedItem) return;
    
    const currentIndex = progressItems.findIndex(item => item.id === selectedItem.id);
    if (currentIndex < progressItems.length - 1) {
      const nextItem = progressItems[currentIndex + 1];
      setSelectedItem(nextItem);
      navigate(nextItem.link);
    }
  };

  const getNextButtonState = () => {
    if (!selectedItem) return { disabled: true, text: 'No item selected' };
    
    const currentIndex = progressItems.findIndex(item => item.id === selectedItem.id);
    if (currentIndex === progressItems.length - 1) {
      return { disabled: true, text: 'All steps completed' };
    }
    
    const nextItem = progressItems[currentIndex + 1];
    return {
      disabled: false,
      text: `Next: ${nextItem.title}`
    };
  };

  const handlePersonaResponse = async () => {
    if (!personaResponse.trim() || !user || !designThinkingChats) return;

    const messageText = personaResponse.trim();
    setPersonaResponse('');

    try {
      if (personaWsRef.current && personaWsRef.current.readyState === WebSocket.OPEN && personaWsConnected) {
        const message = {
          type: 'message',
          content: messageText,
          video_url: null,
          image_url: null,
          user_id: parseInt(user.id),
          reply_to_message_id: null
        };

        console.log('=== PERSONA MESSAGE SENT ===');
        console.log('Message JSON:', JSON.stringify(message, null, 2));
        console.log('============================');
        personaWsRef.current.send(JSON.stringify(message));
      } else {
        // Fallback to REST API
        console.log('Persona WebSocket not available, using REST API fallback');
        const response = await postMessage(
          designThinkingChats.PersonaHelping, 
          designThinkingChats.PersonaHelping, 
          parseInt(user.id), 
          messageText, 
          null, 
          []
        );
        console.log('Sent persona message via REST API:', response);
        
        // Add message to local state
        const newMessage: ChatMessage = {
          MessageId: response.message_id,
          ChannelId: designThinkingChats.PersonaHelping,
          UserId: parseInt(user.id),
          Text: messageText,
          Timestamp: new Date().toISOString(),
          ReplyToMessageId: null,
          user: {
            UserId: parseInt(user.id),
            DisplayName: user.displayName || 'You',
            Email: user.email || ''
          }
        };

        setPersonaMessages(prev => [...prev, newMessage]);
      }
    } catch (error) {
      console.error('Error sending persona message:', error);
      setError('Failed to send persona message');
    }
  };

  const handleProblemResponse = async () => {
    if (!problemResponse.trim() || !user || !designThinkingChats) return;

    const messageText = problemResponse.trim();
    setProblemResponse('');

    try {
      if (problemWsRef.current && problemWsRef.current.readyState === WebSocket.OPEN && problemWsConnected) {
        const message = {
          type: 'message',
          content: messageText,
          video_url: null,
          image_url: null,
          user_id: parseInt(user.id),
          reply_to_message_id: null
        };

        console.log('=== PROBLEM MESSAGE SENT ===');
        console.log('Message JSON:', JSON.stringify(message, null, 2));
        console.log('============================');
        problemWsRef.current.send(JSON.stringify(message));
      } else {
        // Fallback to REST API
        console.log('Problem WebSocket not available, using REST API fallback');
        const response = await postMessage(
          designThinkingChats.ProblemStatementEmpathy, 
          designThinkingChats.ProblemStatementEmpathy, 
          parseInt(user.id), 
          messageText, 
          null, 
          []
        );
        console.log('Sent problem message via REST API:', response);
        
        // Add message to local state
        const newMessage: ChatMessage = {
          MessageId: response.message_id,
          ChannelId: designThinkingChats.ProblemStatementEmpathy,
          UserId: parseInt(user.id),
          Text: messageText,
          Timestamp: new Date().toISOString(),
          ReplyToMessageId: null,
          user: {
            UserId: parseInt(user.id),
            DisplayName: user.displayName || 'You',
            Email: user.email || ''
          }
        };

        setProblemMessages(prev => [...prev, newMessage]);
      }
    } catch (error) {
      console.error('Error sending problem message:', error);
      setError('Failed to send problem message');
    }
  };

  const nextButtonState = getNextButtonState();

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
                    {getTypeIcon(item.type)}
                    <span className="flex-1">{item.title}</span>
                    <StatusIndicator status={item.status} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden pt-12">
        {/* Instructions */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold">Design Thinking Workshop</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {/* TODO: Add reset functionality */}}
                className="flex items-center text-red-600 hover:text-red-700"
              >
                <Zap size={16} className="mr-2" />
                Reset Session
              </button>
            </div>
          </div>
          <div className="prose max-w-none">
            <p className="text-gray-600">
              Use the Design Thinking methodology to solve problems creatively. Start with the Persona Builder to understand your users, then move through Define and Ideate stages.
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Single Panel - Persona Builder & Design Thinking Process */}
          <div className="w-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Persona Builder Conversation */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Users size={16} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Persona Builder</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Build empathy and understand your users better. Chat with AI to explore who you're helping and their needs.
                  </p>
                  
                  {/* Chat Messages */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="space-y-3">
                      {personaMessages.map((message, index) => {
                        const isCurrentUser = user && message.UserId === parseInt(user.id);
                        const userColor = getUserColor(message.UserId);
                        const displayName = getUserDisplayName(message.UserId, message.user?.DisplayName);
                        
                        return (
                          <div key={index} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                              {/* User Avatar */}
                              <div className={`flex-shrink-0 ${isCurrentUser ? 'ml-3' : 'mr-3'}`}>
                                <div 
                                  className="h-8 w-8 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: userColor }}
                                >
                                  <span className="text-white text-xs font-bold">
                                    {displayName.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              {/* User Message Bubble */}
                              <div>
                                <div 
                                  className={`rounded-2xl px-4 py-3 ${isCurrentUser ? 'rounded-tr-none' : 'rounded-tl-none'}`}
                                  style={{ 
                                    backgroundColor: isCurrentUser ? userColor : '#f3f4f6',
                                    color: isCurrentUser ? 'white' : '#374151'
                                  }}
                                >
                                  <div className="text-sm">
                                    {message.Text}
                                  </div>
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
                                <div className={`mt-1 text-xs text-gray-500 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                                  {displayName} · {new Date(message.Timestamp).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Response Input */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={personaResponse}
                      onChange={(e) => setPersonaResponse(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handlePersonaResponse()}
                      placeholder="Type your response..."
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handlePersonaResponse}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Send
                    </button>
                  </div>
                </div>

                {/* Problem Statement Generation */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <Target size={16} className="text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Problem Statement Generation</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Based on your persona insights, define the core problem you're trying to solve. Be specific and empathetic.
                  </p>
                  
                  {/* Chat Messages */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <div className="space-y-3">
                      {problemMessages.map((message, index) => {
                        const isCurrentUser = user && message.UserId === parseInt(user.id);
                        const userColor = getUserColor(message.UserId);
                        const displayName = getUserDisplayName(message.UserId, message.user?.DisplayName);
                        
                        return (
                          <div key={index} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                              {/* User Avatar */}
                              <div className={`flex-shrink-0 ${isCurrentUser ? 'ml-3' : 'mr-3'}`}>
                                <div 
                                  className="h-8 w-8 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: userColor }}
                                >
                                  <span className="text-white text-xs font-bold">
                                    {displayName.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              {/* User Message Bubble */}
                              <div>
                                <div 
                                  className={`rounded-2xl px-4 py-3 ${isCurrentUser ? 'rounded-tr-none' : 'rounded-tl-none'}`}
                                  style={{ 
                                    backgroundColor: isCurrentUser ? userColor : '#f3f4f6',
                                    color: isCurrentUser ? 'white' : '#374151'
                                  }}
                                >
                                  <div className="text-sm">
                                    {message.Text}
                                  </div>
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
                                <div className={`mt-1 text-xs text-gray-500 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                                  {displayName} · {new Date(message.Timestamp).toLocaleTimeString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Response Input */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={problemResponse}
                      onChange={(e) => setProblemResponse(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleProblemResponse()}
                      placeholder="Type your response..."
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      onClick={handleProblemResponse}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
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

export default MindMapPage; 