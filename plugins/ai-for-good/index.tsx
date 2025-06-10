import React from 'react';
import AiForGoodPage from './AiForGoodPage';
import { useUser } from '@clerk/clerk-react';
import AchievementsPage from './AchievementsPage';
import WorkspacePage from './WorkspacePage';
import KnowledgebasePage from './KnowledgebasePage';
import ProjectBoardPage from './ProjectBoardPage';
import TestFlexLayout from './TestFlexLayout';
import TeamSettingsPage from './TeamSettingsPage';
import WelcomePage from './WelcomePage';
import IntroToAIPage from './IntroToAIPage';
import PromptBestPracticesPage from './PromptBestPracticesPage';
import GameTimePage from './GameTimePage';
import PromptEngineeringPage from './PromptEngineeringPage';
import TeambuildingPage from './TeambuildingPage';
import MindMapPage from './MindMapPage';
import AIEthicsPage from './AIEthicsPage';
import { Navigate } from 'react-router-dom';

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
        You do not have access to this feature. Please contact your administrator.
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
        { label: 'Journey Hub', path: '/ai-for-good/welcome' },
        { label: 'Team Settings', path: '/ai-for-good/team-settings' },
        { label: 'Team Chat', path: '/ai-for-good/chat' },
        { label: 'Achievements', path: '/ai-for-good/achievements' },
        { label: 'Workspace', path: '/ai-for-good/workspace' },
        { label: 'Knowledgebase', path: '/ai-for-good/knowledgebase' },
        { label: 'Project Board', path: '/ai-for-good/project-board' },
      ]
    }
  ],
  routes: [
    { path: '/ai-for-good/chat', component: AiForGoodPlugin },
    { path: '/ai-for-good/welcome', component: WelcomePage },
    { path: '/ai-for-good/team-settings', component: TeamSettingsPage },
    { path: '/ai-for-good/achievements', component: AchievementsPage },
    { path: '/ai-for-good/workspace', component: WorkspacePage },
    { path: '/ai-for-good/knowledgebase', component: KnowledgebasePage },
    { path: '/ai-for-good/project-board', component: ProjectBoardPage },
    { path: '/ai-for-good/test-flex', component: TestFlexLayout },
    { path: '/ai-for-good/intro-to-ai', component: IntroToAIPage },
    { path: '/ai-for-good/prompt-best-practices', component: PromptBestPracticesPage },
    { path: '/ai-for-good/game-time', component: GameTimePage },
    { path: '/ai-for-good/prompt-engineering', component: PromptEngineeringPage },
    { path: '/ai-for-good/teambuilding', component: TeambuildingPage },
    { path: '/ai-for-good/mind-map', component: MindMapPage },
    { path: '/ai-for-good/ai-ethics', component: AIEthicsPage },
    { path: '/ai-for-good', element: <Navigate to="/ai-for-good/welcome" replace /> }
  ]
}; 