import React from 'react';

const Module3WelcomePage: React.FC = () => {
  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-bold text-gray-800">Welcome to Module 3: Research & Real-World Listening!</h3>
          <p className="text-gray-500">Become a product detective and learn to use AI and real-world feedback!</p>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <p className="text-gray-700 mb-6">
              In this module, you'll become a real product detective—learning how to find out who might want your product, what's already out there, and how to use AI tools in a smart way. You'll also discover how to spot when AI gets things wrong, and learn the best ways to ask people for honest feedback about your ideas.
            </p>
            <h2 className="text-xl font-semibold mb-2">Here's what you'll be doing in Module 3:</h2>
            <ul className="list-disc pl-6 space-y-4 text-gray-800 mb-6">
              <li>
                <span className="font-semibold">Market Sizing</span><br />
                You'll explore what it means to "size a market"—figuring out how many people might be interested in your product or idea. With the help of AI, you'll estimate your market and discuss how to tell if those numbers seem realistic.
              </li>
              <li>
                <span className="font-semibold">Finding Similar Products</span><br />
                You'll use AI to help you search for products or apps that are similar to yours. You'll compare your ideas to real-world products and start thinking about what makes your idea unique or better.
              </li>
              <li>
                <span className="font-semibold">Spotting AI Mistakes and Bias</span><br />
                You'll learn that AI tools aren't perfect—they can make mistakes or have "bias." You'll practice checking AI answers, spotting when something doesn't make sense, and thinking critically about information.
              </li>
              <li>
                <span className="font-semibold">Maker Time: Build & Improve</span><br />
                With your new research in mind, you'll jump back into creating! You'll improve your product, update your features or designs, and use AI tools to make new images or mockups.
              </li>
              <li>
                <span className="font-semibold">Customer Listening Sessions</span><br />
                You'll learn how to get helpful feedback by showing your product idea to real people and asking good questions. This will help you make your product even better.
              </li>
              <li>
                <span className="font-semibold">Homework: Get Real Feedback</span><br />
                For homework, you'll show your product idea to a family member or friend and write down what they think. Bring their feedback back to share with your team!
              </li>
            </ul>
            <p className="text-purple-700 font-semibold mt-6">Get ready to investigate, create, and learn how to use both AI and real-world feedback to make your ideas even stronger!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module3WelcomePage; 