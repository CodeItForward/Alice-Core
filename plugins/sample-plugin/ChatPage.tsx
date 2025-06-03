import React from 'react';
import PluginChatContainer from './PluginChatContainer';
import { MessageProvider } from '../../core/context/MessageContext';
import { useAuth } from "../../core/context/AuthContext";

const ChatPage: React.FC = () => {
  const { user, signIn, signOut } = useAuth();

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
        {user ? (
          <>
            <div className="mb-2">Signed in as: <span className="font-mono">{user.email}</span></div>
            <div className="mb-2">User Level: <span className="font-bold">{user.level}</span></div>
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={signOut}>Sign Out</button>
          </>
        ) : (
          <>
            <div className="mb-2">Not signed in.</div>
            <button className="px-3 py-1 bg-blue-500 text-white rounded mr-2" onClick={() => signIn('basic')}>Sign In as Basic</button>
            <button className="px-3 py-1 bg-purple-500 text-white rounded mr-2" onClick={() => signIn('super')}>Sign In as Super</button>
            <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => signIn('god')}>Sign In as God</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage; 