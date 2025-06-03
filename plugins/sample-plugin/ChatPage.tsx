import React from 'react';
import PluginChatContainer from './PluginChatContainer';
import { MessageProvider } from '../../core/context/MessageContext';
import { useUser } from '@clerk/clerk-react';

const getRoleLabel = (role: string) => {
  if (role === 'god') return 'God Mode';
  if (role === 'super') return 'Super User';
  if (role === 'basic') return 'Basic User';
  // Prettify any other role (e.g., creative-coders -> Creative Coders)
  return role.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

const ChatPage: React.FC = () => {
  const { user } = useUser();
  // Support both array and string for backward compatibility
  const rolesRaw = user?.publicMetadata?.role ?? 'basic';
  const roles: string[] = Array.isArray(rolesRaw) ? rolesRaw : [rolesRaw];
  const roleLabels = roles.map(getRoleLabel).join(', ');

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <MessageProvider>
        <PluginChatContainer 
          header="Welcome to the Sample Plugin Chat!"
          subheader="This chat is fully customizable from the plugin code."
        />
      </MessageProvider>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Sample Plugin Chat Page</h1>
        <div className="mb-2">User Roles: <span className="font-bold">{roleLabels}</span></div>
        <div className="mb-2">(Raw value: <span className="font-mono">{JSON.stringify(rolesRaw)}</span>)</div>
      </div>
    </div>
  );
};

export default ChatPage; 