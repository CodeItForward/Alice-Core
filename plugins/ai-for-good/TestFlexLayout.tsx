import React from 'react';

const TestFlexLayout: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="bg-blue-200 md:w-56 p-4">Sidebar</div>
      <div className="flex-1 bg-green-200 p-4">Main Content</div>
      <div className="bg-red-200 md:w-96 p-4">AI Co-pilot</div>
    </div>
  );
};

export default TestFlexLayout; 