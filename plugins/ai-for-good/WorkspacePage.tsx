import React, { useState } from 'react';

const workspaceSections = [
  {
    title: 'Product Overview',
    items: [
      { label: 'Elevator Pitch', placeholder: 'Short summary (1–2 sentences)' },
      { label: 'Problem Statement', placeholder: 'What are you solving? Who is it for?' },
      { label: 'Solution/Unique Value', placeholder: 'Why is it different or better?' },
      { label: 'Target User Persona(s)', placeholder: 'Quick profile(s) of who benefits' },
    ],
  },
  {
    title: 'Ideation & Research',
    items: [
      { label: 'Market/Stakeholder Research', placeholder: 'Key findings, user interviews, problem validation' },
      { label: 'Idea Board', placeholder: 'Early sketches, brainstorms, "How Might We" statements' },
    ],
  },
  {
    title: 'MVP Planning',
    items: [
      { label: 'Feature List', placeholder: 'Prioritized list (MVP vs. "future")' },
      { label: 'User Stories', placeholder: 'Short, plain-English descriptions of what users should be able to do' },
      { label: 'Wireframes/Mockups', placeholder: 'Links or uploads (Figma, whiteboard scans, Bolt, etc.)' },
      { label: 'Tech Stack/Platform Decisions', placeholder: 'Web app? Mobile? Something else?' },
    ],
  },
  {
    title: 'Prototyping & Development',
    items: [
      { label: 'Prototype Artifacts', placeholder: 'Screenshots, links, code snippets, AI-generated videos/images' },
      { label: 'Test Deployments', placeholder: 'Demo links (Vercel, Glitch, Sora, etc.)' },
      { label: 'Source Code', placeholder: 'Links to GitHub, Replit, or local files' },
    ],
  },
  {
    title: 'Testing & Feedback',
    items: [
      { label: 'User Test Results', placeholder: 'Summaries of feedback, what was changed' },
      { label: 'Iteration Notes', placeholder: 'What improved, what was dropped' },
    ],
  },
  {
    title: 'Final Deliverables',
    items: [
      { label: 'MVP Demo', placeholder: 'Video walkthrough, live demo link, screenshots' },
      { label: 'Pitch Deck', placeholder: 'PDF/Slides/Canva/Google Slides' },
      { label: 'Reflection', placeholder: '"What we learned," "What\'s next," impact statement' },
    ],
  },
  {
    title: 'Team & Roles',
    items: [
      { label: 'Contributors', placeholder: 'Who did what? (Helps with assessment and badge attribution)' },
    ],
  },
];

const WorkspacePage: React.FC = () => {
  const [fields, setFields] = useState<{ [key: string]: string }>({});
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    { sender: 'ai', text: 'Hi! I am your AI co-pilot. Ask me anything about product development.' },
  ]);

  const handleFieldChange = (key: string, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const handleAiSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    setAiMessages(prev => [
      ...prev,
      { sender: 'user', text: aiInput },
      { sender: 'ai', text: 'This is a placeholder AI co-pilot response. (Integrate with OpenAI or other LLM here.)' },
    ]);
    setAiInput('');
  };

  return (
    <div className="flex flex-col md:flex-row h-full bg-gray-50">
      {/* Workspace structure */}
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Workspace</h1>
        <div className="space-y-8">
          {workspaceSections.map(section => (
            <div key={section.title} className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="text-xl font-semibold mb-4 text-purple-700">{section.title}</div>
              <div className="space-y-4">
                {section.items.map(item => (
                  <div key={item.label}>
                    <label className="block font-medium mb-1">{item.label}</label>
                    <input
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      type="text"
                      placeholder={item.placeholder}
                      value={fields[item.label] || ''}
                      onChange={e => handleFieldChange(item.label, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* AI Co-pilot */}
      <div className="w-full md:w-96 border-t md:border-t-0 md:border-l border-gray-200 bg-white flex flex-col">
        <div className="p-4 font-bold text-lg border-b border-gray-100 text-purple-700">AI Co-pilot</div>
        <div className="flex-1 p-4 overflow-y-auto space-y-2 max-h-96">
          {aiMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}>{msg.text}</div>
            </div>
          ))}
        </div>
        <form onSubmit={handleAiSend} className="flex items-center gap-2 p-4 border-t border-gray-200">
          <input
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            type="text"
            placeholder="Ask the AI co-pilot..."
            value={aiInput}
            onChange={e => setAiInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-purple-700 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkspacePage; 