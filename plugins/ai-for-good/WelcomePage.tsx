import React, { useState, useEffect } from 'react';
import { Video, BookOpen, Activity, CheckCircle, Clock } from 'lucide-react';

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
    title: 'Introduction to AI for Good',
    type: 'video',
    status: 'completed',
    duration: '15 min',
    link: '/ai-for-good/welcome',
    videoUrl: 'https://www.youtube.com/embed/reLFHLlNBbk'
  },
  {
    id: '2',
    title: 'Understanding AI Ethics',
    type: 'reading',
    status: 'in-progress',
    duration: '20 min',
    link: '/ai-for-good/workspace'
  },
  {
    id: '3',
    title: 'Team Formation Activity',
    type: 'activity',
    status: 'not-started',
    duration: '30 min',
    link: '/ai-for-good/workspace'
  },
  {
    id: '4',
    title: 'AI Tools Overview',
    type: 'video',
    status: 'not-started',
    duration: '25 min',
    link: '/ai-for-good/workspace'
  },
  {
    id: '5',
    title: 'Project Planning Guide',
    type: 'reading',
    status: 'not-started',
    duration: '15 min',
    link: '/ai-for-good/workspace'
  }
];

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

const WelcomePage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ProgressItem | null>(null);

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

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Your Progress</h2>
        <div className="space-y-2">
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
                {getStatusIcon(item.status)}
              </div>
            </button>
          ))}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-purple-800 mb-2">Current Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-semibold text-green-600">1/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-blue-800 mb-2">Next Steps</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <Clock size={16} className="mr-2 text-yellow-500" />
                    Continue reading "Understanding AI Ethics"
                  </li>
                  <li className="flex items-center text-gray-600">
                    <Activity size={16} className="mr-2 text-orange-500" />
                    Complete the Team Formation Activity
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage; 