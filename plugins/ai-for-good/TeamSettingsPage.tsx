import React, { useState } from 'react';

const TeamSettingsPage: React.FC = () => {
  const [teamName, setTeamName] = useState('');
  const [teamInfo, setTeamInfo] = useState('');
  const [teamMembers, setTeamMembers] = useState<string[]>(['']);
  const [projectFiles, setProjectFiles] = useState<string[]>([]);

  const handleMemberChange = (idx: number, value: string) => {
    setTeamMembers(members => {
      const copy = [...members];
      copy[idx] = value;
      return copy;
    });
  };
  const addMember = () => setTeamMembers(members => [...members, '']);
  const removeMember = (idx: number) => setTeamMembers(members => members.filter((_, i) => i !== idx));

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Team Settings</h1>
      <div className="mb-8">
        <label className="block font-semibold mb-1">Team Name</label>
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          type="text"
          placeholder="Enter team name"
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
        />
      </div>
      <div className="mb-8">
        <label className="block font-semibold mb-1">Team Members</label>
        <div className="space-y-2">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                type="text"
                placeholder={`Member ${idx + 1}`}
                value={member}
                onChange={e => handleMemberChange(idx, e.target.value)}
              />
              {teamMembers.length > 1 && (
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 text-lg"
                  onClick={() => removeMember(idx)}
                  title="Remove member"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="mt-2 px-3 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 font-semibold"
            onClick={addMember}
          >
            + Add Member
          </button>
        </div>
      </div>
      <div className="mb-8">
        <label className="block font-semibold mb-1">Team Info</label>
        <textarea
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Describe your team, goals, or anything else..."
          value={teamInfo}
          onChange={e => setTeamInfo(e.target.value)}
          rows={4}
        />
      </div>
      <div className="mb-8">
        <label className="block font-semibold mb-1">Project Files</label>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-gray-500 italic">
          (Project file upload/listing UI coming soon)
        </div>
      </div>
    </div>
  );
};

export default TeamSettingsPage; 