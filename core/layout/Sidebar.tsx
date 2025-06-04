import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquarePlus, ChevronLeft, ChevronDown, ChevronRight } from 'lucide-react';
// import { Logo } from '../ui/Logo';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  pluginNavLinks?: Array<{ label: string; path: string; children?: Array<{ label: string; path: string }> }>;
  Logo?: React.ComponentType;
  colorScheme?: { primary: string; secondary: string };
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, pluginNavLinks = [], Logo, colorScheme }) => {
  const [openSection, setOpenSection] = React.useState<string | null>(null);

  const handleSectionClick = (path: string) => {
    setOpenSection(openSection === path ? null : path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-200 ease-in-out" 
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {Logo ? <Logo /> : null}
          <button 
            onClick={toggleSidebar} 
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 lg:hidden"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          <SidebarLink to="/chat" icon={<MessageSquarePlus size={18} />} label="New Chat" />
          
          {/* Plugin navigation links */}
          {pluginNavLinks.map((navLink, index) =>
            navLink.children ? (
              <div key={`${navLink.path}-${index}`}> 
                <button
                  className="flex items-center w-full px-3 py-2 text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-800 transition-colors duration-200 group font-medium focus:outline-none"
                  onClick={() => handleSectionClick(navLink.path)}
                  aria-expanded={openSection === navLink.path}
                >
                  <span className="flex-1 text-left">{navLink.label}</span>
                  {openSection === navLink.path ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
                {openSection === navLink.path && (
                  <div className="ml-4 mt-1 space-y-1">
                    {navLink.children.map((child: any, childIdx: number) => (
                      <SidebarLink
                        key={`${child.path}-${childIdx}`}
                        to={child.path}
                        label={child.label}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <SidebarLink 
                key={`${navLink.path}-${index}`}
                to={navLink.path}
                label={navLink.label}
              />
            )
          )}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full" style={{ background: colorScheme?.secondary || '#EDE9FE', color: colorScheme?.primary || '#6D28D9' }}>
              <span className="flex items-center justify-center h-full">A</span>
            </div>
            <div className="text-sm pl-2">
              <p className="font-medium">Alice</p>
              <p className="text-gray-500 text-xs">AI Assistant</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const SidebarLink: React.FC<{ to: string; icon?: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  return (
    <Link 
      to={to}
      className="flex items-center w-full px-3 py-2 text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-800 transition-colors duration-200 group"
    >
      {icon && <span className="mr-3 text-gray-500 group-hover:text-purple-800 transition-colors duration-200">{icon}</span>}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default Sidebar;