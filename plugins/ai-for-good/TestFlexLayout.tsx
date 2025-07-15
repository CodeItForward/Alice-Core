import React from 'react';

const TestFlexLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Row 1: Sidebar + Main */}
      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        <div className="bg-blue-200 md:w-56 p-4 flex flex-col">Sidebar</div>
        <div className="flex-1 bg-green-200 p-4 flex flex-col min-h-0">Main Content</div>
      </div>
      {/* Row 2: AI Co-pilot */}
      <div className="bg-red-200 w-full p-4 shrink-0 h-64">AI Co-pilot</div>
    </div>
  );
};

export default TestFlexLayout; 