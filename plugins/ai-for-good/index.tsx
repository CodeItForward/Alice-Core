import React from 'react';
import AiForGoodPage from './AiForGoodPage';
import { useUser } from '@clerk/clerk-react';

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
    { label: 'AI for Good', path: '/ai-for-good' }
  ],
  routes: [
    { path: '/ai-for-good', component: AiForGoodPlugin }
  ]
}; 