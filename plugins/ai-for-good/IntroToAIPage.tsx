import React from 'react';

const IntroToAIPage: React.FC = () => {
  return (
    <div className="h-full bg-gray-50">
      {/* Main Content Area */}
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800">Introduction to AI</h3>
            <p className="text-gray-500">Learn the fundamentals of artificial intelligence</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Introduction to AI</h2>
              <p className="text-gray-700 mb-4">
                In this video, you'll learn about the fundamentals of Artificial Intelligence and how it's shaping our world.
              </p>
              
              <div className="mt-4">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src="https://www.youtube.com/embed/F26Ni2776hQ?rel=0"
                    title="Introduction to AI"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Key Concepts</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">What is AI?</h4>
                  <p className="text-blue-700 text-sm">Artificial Intelligence is the simulation of human intelligence in machines that are programmed to think and learn.</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">Machine Learning</h4>
                  <p className="text-purple-700 text-sm">A subset of AI that enables computers to learn and improve from experience without being explicitly programmed.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">AI for Good</h4>
                  <p className="text-green-700 text-sm">Using artificial intelligence to solve social problems and create positive impact in the world.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroToAIPage; 