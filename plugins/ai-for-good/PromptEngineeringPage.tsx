import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Video, MessageSquare, Image as ImageIcon, Save, X, BookOpen, Activity } from 'lucide-react';

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
  const [selectedItem, setSelectedItem] = useState<ProgressItem | null>(null);
  const [comicPanels, setComicPanels] = useState<ComicPanel[]>([
    { id: 1, imageUrl: '', caption: '' },
    { id: 2, imageUrl: '', caption: '' },
    { id: 3, imageUrl: '', caption: '' },
    { id: 4, imageUrl: '', caption: '' }
  ]);
  const [chatMessage, setChatMessage] = useState('');
  const [showVideo, setShowVideo] = useState(true);

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

  const nextButtonState = {
    text: 'Next Activity',
    disabled: !selectedItem || selectedItem.id === progressItems[progressItems.length - 1].id
  };

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
                {item.type === 'video' ? <Video size={16} /> : 
                 item.type === 'reading' ? <BookOpen size={16} /> : 
                 <Activity size={16} />}
                <span className="ml-2">{item.title}</span>
                <div className={`ml-auto w-2 h-2 rounded-full ${
                  item.status === 'completed' ? 'bg-green-500' :
                  item.status === 'in-progress' ? 'bg-yellow-500' :
                  'bg-gray-300'
                }`} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
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
            <div className="flex-1 overflow-y-auto p-4">
              {/* Chat messages will go here */}
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-purple-800">
                    Hi! I'm here to help you create your comic strip. What kind of story would you like to tell?
                  </p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
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
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    {panel.imageUrl ? (
                      <img src={panel.imageUrl} alt={`Panel ${panel.id}`} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <div className="text-gray-400">
                        <ImageIcon size={32} />
                        <p className="mt-2">No image yet</p>
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