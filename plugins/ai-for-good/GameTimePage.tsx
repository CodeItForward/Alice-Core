import React, { useState, useEffect } from 'react';
import { Video, BookOpen, Activity, CheckCircle, Clock, ArrowRight, ChevronDown, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import blindDrawImages from './blind_draw_images.json';

interface ProgressItem {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'activity';
  status: 'completed' | 'in-progress' | 'not-started';
  duration?: string;
  link: string;
  videoUrl?: string;
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

const GameTimePage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ProgressItem | null>(null);
  const [isDay1Expanded, setIsDay1Expanded] = useState(true);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [randomImage, setRandomImage] = useState('');

  // Automatically select the Game Time activity when the page loads
  useEffect(() => {
    const gameTime = progressItems.find(item => item.id === '3');
    if (gameTime) {
      setSelectedItem(gameTime);
    }
  }, []);

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

  const handleGetDrawing = () => {
    const randomIndex = Math.floor(Math.random() * blindDrawImages.length);
    setRandomImage(blindDrawImages[randomIndex]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">AI for Good</h2>
        <ul className="space-y-2">
          {progressItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => handleItemClick(item)}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                  selectedItem?.id === item.id ? 'bg-purple-100 text-purple-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {getTypeIcon(item.type)}
                <span className="ml-2">{item.title}</span>
                <StatusIndicator status={item.status} size="sm" className="ml-auto" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Blind Draw: Collaborative Group Activity</h2>
            <div className="prose prose-lg max-w-none">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Overview</h3>
              <p className="text-gray-700 mb-6">
                In this activity, you'll experience firsthand how communication, interpretation, and perspective impact problem-solving and teamwork. 
                One student receives a hidden image, describes it out loud, and others try to draw it based only on those instructions. 
                Then everyone reveals their drawings and compares results.
              </p>

              <h3 className="text-xl font-semibold text-purple-800 mb-4">Learning Objectives</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                <li>Practice giving and following clear, step-by-step instructions.</li>
                <li>Observe how language can lead to multiple interpretations.</li>
                <li>Reflect on the challenges and opportunities in human-AI and human-human communication.</li>
              </ul>

              <h3 className="text-xl font-semibold text-purple-800 mb-4">How It Works</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">1. Random Assignment</h4>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Each student receives a unique black-and-white line drawing from a shared image bank.</li>
                    <li>One student (the "Describer") is randomly chosen to instruct the group.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">2. The Describer's Role</h4>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Only the Describer can see the assigned drawing.</li>
                    <li>The Describer gives step-by-step verbal instructions to the group, describing the image as clearly as possible—without showing or sharing the image.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">3. The Group's Role</h4>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>All other students listen carefully and draw based only on the Describer's instructions.</li>
                    <li>No peeking at each other's work until the end!</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">4. Sharing Results</h4>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>After 5–10 minutes (or when the Describer is finished), everyone uploads or shares their drawing.</li>
                    <li>The original image is revealed for comparison.</li>
                    <li>Reflect and discuss: How did everyone's drawings differ? Where did misunderstandings occur? How could instructions be improved?</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-purple-800 mt-8 mb-4">Let's Get Started!</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Step 1: Assign Drawings</h4>
                  <p className="text-gray-700">Click "Get My Drawing" to receive your image. (Your image is unique!)</p>
                  <button 
                    onClick={handleGetDrawing} 
                    className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                  >
                    Get My Drawing
                  </button>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Step 2: The Describer is Chosen</h4>
                  <p className="text-gray-700">Your teacher will randomly select the Describer.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Step 3: Drawing Time</h4>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>The Describer uses the "View Drawing" button and begins describing.</li>
                    <li>All others use blank paper, a whiteboard tool, or upload their drawing digitally.</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Step 4: Reveal</h4>
                  <p className="text-gray-700">When time is up, share your drawing with the class.</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Step 5: Reflect</h4>
                  <p className="text-gray-700">Participate in the class discussion: What worked? What could have been communicated more clearly?</p>
                </div>
              </div>
            </div>
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
              <h3 className="font-semibold text-purple-800 mb-2">Up Next</h3>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Your Drawing</h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <img src={randomImage} alt="Random Drawing" className="w-full h-auto rounded" />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameTimePage; 