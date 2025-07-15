import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Video, BookOpen, Activity } from 'lucide-react';
import WelcomePage from './WelcomePage';
import IntroToAIPage from './IntroToAIPage';
import PromptBestPracticesPage from './PromptBestPracticesPage';
import GameTimePage from './GameTimePage';
import PromptEngineeringPage from './PromptEngineeringPage';
import TeambuildingPage from './TeambuildingPage';
import MindMapPage from './MindMapPage';
import AIEthicsPage from './AIEthicsPage';
import { Navigate } from 'react-router-dom';

// Wrapper component to enforce role checks
const withRoleCheck = (Component: React.ComponentType) => {
  return () => {
    const { user } = useUser();
    console.log('=== Clerk User Debug ===');
    console.log('Full user object:', user);
    console.log('User ID:', user?.id);
    console.log('Raw public metadata:', user?.publicMetadata);
    console.log('Raw unsafe metadata:', user?.unsafeMetadata);
    console.log('Raw role metadata:', user?.publicMetadata?.role);
    
    const rolesRaw = user?.publicMetadata?.role ?? [];
    console.log('Roles raw value:', rolesRaw);
    console.log('Roles raw type:', typeof rolesRaw);
    
    let roles: string[] = [];
    if (Array.isArray(rolesRaw)) {
      roles = rolesRaw;
      console.log('Roles is array:', roles);
    } else if (typeof rolesRaw === 'string') {
      try {
        const parsed = JSON.parse(rolesRaw);
        console.log('Parsed JSON:', parsed);
        if (Array.isArray(parsed)) {
          roles = parsed;
        } else {
          roles = rolesRaw.replace(/[\[\]"]/g, '').split(',').map(r => r.trim());
        }
      } catch {
        console.log('Failed to parse JSON, using string split');
        roles = rolesRaw.replace(/[\[\]"]/g, '').split(',').map(r => r.trim());
      }
    }
    console.log('Final roles array:', roles);
    console.log('Has ai-for-good role:', roles.includes('ai-for-good'));
    console.log('=== End Clerk User Debug ===');

    if (!roles.includes('ai-for-good')) {
      return (
        <div className="p-6 text-center text-red-600">
          You do not have access to this feature. Please contact your administrator.
        </div>
      );
    }
    return <Component />;
  };
};

export default {
  name: 'AI for Good',
  navLinks: [
    {
      label: 'AI for Good',
      path: '/ai-for-good',
      icon: <Activity size={18} className="text-orange-500" />,
      children: [
        {
          label: 'Module 1',
          path: '/ai-for-good/module-1',
          icon: <BookOpen size={16} className="text-purple-500" />,
          children: [
            { 
              label: 'Welcome', 
              path: '/ai-for-good/welcome',
              icon: <Video size={16} className="text-blue-500" />,
              type: 'video',
              status: 'completed'
            },
            { 
              label: 'Intro to AI', 
              path: '/ai-for-good/intro-to-ai',
              icon: <Video size={16} className="text-blue-500" />,
              type: 'video',
              status: 'in-progress'
            },
            { 
              label: 'Game Time', 
              path: '/ai-for-good/game-time',
              icon: <Activity size={16} className="text-orange-500" />,
              type: 'activity',
              status: 'not-started'
            },
            { 
              label: 'Prompt Best Practices', 
              path: '/ai-for-good/prompt-best-practices',
              icon: <BookOpen size={16} className="text-purple-500" />,
              type: 'reading',
              status: 'not-started'
            },
            { 
              label: 'Prompt Engineering', 
              path: '/ai-for-good/prompt-engineering',
              icon: <Activity size={16} className="text-orange-500" />,
              type: 'activity',
              status: 'not-started'
            },
            { 
              label: 'Teambuilding', 
              path: '/ai-for-good/teambuilding',
              icon: <Activity size={16} className="text-orange-500" />,
              type: 'activity',
              status: 'not-started'
            },
            { 
              label: 'Design Thinking', 
              path: '/ai-for-good/mind-map',
              icon: <Activity size={16} className="text-orange-500" />,
              type: 'activity',
              status: 'not-started'
            },
            { 
              label: 'AI Safety', 
              path: '/ai-for-good/ai-ethics',
              icon: <BookOpen size={16} className="text-purple-500" />,
              type: 'reading',
              status: 'not-started'
            },
          ]
        }
      ]
    }
  ],
  routes: [
    { path: '/ai-for-good/welcome', component: withRoleCheck(WelcomePage) },
    { path: '/ai-for-good/intro-to-ai', component: withRoleCheck(IntroToAIPage) },
    { path: '/ai-for-good/game-time', component: withRoleCheck(GameTimePage) },
    { path: '/ai-for-good/prompt-best-practices', component: withRoleCheck(PromptBestPracticesPage) },
    { path: '/ai-for-good/prompt-engineering', component: withRoleCheck(PromptEngineeringPage) },
    { path: '/ai-for-good/teambuilding', component: withRoleCheck(TeambuildingPage) },
    { path: '/ai-for-good/mind-map', component: withRoleCheck(MindMapPage) },
    { path: '/ai-for-good/ai-ethics', component: withRoleCheck(AIEthicsPage) },
    { path: '/ai-for-good', component: () => <Navigate to="/ai-for-good/welcome" replace /> }
  ]
}; 