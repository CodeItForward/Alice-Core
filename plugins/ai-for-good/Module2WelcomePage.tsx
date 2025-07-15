import React from 'react';

const Module2WelcomePage: React.FC = () => {
  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-bold text-gray-800">Welcome to Module 2: Bring Your Ideas to Life!</h3>
          <p className="text-gray-500">Turn your big ideas into something real with AI tools!</p>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <p className="text-gray-700 mb-6">
              In this module, you and your team will turn your big ideas into something real. Get ready to dive in, create, and show off your creativity using the latest AI tools!
            </p>
            <h2 className="text-xl font-semibold mb-2">Here's what you'll be doing in Module 2:</h2>
            <ul className="list-disc pl-6 space-y-4 text-gray-800 mb-6">
              <li>
                <span className="font-semibold">Kickoff &amp; Quick Review</span><br />
                We'll start by recapping where we left off in Module 1. Each team will share their main idea in a quick, one-sentence intro.
              </li>
              <li>
                <span className="font-semibold">Persona Creation Jam</span><br />
                Every great product starts with real people in mind. You'll create a "persona"—a character that represents your main user. You'll use AI tools like Bolt to design an image and come up with a fun backstory. Share your persona in our group gallery!
              </li>
              <li>
                <span className="font-semibold">Visual Elevator Pitch</span><br />
                It's time to pitch your idea in a creative way! Each team will create a short elevator pitch and pair it with a supporting AI-generated image, meme, or comic panel. Present your pitch and visual to the class and see how your idea comes to life.
              </li>
              <li>
                <span className="font-semibold">Creative Studio Block (Bolt Playground)</span><br />
                This is your chance to let your imagination run wild. Use AI tools to design anything your product needs—images, website mockups, comics, and more. Try out suggested prompts or come up with your own. Share your favorite creations with the group!
              </li>
              <li>
                <span className="font-semibold">Wrap-Up &amp; Workspace Update</span><br />
                At the end, you'll post your persona, pitch, and favorite creations to your product workspace. We'll finish with a quick group reflection and get excited for what's coming next in Module 3.
              </li>
            </ul>
            {/* Embedded YouTube video at the end of the page */}
            <div className="mt-8 w-full">
              <p className="mb-2 text-gray-600 font-medium">Below is an example of my son using Bolt.</p>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src="https://www.youtube.com/embed/LtYthS3FhiE"
                  title="Module 2 Welcome Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module2WelcomePage; 