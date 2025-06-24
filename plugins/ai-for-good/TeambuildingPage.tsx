import React, { useState, useEffect } from 'react';
import { Video, BookOpen, Activity, CheckCircle, Clock, ArrowRight, ChevronDown, ChevronRight, Save, Users } from 'lucide-react';
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

interface TeambuildingForm {
  firstName: string;
  animal: string;
  iceCream: string;
  funFact: string;
  travelDestination: string;
  proudAchievement: string;
  millionDollarProject: string;
  helpGroup: string;
  worldChange: string;
  mayorForDay: string;
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
    status: 'in-progress',
    duration: '30 min',
    link: '/ai-for-good/teambuilding'
  },
  {
    id: '7',
    title: 'Mind Map Jam',
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

const TeambuildingPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ProgressItem | null>(null);
  const [isDay1Expanded, setIsDay1Expanded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<TeambuildingForm>({
    firstName: '',
    animal: '',
    iceCream: '',
    funFact: '',
    travelDestination: '',
    proudAchievement: '',
    millionDollarProject: '',
    helpGroup: '',
    worldChange: '',
    mayorForDay: ''
  });

  // Automatically select the Teambuilding activity when the page loads
  useEffect(() => {
    const teambuilding = progressItems.find(item => item.id === '6');
    if (teambuilding) {
      setSelectedItem(teambuilding);
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

  const handleInputChange = (field: keyof TeambuildingForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API call
      console.log('Submitting form data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving form:', error);
    } finally {
      setIsSubmitting(false);
    }
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
              <div className="flex items-center mb-6">
                <Users className="text-purple-600 mr-3" size={24} />
                <h2 className="text-2xl font-bold text-gray-800">Teambuilding</h2>
              </div>
              
              <div className="prose prose-lg max-w-none mb-6">
                <p className="text-gray-600">
                  Let's get to know each other better! Fill out this form to share some fun facts about yourself. 
                  Your responses will help us build a stronger, more connected team.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    What's your first name or nickname?
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    maxLength={100}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your first name or nickname"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.firstName.length}/100 characters
                  </div>
                </div>

                {/* Animal */}
                <div>
                  <label htmlFor="animal" className="block text-sm font-medium text-gray-700 mb-2">
                    If you were an animal, what would you be and why?
                  </label>
                  <textarea
                    id="animal"
                    value={formData.animal}
                    onChange={(e) => handleInputChange('animal', e.target.value)}
                    maxLength={100}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., A dolphin because I love swimming and being social"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.animal.length}/100 characters
                  </div>
                </div>

                {/* Ice Cream */}
                <div>
                  <label htmlFor="iceCream" className="block text-sm font-medium text-gray-700 mb-2">
                    What's your favorite ice cream flavor?
                  </label>
                  <input
                    type="text"
                    id="iceCream"
                    value={formData.iceCream}
                    onChange={(e) => handleInputChange('iceCream', e.target.value)}
                    maxLength={100}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Mint chocolate chip"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.iceCream.length}/100 characters
                  </div>
                </div>

                {/* Fun Fact */}
                <div>
                  <label htmlFor="funFact" className="block text-sm font-medium text-gray-700 mb-2">
                    What's one fun fact about you?
                  </label>
                  <textarea
                    id="funFact"
                    value={formData.funFact}
                    onChange={(e) => handleInputChange('funFact', e.target.value)}
                    maxLength={500}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Share something interesting about yourself!"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.funFact.length}/500 characters
                  </div>
                </div>

                {/* Travel Destination */}
                <div>
                  <label htmlFor="travelDestination" className="block text-sm font-medium text-gray-700 mb-2">
                    If you could travel anywhere in the world for two weeks, where would you go?
                  </label>
                  <textarea
                    id="travelDestination"
                    value={formData.travelDestination}
                    onChange={(e) => handleInputChange('travelDestination', e.target.value)}
                    maxLength={500}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe your dream destination and why you'd go there"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.travelDestination.length}/500 characters
                  </div>
                </div>

                {/* Proud Achievement */}
                <div>
                  <label htmlFor="proudAchievement" className="block text-sm font-medium text-gray-700 mb-2">
                    What's something you've made or helped with that you're proud of?
                  </label>
                  <textarea
                    id="proudAchievement"
                    value={formData.proudAchievement}
                    onChange={(e) => handleInputChange('proudAchievement', e.target.value)}
                    maxLength={500}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Share a project, achievement, or contribution you're proud of"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.proudAchievement.length}/500 characters
                  </div>
                </div>

                {/* Million Dollar Project */}
                <div>
                  <label htmlFor="millionDollarProject" className="block text-sm font-medium text-gray-700 mb-2">
                    If your team had a million dollars to make something awesome, what would it be?
                  </label>
                  <textarea
                    id="millionDollarProject"
                    value={formData.millionDollarProject}
                    onChange={(e) => handleInputChange('millionDollarProject', e.target.value)}
                    maxLength={500}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe an amazing project you'd create with a million dollars"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.millionDollarProject.length}/500 characters
                  </div>
                </div>

                {/* Help Group */}
                <div>
                  <label htmlFor="helpGroup" className="block text-sm font-medium text-gray-700 mb-2">
                    If you could help one group of people, animals, or the planet, who would you help and how?
                  </label>
                  <textarea
                    id="helpGroup"
                    value={formData.helpGroup}
                    onChange={(e) => handleInputChange('helpGroup', e.target.value)}
                    maxLength={500}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe who you'd help and your approach to making a difference"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.helpGroup.length}/500 characters
                  </div>
                </div>

                {/* World Change */}
                <div>
                  <label htmlFor="worldChange" className="block text-sm font-medium text-gray-700 mb-2">
                    What's one thing you'd change to make your school, town, or the world better?
                  </label>
                  <textarea
                    id="worldChange"
                    value={formData.worldChange}
                    onChange={(e) => handleInputChange('worldChange', e.target.value)}
                    maxLength={500}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Share an idea for positive change in your community or the world"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.worldChange.length}/500 characters
                  </div>
                </div>

                {/* Mayor for Day */}
                <div>
                  <label htmlFor="mayorForDay" className="block text-sm font-medium text-gray-700 mb-2">
                    If you could be mayor for the day, what would you do?
                  </label>
                  <textarea
                    id="mayorForDay"
                    value={formData.mayorForDay}
                    onChange={(e) => handleInputChange('mayorForDay', e.target.value)}
                    maxLength={500}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Describe what you'd accomplish as mayor for a day"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.mayorForDay.length}/500 characters
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center px-6 py-2 rounded-lg ${
                      isSubmitting
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Save Responses
                      </>
                    )}
                  </button>
                </div>

                {/* Success Message */}
                {isSaved && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex items-center">
                      <CheckCircle className="text-green-600 mr-2" size={20} />
                      <span className="text-green-800 font-medium">Your responses have been saved successfully!</span>
                    </div>
                  </div>
                )}
              </form>
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

export default TeambuildingPage; 