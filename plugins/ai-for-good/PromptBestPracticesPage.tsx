import React from 'react';

const PromptBestPracticesPage: React.FC = () => {
  return (
    <div className="h-full bg-gray-50">
      {/* Main Content Area */}
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800">Prompt Engineering Best Practices</h3>
            <p className="text-gray-500">Learn how to craft effective AI prompts</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Prompt Engineering Best Practices</h2>
              
              <div className="prose prose-lg max-w-none">
                <h3 className="text-xl font-semibold mb-4 text-purple-700">What is "Prompt Engineering"?</h3>
                <p className="mb-4">
                  Prompt engineering is the skill of asking the right questions and giving clear instructions to get the best results from an AI assistant, like ChatGPT. Whether you're making a comic strip, building a web app, or creating anything else with AI, how you ask matters!
                </p>
                <p className="mb-6">
                  Think of it like giving directions to a super-smart robot: the clearer and more detailed your directions, the better the robot can help.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-purple-700">Why Does It Matter?</h3>
                <p className="mb-4">AI can do a lot—but only if you tell it exactly what you need. Clear prompts help you:</p>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li>Get better, more creative ideas</li>
                  <li>Avoid confusion and mistakes</li>
                  <li>Save time and frustration</li>
                  <li>Work smarter in any AI project</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4 text-purple-700">The Golden Rules</h3>
                
                <div className="space-y-6">
                  <div className="p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">1. Be Specific</h4>
                    <p className="text-blue-700 text-sm mb-2">Instead of "Make me a story," try "Write a 200-word story about a robot who learns to paint."</p>
                    <div className="bg-blue-100 p-3 rounded">
                      <p className="text-blue-800 text-sm"><strong>Good:</strong> "Create a comic strip about friendship with 4 panels, simple dialogue, and a happy ending."</p>
                      <p className="text-blue-800 text-sm"><strong>Not so good:</strong> "Make a comic."</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">2. Give Context</h4>
                    <p className="text-green-700 text-sm mb-2">Help the AI understand the situation and your goals.</p>
                    <div className="bg-green-100 p-3 rounded">
                      <p className="text-green-800 text-sm"><strong>Good:</strong> "I'm a high school student creating a presentation about climate change for my science class. Help me explain renewable energy in simple terms."</p>
                      <p className="text-green-800 text-sm"><strong>Not so good:</strong> "Explain renewable energy."</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">3. Set the Format</h4>
                    <p className="text-purple-700 text-sm mb-2">Tell the AI exactly how you want the response formatted.</p>
                    <div className="bg-purple-100 p-3 rounded">
                      <p className="text-purple-800 text-sm"><strong>Good:</strong> "List 5 ways to reduce plastic waste. Format as numbered list with one sentence explanation for each."</p>
                      <p className="text-purple-800 text-sm"><strong>Not so good:</strong> "Tell me about reducing plastic waste."</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">4. Use Examples</h4>
                    <p className="text-orange-700 text-sm mb-2">Show the AI what you want with concrete examples.</p>
                    <div className="bg-orange-100 p-3 rounded">
                      <p className="text-orange-800 text-sm"><strong>Good:</strong> "Write social media captions like these examples: 'Just discovered this amazing coffee shop! ☕ #LocalGems' - keep them under 20 words, friendly tone, include relevant hashtags."</p>
                      <p className="text-orange-800 text-sm"><strong>Not so good:</strong> "Write social media captions."</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-4 text-purple-700 mt-8">Quick Tips for Success</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2">
                  <li><strong>Start simple, then add details:</strong> Begin with a basic request, then refine it.</li>
                  <li><strong>Ask for alternatives:</strong> "Give me 3 different approaches to..."</li>
                  <li><strong>Set constraints:</strong> "In 100 words or less..." or "Using only materials from a classroom..."</li>
                  <li><strong>Request explanations:</strong> "Explain your reasoning" or "Walk me through your process"</li>
                  <li><strong>Iterate and improve:</strong> If the first response isn't perfect, ask for adjustments!</li>
                </ul>

                <div className="p-4 bg-gray-50 rounded-lg mt-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Remember:</h4>
                  <p className="text-gray-700 text-sm">
                    Great prompts are like great questions—they're clear, specific, and help the AI understand exactly what you need. 
                    The more you practice, the better you'll get at working with AI as a creative partner!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptBestPracticesPage; 