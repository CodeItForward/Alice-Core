import React from 'react';
import { Menu, Bell, HelpCircle } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  siteName?: string;
  Logo?: React.ComponentType;
  colorScheme?: { primary: string; secondary: string };
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen, siteName = "Alice", Logo, colorScheme }) => {
  return (
    <header className="h-16 border-b border-gray-200 bg-white shadow-sm flex items-center justify-between px-4">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 lg:hidden"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <Menu size={20} />
        </button>
        {Logo ? <Logo /> : <h1 className="ml-4 text-xl font-semibold text-gray-800">{siteName}</h1>}
        <span className="ml-2 px-2 py-0.5 text-xs" style={{ background: colorScheme?.secondary || '#EDE9FE', color: colorScheme?.primary || '#6D28D9' }}>
          AI Copilot
        </span>
      </div>
      
      <div className="flex items-center space-x-3">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
          <HelpCircle size={20} />
        </button>
        <UserButton />
      </div>
    </header>
  );
};

export default Header;