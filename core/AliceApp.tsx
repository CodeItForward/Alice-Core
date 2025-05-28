import React from 'react';
import MainLayout from './layout/MainLayout';

interface AliceAppProps {
  config: {
    siteName: string;
    openAIApiKey: string;
    theme: string;
  };
  plugins: Array<{
    name: string;
    navLinks: Array<{ label: string; path: string }>;
    routes: Array<{ path: string; component: React.ComponentType }>;
  }>;
}

const AliceApp: React.FC<AliceAppProps> = ({ config, plugins }) => {
  // For now, we'll just render the MainLayout
  // In the future, this will handle plugin registration, routing, etc.
  console.log('AliceApp loaded with config:', config);
  console.log('AliceApp loaded with plugins:', plugins);
  
  return <MainLayout />;
};

export default AliceApp; 