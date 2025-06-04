import React, { useState } from 'react';

const initialColumns = {
  'To-Do': [
    { id: 1, title: 'Set up project repo', description: 'Initialize the repository and set up the project structure.' },
    { id: 2, title: 'Define MVP', description: 'Write down the minimum features for launch.' },
  ],
  'In Progress': [
    { id: 3, title: 'Design UI mockups', description: 'Create wireframes and UI mockups for the main pages.' },
  ],
  'Done': [
    { id: 4, title: 'Team onboarding', description: 'Invite team members and assign roles.' },
  ],
};

const columnOrder = ['To-Do', 'In Progress', 'Done'];

const ProjectBoardPage: React.FC = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [draggedCard, setDraggedCard] = useState<{ card: any; from: string } | null>(null);

  const handleDragStart = (card: any, from: string) => {
    setDraggedCard({ card, from });
  };

  const handleDrop = (to: string) => {
    if (!draggedCard) return;
    const { card, from } = draggedCard;
    if (from === to) return setDraggedCard(null);
    setColumns(prev => {
      const fromCards = prev[from].filter((c: any) => c.id !== card.id);
      const toCards = [...prev[to], card];
      return { ...prev, [from]: fromCards, [to]: toCards };
    });
    setDraggedCard(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Project Board</h1>
      <div className="flex gap-6 overflow-x-auto">
        {columnOrder.map(col => (
          <div
            key={col}
            className="bg-gray-100 rounded-lg shadow-md flex-1 min-w-[300px] max-w-xs flex flex-col"
            onDragOver={e => e.preventDefault()}
            onDrop={() => handleDrop(col)}
          >
            <div className="p-4 font-semibold text-lg border-b border-gray-200 text-center bg-gray-200 rounded-t-lg">{col}</div>
            <div className="flex-1 p-4 space-y-4 min-h-[100px]">
              {columns[col].map(card => (
                <div
                  key={card.id}
                  className="bg-white rounded shadow p-4 cursor-move border border-gray-300"
                  draggable
                  onDragStart={() => handleDragStart(card, col)}
                >
                  <div className="font-bold text-purple-700 mb-1">{card.title}</div>
                  <div className="text-gray-700 text-sm">{card.description}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectBoardPage; 