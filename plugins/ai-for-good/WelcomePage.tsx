import React, { useState, useEffect } from 'react';
import { Video, BookOpen, Activity, CheckCircle, Clock, ArrowRight, ChevronDown, ChevronRight } from 'lucide-react';
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

interface StatusIndicatorProps {
  status: ProgressItem['status'];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const statusClasses = {
    'completed': 'bg-green-500',
    'in-progress': 'bg-yellow-500 animate-pulse',
    'not-started': 'bg-gray-300'
  };

  return (
    <div className={`${sizeClasses[size]} ${statusClasses[status]} rounded-full ${className}`} />
  );
};

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
    link: '/ai-for-good/intro-to-ai'
  },
  {
    id: '3',
    title: 'Prompt Engineering Activity',
    type: 'activity',
    status: 'not-started',
    duration: '30 min',
    link: '/ai-for-good/prompt-engineering'
  },
  {
    id: '4',
    title: 'Game Time! Group Activity',
    type: 'activity',
    status: 'not-started',
    duration: '45 min',
    link: '/ai-for-good/game-time'
  },
  {
    id: '5',
    title: 'Teambuilding',
    type: 'activity',
    status: 'not-started',
    duration: '30 min',
    link: '/ai-for-good/teambuilding'
  },
  {
    id: '6',
    title: 'Mind Map Jam',
    type: 'activity',
    status: 'not-started',
    duration: '40 min',
    link: '/ai-for-good/mind-map'
  },
  {
    id: '7',
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

const WelcomePage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ProgressItem | null>(null);
  const [isDay1Expanded, setIsDay1Expanded] = useState(true);
  const navigate = useNavigate();

  // Automatically select the Introduction video when the page loads
  useEffect(() => {
    const introVideo = progressItems.find(item => item.id === '1');
    if (introVideo) {
      setSelectedItem(introVideo);
    }
  }, []);

  const handleItemClick = (item: ProgressItem) => {
    setSelectedItem(item);
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

  const nextButtonState = getNextButtonState();

  return (
    <div className="flex h-full bg-gray-50">
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white p-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Journey Hub</h3>
          <p className="text-gray-500">Track your learning progress and access course materials</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Welcome to Your AI for Good Journey</h2>
              <p className="text-gray-700 mb-4">
                This platform is designed to help you and your team collaborate on projects that leverage AI for positive impact. 
                Use the progress tracker on the left to navigate through the course materials and track your learning journey.
              </p>
              {selectedItem?.id === '1' && selectedItem.videoUrl && (
                <div className="mt-4">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src={selectedItem.videoUrl}
                      title="Introduction to AI for Good"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                    ></iframe>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-purple-800 mb-2">Current Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-semibold text-green-600">
                      {progressItems.filter(item => item.status === 'completed').length}/{progressItems.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${(progressItems.filter(item => item.status === 'completed').length / progressItems.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-blue-800 mb-2">Next Steps</h3>
                <ul className="space-y-2">
                  {progressItems
                    .filter(item => item.status !== 'completed')
                    .slice(0, 2)
                    .map(item => (
                      <li key={item.id} className="flex items-center text-gray-600">
                        {getTypeIcon(item.type)}
                        <span className="ml-2">{item.title}</span>
                        <StatusIndicator status={item.status} size="sm" className="ml-2" />
                      </li>
                    ))}
                </ul>
              </div>

              {/* Next Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleNextClick}
                  disabled={nextButtonState.disabled}
                  className={`flex items-center px-4 py-2 rounded-md text-white font-medium transition-colors duration-200 ${
                    nextButtonState.disabled
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  <span>{nextButtonState.text}</span>
                  <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage; 