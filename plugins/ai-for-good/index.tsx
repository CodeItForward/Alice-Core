import React from 'react';
import AiForGoodPage from './AiForGoodPage';
import { useUser } from '@clerk/clerk-react';
import AchievementsPage from './AchievementsPage';
import ProjectFilesPage from './ProjectFilesPage';
import KnowledgebasePage from './KnowledgebasePage';

const AiForGoodPlugin = () => {
  const { user } = useUser();
  const rolesRaw = user?.publicMetadata?.role ?? [];
  let roles: string[] = [];
  if (Array.isArray(rolesRaw)) {
    roles = rolesRaw;
  } else if (typeof rolesRaw === 'string') {
    try {
      const parsed = JSON.parse(rolesRaw);
      if (Array.isArray(parsed)) {
        roles = parsed;
      } else {
        roles = rolesRaw.replace(/[\[\]"]/g, '').split(',').map(r => r.trim());
      }
    } catch {
      roles = rolesRaw.replace(/[\[\]"]/g, '').split(',').map(r => r.trim());
    }
  }
  if (!roles.includes('ai-for-good')) {
    return (
      <div className="p-6 text-center text-red-600">
        You do not have permission to access the AI for Good plugin.
      </div>
    );
  }
  return <AiForGoodPage />;
};

export default {
  name: 'AI for Good',
  navLinks: [
    {
      label: 'AI for Good',
      path: '/ai-for-good',
      children: [
        { label: 'Team Chat', path: '/ai-for-good' },
        { label: 'Achievements', path: '/ai-for-good/achievements' },
        { label: 'Project Files', path: '/ai-for-good/project-files' },
        { label: 'Knowledgebase', path: '/ai-for-good/knowledgebase' },
      ]
    }
  ],
  routes: [
    { path: '/ai-for-good', component: AiForGoodPlugin },
    { path: '/ai-for-good/achievements', component: AchievementsPage },
    { path: '/ai-for-good/project-files', component: ProjectFilesPage },
    { path: '/ai-for-good/knowledgebase', component: KnowledgebasePage },
  ]
}; 