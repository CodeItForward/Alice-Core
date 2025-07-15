import React from 'react';

const WelcomePage: React.FC = () => {
  return (
    <div className="h-full bg-gray-50">
      {/* Main Content Area */}
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800">Welcome to AI for Good</h3>
            <p className="text-gray-500">Start your AI for Good journey</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Welcome to Your AI for Good Journey</h2>
              <p className="text-gray-700 mb-4">
                This platform is designed to help you and your team collaborate on projects that leverage AI for positive impact. 
                Use the navigation on the left to access different learning activities and track your progress.
              </p>
              <div className="mt-4">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src="https://www.youtube.com/embed/reLFHLlNBbk"
                    title="Introduction to AI for Good"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">What You'll Learn</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">AI Fundamentals</h4>
                  <p className="text-blue-700 text-sm">Learn the basics of artificial intelligence and how it can be used for social good.</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">Prompt Engineering</h4>
                  <p className="text-purple-700 text-sm">Master the art of crafting effective prompts to get the best results from AI systems.</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-2">Team Collaboration</h4>
                  <p className="text-orange-700 text-sm">Work together with your team to solve real-world problems using AI.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Design Thinking</h4>
                  <p className="text-green-700 text-sm">Apply design thinking principles to create impactful AI solutions.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage; 