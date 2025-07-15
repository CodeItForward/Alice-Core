import React from 'react';

const AIEthicsPage: React.FC = () => {
  return (
    <div className="h-full bg-gray-50">
      {/* Main Content Area */}
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-white p-4 border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800">AI Safety</h3>
            <p className="text-gray-500">Learn about AI safety, ethics, and responsible AI development</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Take Home: AI Safety</h2>
              
              <div className="prose prose-lg max-w-none">
                <h3 className="text-xl font-semibold mb-4 text-purple-700">🤖 AI Safety: What Every Young Creator Should Know</h3>
                <p className="mb-4">
                  Please read this page at home with a parent or caregiver. You'll be using AI more independently tomorrow, so it's important to build good habits!
                </p>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h4 className="text-lg font-semibold mb-2 text-gray-800">Today, we worked on:</h4>
                  <ul className="space-y-1">
                    <li>💬 Prompt Engineering (learning how to ask great questions)</li>
                    <li>🤝 Teamwork</li>
                    <li>🧩 Defining the problem we want to solve</li>
                  </ul>
                </div>

                <p className="mb-6">
                  Tomorrow, you'll begin using AI tools more on your own to design solutions, create stories, and explore ideas. AI can be a fun and powerful partner—but only if we use it safely and wisely.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-purple-700">Key AI Safety Principles</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">🧠 1. AI Doesn't Think—It Predicts</h4>
                    <p className="mb-2">
                      AI tools like ChatGPT don't have thoughts, feelings, or opinions. They don't "know" facts the way people do—they just predict what words usually come next based on patterns from things people have written.
                    </p>
                    <p className="mb-2">Sometimes AI will sound very convincing, friendly, or even caring. But:</p>
                    <ul className="list-disc pl-6 mb-2 space-y-1">
                      <li>It is not your friend, even if it seems like it understands you.</li>
                      <li>It doesn't care about you, no matter what it says.</li>
                      <li>It can't replace a real person for serious topics like your health, your safety, or your emotions.</li>
                    </ul>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800 font-medium">
                        👉 Always talk to a trusted adult—like your parents, a teacher, or a doctor—if you have personal questions or need help. AI should never replace a real human in those situations.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">⚠️ 2. AI Sometimes Makes Stuff Up (This Is Called a "Hallucination")</h4>
                    <p className="mb-2">
                      AI tools sometimes give you answers that sound real but are totally made up. This can include:
                    </p>
                    <ul className="list-disc pl-6 mb-2 space-y-1">
                      <li>Fake facts or statistics</li>
                      <li>Incorrect names, dates, or places</li>
                      <li>Invented sources or quotes</li>
                    </ul>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800 font-medium">
                        👉 Always double-check anything important, especially if you're using it in a project. You can search online, ask an adult, or compare with a trusted website.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">💡 3. It Often Tells You What You Want to Hear</h4>
                    <p className="mb-2">
                      AI is designed to be helpful. That means if you ask it a leading question, it might go along with you—even when the answer isn't true or helpful.
                    </p>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800 font-medium">
                        👉 Don't just look for agreement. Be curious. Ask, "Is this really true?"
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">⚖️ 4. AI Can Be Biased</h4>
                    <p className="mb-2">
                      AI learns from things people have written—and people don't always treat everyone fairly. That means AI can:
                    </p>
                    <ul className="list-disc pl-6 mb-2 space-y-1">
                      <li>Repeat stereotypes</li>
                      <li>Leave out certain groups</li>
                      <li>Sound more confident about one point of view than another</li>
                    </ul>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800 font-medium">
                        👉 Be thoughtful about what you see. Ask yourself: "Is this fair?" "Who might be missing?"
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-gray-800">🛠️ 5. Use AI as a Tool, Not a Shortcut</h4>
                    <p className="mb-2">
                      Tomorrow you'll be using AI to help with your project—but the ideas still need to come from you! AI can:
                    </p>
                    <ul className="list-disc pl-6 mb-2 space-y-1">
                      <li>Help brainstorm</li>
                      <li>Give you different ways to say something</li>
                      <li>Show you examples</li>
                    </ul>
                    <p className="mb-2">But it's your job to:</p>
                    <ul className="list-disc pl-6 mb-2 space-y-1">
                      <li>Decide what's helpful</li>
                      <li>Change what doesn't fit</li>
                      <li>Be the human behind the work</li>
                    </ul>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800 font-medium">
                        👉 Remember: AI is your creative partner, not your replacement. The best projects happen when humans and AI work together thoughtfully.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-purple-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4 text-purple-800">🏡 Family Reflection</h4>
                  <p className="mb-4">Talk about these questions together:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>How do you think AI can help you learn or create?</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>When should you ask a real person for help instead of an AI?</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Why is it important to check facts, even if something sounds smart?</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-8 bg-purple-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold mb-4 text-purple-800">✅ Final Thought</h4>
                  <p>
                    AI is amazing—but it doesn't replace your brain, your creativity, or your relationships. You're in charge, and tomorrow, we'll build something great.
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

export default AIEthicsPage; 