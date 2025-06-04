import React from 'react';
import BadgesPage from './BadgesPage';
import { useUser } from '@clerk/clerk-react';

const BadgesPlugin = () => {
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
  if (!roles.includes('badges')) {
    return (
      <div className="p-6 text-center text-red-600">
        You do not have permission to access the Badges plugin.
      </div>
    );
  }
  return <BadgesPage />;
};

export default {
  name: 'Badges',
  navLinks: [
    { label: 'Badges', path: '/badges' }
  ],
  routes: [
    { path: '/badges', component: BadgesPlugin }
  ]
}; 