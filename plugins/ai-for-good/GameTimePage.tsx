import React, { useState } from 'react';
import { X } from 'lucide-react';
import blindDrawImages from './blind_draw_images.json';

const GameTimePage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  return (
    <div className="h-full bg-gray-50">
      {/* Main Content Area */}
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800">Game Time! Group Activity</h3>
            <p className="text-gray-500">Collaborative drawing and communication exercise</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Blind Draw: Collaborative Group Activity</h2>
              <div className="prose prose-lg max-w-none">
                <h3 className="text-xl font-semibold text-purple-800 mb-4">Overview</h3>
                <p className="text-gray-700 mb-6">
                  In this activity, you'll experience firsthand how communication, interpretation, and perspective impact problem-solving and teamwork. 
                  One student receives a hidden image, describes it out loud, and others try to draw it based only on those instructions. 
                  Then everyone reveals their drawings and compares results.
                </p>

                <h3 className="text-xl font-semibold text-purple-800 mb-4">Learning Objectives</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                  <li>Practice giving and following clear, step-by-step instructions.</li>
                  <li>Observe how language can lead to multiple interpretations.</li>
                  <li>Reflect on the challenges and opportunities in human-AI and human-human communication.</li>
                </ul>

                <h3 className="text-xl font-semibold text-purple-800 mb-4">How It Works</h3>
                <ol className="list-decimal pl-6 mb-6 space-y-3 text-gray-700">
                  <li><strong>Choose a Describer:</strong> One person from your group gets access to a hidden image below.</li>
                  <li><strong>Describe the Image:</strong> The describer explains what they see without saying what the object actually is.</li>
                  <li><strong>Draw Based on Instructions:</strong> Everyone else draws what they think the image looks like based only on the verbal description.</li>
                  <li><strong>Reveal and Compare:</strong> Show your drawings and compare them to the original image.</li>
                  <li><strong>Discuss:</strong> Talk about what worked well and what was challenging about the communication process.</li>
                </ol>

                <h3 className="text-xl font-semibold text-purple-800 mb-4">Connection to AI</h3>
                <p className="text-gray-700 mb-6">
                  This activity mirrors how we communicate with AI systems. Just like in this exercise, the clarity and precision of our instructions 
                  (prompts) directly impact the quality of AI responses. The better we get at giving clear, specific instructions, the better results we'll get from AI tools.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-purple-800 mb-4">Click an Image to Begin</h3>
              <p className="text-gray-600 mb-4">
                The describer should click on one of the images below. Only the describer should look at the image!
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {blindDrawImages.map((imageUrl, index) => (
                  <div key={index} className="relative">
                    <button
                      onClick={() => handleImageClick(imageUrl)}
                      className="w-full aspect-square bg-purple-100 rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-colors duration-200 flex items-center justify-center"
                    >
                      <span className="text-purple-600 font-medium">Image {index + 1}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="bg-black bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Your Secret Image</h3>
              <button 
                onClick={() => setSelectedImage(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </div>
            <div className="rounded-lg overflow-hidden max-h-[calc(100vh-12rem)]">
              <img
                src={selectedImage}
                alt="Secret image for blind draw activity"
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Remember:</strong> Describe what you see without saying what the object actually is. 
                Focus on shapes, positions, and details that will help others draw it accurately.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameTimePage; 