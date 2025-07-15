import React from 'react';

const AboutAIGoodPage: React.FC = () => (
  <div className="h-full bg-gray-50">
    <div className="flex flex-col h-full">
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-bold text-gray-800">Course Overview: AI for Good — Empowering Future Changemakers</h3>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <p className="text-gray-700 mb-4">
              Welcome to AI for Good—an entrepreneurial course designed to empower you as a creator, innovator, and changemaker! In this hands-on journey, you'll work in teams to imagine, design, and pitch a brand-new product that makes the world a better place, using the power of AI to help bring your ideas to life.
            </p>
            <h4 className="text-lg font-semibold mb-2 text-purple-700">Here's what you'll experience in each module:</h4>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>
                <strong>Module 1: Getting Started with AI & Design Thinking</strong><br />
                You'll be introduced to the world of AI and explore how it can help solve real-world problems. You'll learn how to "talk" to AI tools, complete a prompt engineering project, form your team, and use design thinking to choose a project that aims for positive impact.
              </li>
              <li>
                <strong>Module 2: Bring Your Ideas to Life</strong><br />
                You'll bring your vision to reality by building a user persona, creating images and stories with AI, and making your first elevator pitch. This is your time to experiment, create, and shape your project to help others.
              </li>
              <li>
                <strong>Module 3: Research & Real-World Listening</strong><br />
                You'll learn how to figure out who might benefit from your product, explore similar solutions, and use AI to research while thinking critically about bias and accuracy. You'll use feedback from real people to improve your idea and make sure it serves the greater good.
              </li>
              <li>
                <strong>Module 4: Turning Feedback Into a Winning Pitch</strong><br />
                You'll use feedback and research to make your project stronger, learn how to measure success, and ensure your idea is fair and inclusive. You'll build a pitch deck, practice presenting your product, and get ready to share your changemaker vision with the world!
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              By the end of AI for Good, you'll know how to harness AI for positive impact, work as a team, design solutions for real needs, and confidently pitch your changemaker ideas—just like real-world entrepreneurs who make a difference.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AboutAIGoodPage; 