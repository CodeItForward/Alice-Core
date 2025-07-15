import React from 'react';

const Module4WelcomePage: React.FC = () => (
  <div className="h-full bg-gray-50">
    <div className="flex flex-col h-full">
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-bold text-gray-800">Welcome to Module 4: Turning Feedback Into a Winning Pitch!</h3>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <p className="text-gray-700 mb-4">
              In this module, you'll learn how to use feedback to make your project even better, keep building and refining your product, explore new ways AI can help, and discover how to measure your success. You'll also practice sharing your idea in a way that inspires others!
            </p>
            <h4 className="text-lg font-semibold mb-2 text-purple-700">Here's what you'll be doing in Module 4:</h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>
                <strong>Reflect on Your Listening Sessions</strong><br />
                You'll share what you learned from showing your product to family or friends. Together, we'll discuss what feedback surprised you, what you might want to change, and how listening to real people can help make your project stronger.
              </li>
              <li>
                <strong>Build & Improve</strong><br />
                Armed with fresh feedback, you'll have more time to work on your project. You can update your product features, redesign images, or improve your prototype. Keep using AI tools and your own creativity to make your product stand out!
              </li>
              <li>
                <strong>AI Activity: Bias Detector</strong><br />
                In this activity, you'll work together to spot when an AI's answers might be missing important groups of people or making unfair assumptions. By becoming "Bias Detectors," you'll help make sure your ideas and products are fair and welcoming to everyone!
              </li>
              <li>
                <strong>Measuring Success: KPIs</strong><br />
                You'll learn about KPIs—Key Performance Indicators. These are simple ways to measure if your product is working and if people like it. You'll pick a few KPIs for your project and figure out how you'll track success.
              </li>
              <li>
                <strong>Pitch Deck Workshop</strong><br />
                You'll work together in Google Slides (or another tool) to build a pitch deck—a set of slides that tells your product's story, shows off your design, and explains why your idea matters. This is your chance to be creative and show off what makes your product awesome!
              </li>
              <li>
                <strong>Final Pitch Practice</strong><br />
                To finish Module 4, you'll practice giving your pitch! You'll present your idea and your slides to the group (and maybe a panel of special guests). This is your big moment to shine, get feedback, and celebrate everything you've accomplished.
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              Get ready to listen, build, measure, and present—Module 4 is all about turning your hard work into a pitch you're proud to share!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Module4WelcomePage; 