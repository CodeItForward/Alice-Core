import React from 'react';
import { Menu, Bell, HelpCircle } from 'lucide-react';
import UserDropdown from '../ui/UserDropdown';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
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
        <h1 className="ml-4 text-xl font-semibold text-gray-800">Alice</h1>
        <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full font-medium">
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
        <UserDropdown />
      </div>
    </header>
  );
};

export default Header;