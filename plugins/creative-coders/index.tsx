import React from 'react';
import CreativeCodersPage from './CreativeCodersPage';
import { useUser } from '@clerk/clerk-react';

const CreativeCodersPlugin = () => {
  const { user } = useUser();
  const rolesRaw = user?.publicMetadata?.role ?? [];
  const roles: string[] = Array.isArray(rolesRaw) ? rolesRaw : [rolesRaw];
  console.log('Creative Coders roles:', roles);
  if (!roles.includes('creative-coders')) return null;
  return <CreativeCodersPage />;
};

export default {
  name: 'Creative Coders',
  navLinks: [
    { label: 'Creative Coders', path: '/creative-coders' }
  ],
  routes: [
    { path: '/creative-coders', component: CreativeCodersPlugin }
  ]
}; 