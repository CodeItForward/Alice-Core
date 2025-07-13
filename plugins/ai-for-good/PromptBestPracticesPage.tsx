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
    status: 'not-started',
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

const PromptBestPracticesPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ProgressItem | null>(null);
  const [isDay1Expanded, setIsDay1Expanded] = useState(true);
  const navigate = useNavigate();

  // Automatically select the Prompt Engineering Best Practices when the page loads
  useEffect(() => {
    const bestPractices = progressItems.find(item => item.id === '4');
    if (bestPractices) {
      setSelectedItem(bestPractices);
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
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Prompt Engineering Best Practices</h2>
              
              <div className="prose prose-lg max-w-none">
                <h3 className="text-xl font-semibold mb-4 text-purple-700">What is "Prompt Engineering"?</h3>
                <p className="mb-4">
                  Prompt engineering is the skill of asking the right questions and giving clear instructions to get the best results from an AI assistant, like ChatGPT. Whether you're making a comic strip, building a web app, or creating anything else with AI, how you ask matters!
                </p>
                <p className="mb-6">
                  Think of it like giving directions to a super-smart robot: the clearer and more detailed your directions, the better the robot can help.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-purple-700">Why Does It Matter?</h3>
                <p className="mb-4">AI can do a lot—but only if you tell it exactly what you need. Clear prompts help you:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Get better, more creative ideas</li>
                  <li>Avoid confusion and mistakes</li>
                  <li>Save time and frustration</li>
                  <li>Work smarter in any AI project</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-purple-700">Prompt Engineering Best Practices</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">1. Be Specific</h4>
                    <p className="mb-2">Details matter! The more you include, the better the AI's response.</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-red-600 mb-2">Bad Prompt: Make a character.</p>
                      <p className="text-green-600">Better Prompt: Make a cheerful squirrel detective who loves solving mysteries and wears a green hat.</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">2. Give Context</h4>
                    <p className="mb-2">Tell the AI what you're working on, so it can give the most relevant answer.</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-purple-600">Example: "I'm designing a website for students. Can you suggest a fun welcome message?"</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">3. Break Things Down</h4>
                    <p className="mb-2">Big tasks are easier if you split them into smaller steps.</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-purple-600">Example:</p>
                      <ul className="list-decimal pl-6 mt-2 space-y-1">
                        <li>First: "Give me three ideas for a comic strip hero."</li>
                        <li>Next: "Describe what makes each hero unique."</li>
                        <li>Then: "Write a one-sentence catchphrase for each."</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">4. Set the Style or Mood</h4>
                    <p className="mb-2">If you want something to sound silly, serious, or futuristic—let the AI know!</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-purple-600">Example: "Write a dramatic introduction for a new superhero."</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">5. Experiment and Improve</h4>
                    <p className="mb-2">Your first try might not be perfect—and that's okay! Test your prompts, see what happens, and tweak them until you get what you want.</p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">6. Use Examples</h4>
                    <p className="mb-2">If you want your answer in a certain style or format, show the AI an example.</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-purple-600">Example: "I want a checklist like this:</p>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Buy supplies</li>
                        <li>Invite friends</li>
                      </ul>
                      <p className="text-purple-600 mt-2">Can you add two more steps for planning a school event?"</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">7. Be Clear About What You Want</h4>
                    <p className="mb-2">If you need a list, ask for a list. If you want a step-by-step guide, say so.</p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-purple-600">Example: "List four fun features to add to a homework app."</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-purple-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4 text-purple-800">Practice Checklist</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Did I give enough details?
                    </li>
                    <li className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Did I explain what I'm working on?
                    </li>
                    <li className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Did I say what kind of answer I want?
                    </li>
                    <li className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Did I check and improve my prompt if needed?
                    </li>
                  </ul>
                </div>

                <div className="mt-8 bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4 text-blue-800">Remember: These Skills Work Everywhere!</h4>
                  <p>
                    Prompt engineering is useful for any project you create with AI—comics, apps, homework help, game design, art, and way more. The better your prompts, the better your results. Get creative, experiment, and have fun!
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

export default PromptBestPracticesPage; 