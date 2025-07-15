import React from 'react';
import { Video, BookOpen, Activity, CheckCircle, Clock, ChevronDown, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ProgressItem {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'activity';
  status: 'completed' | 'in-progress' | 'not-started';
  duration?: string;
  link: string;
  videoUrl?: string;
}

export const getTypeIcon = (type: ProgressItem['type']) => {
  switch (type) {
    case 'video':
      return <Video size={16} className="text-blue-500" />;
    case 'reading':
      return <BookOpen size={16} className="text-purple-500" />;
    case 'activity':
      return <Activity size={16} className="text-orange-500" />;
  }
};

export const getStatusIcon = (status: ProgressItem['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle size={16} className="text-green-500" />;
    case 'in-progress':
      return <Clock size={16} className="text-yellow-500" />;
    default:
      return null;
  }
};

export const getStatusIconComponent = (status: ProgressItem['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle size={16} className="text-green-500" />;
    case 'in-progress':
      return <Clock size={16} className="text-yellow-500" />;
    default:
      return null;
  }
};

export interface ProgressSidebarProps {
  progressItems: ProgressItem[];
  selectedItem: ProgressItem | null;
  onItemClick: (item: ProgressItem) => void;
  isDay1Expanded: boolean;
  onToggleDay1: () => void;
}

export const ProgressSidebar: React.FC<ProgressSidebarProps> = ({
  progressItems,
  selectedItem,
  onItemClick,
  isDay1Expanded,
  onToggleDay1
}) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Your Progress</h2>
      
      {/* Day 1 Section */}
      <div className="mb-4">
        <button
          onClick={onToggleDay1}
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
                onClick={() => onItemClick(item)}
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
                  {getStatusIconComponent(item.status)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export interface NextButtonProps {
  progressItems: ProgressItem[];
  selectedItem: ProgressItem | null;
  onNextClick: () => void;
}

export const NextButton: React.FC<NextButtonProps> = ({
  progressItems,
  selectedItem,
  onNextClick
}) => {
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
    <div className="flex justify-end">
      <button
        onClick={onNextClick}
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
  );
};

export interface ProgressStatsProps {
  progressItems: ProgressItem[];
}

export const ProgressStats: React.FC<ProgressStatsProps> = ({ progressItems }) => {
  return (
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
  );
};

export interface UpNextProps {
  progressItems: ProgressItem[];
}

export const UpNext: React.FC<UpNextProps> = ({ progressItems }) => {
  return (
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
              <span className="ml-2">{getStatusIconComponent(item.status)}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}; 