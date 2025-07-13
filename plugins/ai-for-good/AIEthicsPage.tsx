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
    title: 'Take Home: AI Safety',
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

const AIEthicsPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ProgressItem | null>(null);
  const [isDay1Expanded, setIsDay1Expanded] = useState(true);
  const navigate = useNavigate();

  // Automatically select the AI Safety reading when the page loads
  useEffect(() => {
    const aiEthics = progressItems.find(item => item.id === '8');
    if (aiEthics) {
      setSelectedItem(aiEthics);
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
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Take Home: AI Safety</h2>
              
              <div className="prose prose-lg max-w-none">
                <h3 className="text-xl font-semibold mb-4 text-purple-700">🤖 AI Safety: What Every Young Creator Should Know</h3>
                <p className="mb-4">
                  Please read this page at home with a parent or caregiver. You'll be using AI more independently tomorrow, so it's important to build good habits!
                </p>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="text-lg font-semibold mb-2 text-gray-800">Today, we worked on:</h4>
                  <ul className="space-y-1">
                    <li>💬 Prompt Engineering (learning how to ask great questions)</li>
                    <li>🤝 Teamwork</li>
                    <li>🧩 Defining the problem we want to solve</li>
                  </ul>
                </div>

                <p className="mb-6">
                  Tomorrow, you'll begin using AI tools more on your own to design solutions, create stories, and explore ideas. AI can be a fun and powerful partner—but only if we use it safely and wisely.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-purple-700">Key AI Safety Principles</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">🧠 1. AI Doesn't Think—It Predicts</h4>
                    <p className="mb-2">
                      AI tools like ChatGPT don't have thoughts, feelings, or opinions. They don't "know" facts the way people do—they just predict what words usually come next based on patterns from things people have written.
                    </p>
                    <p className="mb-2">Sometimes AI will sound very convincing, friendly, or even caring. But:</p>
                    <ul className="list-disc pl-6 mb-2 space-y-1">
                      <li>It is not your friend, even if it seems like it understands you.</li>
                      <li>It doesn't care about you, no matter what it says.</li>
                      <li>It can't replace a real person for serious topics like your health, your safety, or your emotions.</li>
                    </ul>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800 font-medium">
                        👉 Always talk to a trusted adult—like your parents, a teacher, or a doctor—if you have personal questions or need help. AI should never replace a real human in those situations.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">⚠️ 2. AI Sometimes Makes Stuff Up (This Is Called a "Hallucination")</h4>
                    <p className="mb-2">
                      AI tools sometimes give you answers that sound real but are totally made up. This can include:
                    </p>
                    <ul className="list-disc pl-6 mb-2 space-y-1">
                      <li>Fake facts or statistics</li>
                      <li>Incorrect names, dates, or places</li>
                      <li>Invented sources or quotes</li>
                    </ul>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800 font-medium">
                        👉 Always double-check anything important, especially if you're using it in a project. You can search online, ask an adult, or compare with a trusted website.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">💡 3. It Often Tells You What You Want to Hear</h4>
                    <p className="mb-2">
                      AI is designed to be helpful. That means if you ask it a leading question, it might go along with you—even when the answer isn't true or helpful.
                    </p>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800 font-medium">
                        👉 Don't just look for agreement. Be curious. Ask, "Is this really true?"
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">⚖️ 4. AI Can Be Biased</h4>
                    <p className="mb-2">
                      AI learns from things people have written—and people don't always treat everyone fairly. That means AI can:
                    </p>
                    <ul className="list-disc pl-6 mb-2 space-y-1">
                      <li>Repeat stereotypes</li>
                      <li>Leave out certain groups</li>
                      <li>Sound more confident about one point of view than another</li>
                    </ul>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800 font-medium">
                        👉 Be thoughtful about what you see. Ask yourself: "Is this fair?" "Who might be missing?"
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">🛠️ 5. Use AI as a Tool, Not a Shortcut</h4>
                    <p className="mb-2">
                      Tomorrow you'll be using AI to help with your project—but the ideas still need to come from you! AI can:
                    </p>
                    <ul className="list-disc pl-6 mb-2 space-y-1">
                      <li>Help brainstorm</li>
                      <li>Give you different ways to say something</li>
                      <li>Show you examples</li>
                    </ul>
                    <p className="mb-2">But it's your job to:</p>
                    <ul className="list-disc pl-6 mb-2 space-y-1">
                      <li>Decide what's helpful</li>
                      <li>Change what doesn't fit</li>
                      <li>Be the human behind the work</li>
                    </ul>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800 font-medium">
                        👉 Remember: AI is your creative partner, not your replacement. The best projects happen when humans and AI work together thoughtfully.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-purple-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4 text-purple-800">🏡 Family Reflection</h4>
                  <p className="mb-4">Talk about these questions together:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>How do you think AI can help you learn or create?</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>When should you ask a real person for help instead of an AI?</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Why is it important to check facts, even if something sounds smart?</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 bg-purple-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4 text-purple-800">✅ Final Thought</h4>
                  <p>
                    AI is amazing—but it doesn't replace your brain, your creativity, or your relationships. You're in charge, and tomorrow, we'll build something great.
                  </p>
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
      </div>
    </div>
  );
};

export default AIEthicsPage; 