import React, { useState, useEffect, useRef } from 'react';
import { Video, BookOpen, Activity, CheckCircle, Clock, ArrowRight, ChevronDown, ChevronRight, Lightbulb, Users, Target, Zap, MessageCircle, User, Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  responses: string[];
  isActive: boolean;
}

interface ProblemCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  responses: string[];
  isActive: boolean;
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
  const [selectedItem, setSelectedItem] = useState<ProgressItem | null>(null);
  const [isDay1Expanded, setIsDay1Expanded] = useState(true);
  const [conversationCards, setConversationCards] = useState<ConversationCard[]>([
    {
      id: 'who',
      title: 'Who are you helping?',
      icon: <User size={16} />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      responses: [],
      isActive: false
    },
    {
      id: 'hard',
      title: "What's hard for them?",
      icon: <Heart size={16} />,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      responses: [],
      isActive: false
    },
    {
      id: 'best',
      title: 'Best day ever?',
      icon: <Star size={16} />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      responses: [],
      isActive: false
    },
    {
      id: 'care',
      title: 'Why do we care?',
      icon: <MessageCircle size={16} />,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      responses: [],
      isActive: false
    }
  ]);
  const [problemCards, setProblemCards] = useState<ProblemCard[]>([
    {
      id: 'empathy',
      title: 'Empathy check in',
      icon: <Heart size={16} />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      responses: [],
      isActive: false
    },
    {
      id: 'help',
      title: 'How can we help?',
      icon: <Target size={16} />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      responses: [],
      isActive: false
    },
    {
      id: 'matter',
      title: 'Why does that matter?',
      icon: <Lightbulb size={16} />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      responses: [],
      isActive: false
    }
  ]);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [activeProblemCard, setActiveProblemCard] = useState<string | null>(null);
  const [currentResponse, setCurrentResponse] = useState('');
  const [currentProblemResponse, setCurrentProblemResponse] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const problemChatEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Auto-scroll to bottom when conversation updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationCards]);

  // Auto-scroll to bottom when problem conversation updates
  useEffect(() => {
    problemChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [problemCards]);

  // Automatically select the Design Thinking activity when the page loads
  useEffect(() => {
    const designThinking = progressItems.find(item => item.id === '7');
    if (designThinking) {
      setSelectedItem(designThinking);
    }
  }, []);

  // Automatically select the "Who are you helping?" card when the page loads
  useEffect(() => {
    setActiveCard('who');
    setConversationCards(prev => prev.map(card => ({
      ...card,
      isActive: card.id === 'who'
    })));
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

  const handleCardClick = (cardId: string) => {
    setActiveCard(cardId);
    setConversationCards(prev => prev.map(card => ({
      ...card,
      isActive: card.id === cardId
    })));
  };

  const handleAddResponse = () => {
    if (!currentResponse.trim() || !activeCard) return;

    setConversationCards(prev => prev.map(card => 
      card.id === activeCard 
        ? { ...card, responses: [...card.responses, currentResponse.trim()] }
        : card
    ));
    setCurrentResponse('');
  };

  const handleRemoveResponse = (cardId: string, responseIndex: number) => {
    setConversationCards(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, responses: card.responses.filter((_, index) => index !== responseIndex) }
        : card
    ));
  };

  const handleProblemCardClick = (cardId: string) => {
    setActiveProblemCard(cardId);
    setProblemCards(prev => prev.map(card => ({
      ...card,
      isActive: card.id === cardId
    })));
  };

  const handleAddProblemResponse = () => {
    if (!currentProblemResponse.trim() || !activeProblemCard) return;

    setProblemCards(prev => prev.map(card => 
      card.id === activeProblemCard 
        ? { ...card, responses: [...card.responses, currentProblemResponse.trim()] }
        : card
    ));
    setCurrentProblemResponse('');
  };

  const handleRemoveProblemResponse = (cardId: string, responseIndex: number) => {
    setProblemCards(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, responses: card.responses.filter((_, index) => index !== responseIndex) }
        : card
    ));
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
          {/* Left Side - Persona Builder & Design Thinking Process */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Persona Builder */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Users size={16} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Persona Builder</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Use these conversation cards to build empathy and understand your users better. Click on each card to start a conversation.
                  </p>
                  
                  {/* Conversation Cards */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {conversationCards.map((card) => (
                      <button
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          card.isActive 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-8 h-8 ${card.bgColor} rounded-full flex items-center justify-center mb-2`}>
                          <div className={card.color}>{card.icon}</div>
                        </div>
                        <h4 className="text-sm font-medium text-gray-800 text-left">{card.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {card.responses.length} responses
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Active Conversation */}
                  {activeCard && (
                    <div className="border-t pt-4">
                      {(() => {
                        const activeCardData = conversationCards.find(c => c.id === activeCard);
                        if (!activeCardData) return null;
                        
                        return (
                          <div className="flex items-center mb-3">
                            <div className={`w-6 h-6 ${activeCardData.bgColor} rounded-full flex items-center justify-center mr-2`}>
                              <div className={activeCardData.color}>{activeCardData.icon}</div>
                            </div>
                            <h4 className="font-medium text-gray-800">
                              {activeCardData.title}
                            </h4>
                          </div>
                        );
                      })()}
                      
                      {/* Chat Messages */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <div className="space-y-3">
                          {/* AI Bot Message */}
                          <div className="flex justify-start">
                            <div className="flex max-w-[80%] flex-row">
                              {/* AI Avatar */}
                              <div className="flex-shrink-0 mr-3">
                                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">AI</span>
                                </div>
                              </div>
                              {/* AI Message Bubble */}
                              <div>
                                <div className="bg-blue-100 border border-blue-200 shadow-sm rounded-2xl px-4 py-3 rounded-tl-none">
                                  <div className="text-sm text-gray-700">
                                    {activeCard === 'who' && "Tell me about the person you're trying to help. What's their role, background, or situation?"}
                                    {activeCard === 'hard' && "What challenges or frustrations does this person face? What makes their life difficult?"}
                                    {activeCard === 'best' && "Describe their ideal day or perfect experience. What would make them really happy?"}
                                    {activeCard === 'care' && "Why is solving this person's problem important? What impact would it have?"}
                                  </div>
                                </div>
                                <div className="mt-1 text-xs text-gray-500 text-left">
                                  AI Assistant · Just now
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* User Responses */}
                          {(() => {
                            const activeCardData = conversationCards.find(c => c.id === activeCard);
                            if (!activeCardData || activeCardData.responses.length === 0) return null;
                            
                            return activeCardData.responses.map((response, index) => (
                              <div key={index} className="flex justify-end">
                                <div className="flex max-w-[80%] flex-row-reverse">
                                  {/* User Avatar */}
                                  <div className="flex-shrink-0 ml-3">
                                    <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">You</span>
                                    </div>
                                  </div>
                                  {/* User Message Bubble */}
                                  <div>
                                    <div className="bg-purple-600 text-white rounded-2xl px-4 py-3 rounded-tr-none">
                                      <div className="text-sm">
                                        {response}
                                      </div>
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500 text-right">
                                      You · Just now
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ));
                          })()}

                          {/* Auto-scroll anchor */}
                          <div ref={chatEndRef} />
                        </div>
                      </div>

                      {/* Response Input */}
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={currentResponse}
                          onChange={(e) => setCurrentResponse(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddResponse()}
                          placeholder="Type your response..."
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={handleAddResponse}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Problem Statement Generator */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <Target size={16} className="text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Problem Statement Generator</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Use these conversation cards to define the core problem you're trying to solve. Build on your persona insights to create a clear problem statement.
                  </p>
                  
                  {/* Problem Conversation Cards */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {problemCards.map((card) => (
                      <button
                        key={card.id}
                        onClick={() => handleProblemCardClick(card.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          card.isActive 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-8 h-8 ${card.bgColor} rounded-full flex items-center justify-center mb-2`}>
                          <div className={card.color}>{card.icon}</div>
                        </div>
                        <h4 className="text-sm font-medium text-gray-800 text-left">{card.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {card.responses.length} responses
                        </p>
                      </button>
                    ))}
                  </div>

                  {/* Active Problem Conversation */}
                  {activeProblemCard && (
                    <div className="border-t pt-4">
                      {(() => {
                        const activeCardData = problemCards.find(c => c.id === activeProblemCard);
                        if (!activeCardData) return null;
                        
                        return (
                          <div className="flex items-center mb-3">
                            <div className={`w-6 h-6 ${activeCardData.bgColor} rounded-full flex items-center justify-center mr-2`}>
                              <div className={activeCardData.color}>{activeCardData.icon}</div>
                            </div>
                            <h4 className="font-medium text-gray-800">
                              {activeCardData.title}
                            </h4>
                          </div>
                        );
                      })()}
                      
                      {/* Problem Chat Messages */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <div className="space-y-3">
                          {/* AI Bot Message */}
                          <div className="flex justify-start">
                            <div className="flex max-w-[80%] flex-row">
                              {/* AI Avatar */}
                              <div className="flex-shrink-0 mr-3">
                                <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">AI</span>
                                </div>
                              </div>
                              {/* AI Message Bubble */}
                              <div>
                                <div className="bg-purple-100 border border-purple-200 shadow-sm rounded-2xl px-4 py-3 rounded-tl-none">
                                  <div className="text-sm text-gray-700">
                                    {activeProblemCard === 'empathy' && "If they could magically fix one thing in their world, what would it be?"}
                                    {activeProblemCard === 'help' && "Think about your person or cause. What do they need help with right now? What's the one thing they wish someone could fix?"}
                                    {activeProblemCard === 'matter' && "Now tell me why that need is important. What could change for the better if that problem got solved?"}
                                  </div>
                                </div>
                                <div className="mt-1 text-xs text-gray-500 text-left">
                                  AI Assistant · Just now
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* User Problem Responses */}
                          {(() => {
                            const activeCardData = problemCards.find(c => c.id === activeProblemCard);
                            if (!activeCardData || activeCardData.responses.length === 0) return null;
                            
                            return activeCardData.responses.map((response, index) => (
                              <div key={index} className="flex justify-end">
                                <div className="flex max-w-[80%] flex-row-reverse">
                                  {/* User Avatar */}
                                  <div className="flex-shrink-0 ml-3">
                                    <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">You</span>
                                    </div>
                                  </div>
                                  {/* User Message Bubble */}
                                  <div>
                                    <div className="bg-purple-600 text-white rounded-2xl px-4 py-3 rounded-tr-none">
                                      <div className="text-sm">
                                        {response}
                                      </div>
                                    </div>
                                    <div className="mt-1 text-xs text-gray-500 text-right">
                                      You · Just now
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ));
                          })()}
                          
                          {/* Auto-scroll anchor */}
                          <div ref={problemChatEndRef} />
                        </div>
                      </div>

                      {/* Problem Response Input */}
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={currentProblemResponse}
                          onChange={(e) => setCurrentProblemResponse(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddProblemResponse()}
                          placeholder="Type your response..."
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          onClick={handleAddProblemResponse}
                          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Ideate Stage */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <Lightbulb size={16} className="text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">3. Ideate</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Generate a wide range of creative solutions. Don't limit yourself - quantity over quality at this stage.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="text" placeholder="Add an idea..." className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                      <button className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition text-sm">
                        Add
                      </button>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">Brainstorm with your team</div>
                      <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">Use mind mapping techniques</div>
                      <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">Consider wild and crazy ideas</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Persona Summary */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Persona Summary */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <User size={16} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Your Persona Summary</h3>
                </div>
                
                {conversationCards.some(card => card.responses.length > 0) ? (
                  <div className="space-y-4">
                    {conversationCards.map((card) => (
                      card.responses.length > 0 && (
                        <div key={card.id} className="border-l-4 border-blue-200 pl-4">
                          <div className="flex items-center mb-2">
                            <div className={`w-6 h-6 ${card.bgColor} rounded-full flex items-center justify-center mr-2`}>
                              <div className={card.color}>{card.icon}</div>
                            </div>
                            <h4 className="font-medium text-gray-800">{card.title}</h4>
                          </div>
                          <div className="space-y-1">
                            {card.responses.map((response, index) => (
                              <p key={index} className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                                {response}
                              </p>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <MessageCircle size={32} className="mx-auto" />
                    </div>
                    <p className="text-gray-500">Start conversations with the cards on the left to build your persona</p>
                  </div>
                )}
              </div>

              {/* Problem Statement Summary */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <Target size={16} className="text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Problem Statement Summary</h3>
                </div>
                
                {problemCards.some(card => card.responses.length > 0) ? (
                  <div className="space-y-4">
                    {problemCards.map((card) => (
                      card.responses.length > 0 && (
                        <div key={card.id} className="border-l-4 border-purple-200 pl-4">
                          <div className="flex items-center mb-2">
                            <div className={`w-6 h-6 ${card.bgColor} rounded-full flex items-center justify-center mr-2`}>
                              <div className={card.color}>{card.icon}</div>
                            </div>
                            <h4 className="font-medium text-gray-800">{card.title}</h4>
                          </div>
                          <div className="space-y-1">
                            {card.responses.map((response, index) => (
                              <p key={index} className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
                                {response}
                              </p>
                            ))}
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">
                      <Target size={32} className="mx-auto" />
                    </div>
                    <p className="text-gray-500">Start problem conversations to define your core challenge</p>
                  </div>
                )}
              </div>

              {/* Next Steps */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-purple-800 mb-2">Next Steps</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Stage</span>
                    <span className="font-semibold text-blue-600">Persona Building</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: '20%' }}></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Complete your persona to move forward with problem definition and ideation.
                  </p>
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