import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquarePlus, ChevronLeft, ChevronDown, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
// import { Logo } from '../ui/Logo';

interface SidebarNavLink {
  label: string;
  path: string;
  icon?: React.ReactNode;
  status?: string;
  type?: string;
  children?: SidebarNavLink[];
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  pluginNavLinks?: SidebarNavLink[];
  Logo?: React.ComponentType;
  colorScheme?: { primary: string; secondary: string };
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, pluginNavLinks = [], Logo, colorScheme }) => {
  const [openSection, setOpenSection] = React.useState<string | null>(null);
  const [openSubSection, setOpenSubSection] = React.useState<string | null>(null);
  const [isMinimized, setIsMinimized] = React.useState(false);
  const location = useLocation();

  console.log('Sidebar received pluginNavLinks:', pluginNavLinks);

  const handleSectionClick = (path: string) => {
    setOpenSection(openSection === path ? null : path);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Filter out chat links
  const filteredNavLinks = pluginNavLinks.filter(navLink => 
    !((navLink.path === '/chat' && navLink.label === 'Chat') || 
      (navLink.path === '/codeitforward-chat' && navLink.label === "Let's Chat"))
  );
  console.log('Filtered nav links:', filteredNavLinks);

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
        } fixed inset-y-0 left-0 z-30 ${
          isMinimized ? 'w-16' : 'w-64'
        } bg-white shadow-lg transform transition-all duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto flex flex-col`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {!isMinimized && Logo ? <Logo /> : null}
          <button 
            onClick={toggleSidebar} 
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 lg:hidden"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        
        <div className="flex justify-end px-4 py-2">
          <button 
            onClick={toggleMinimize} 
            className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 hidden lg:block"
          >
            {isMinimized ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>
        
        <nav className={`p-4 space-y-2 ${isMinimized ? 'px-2' : ''}`}
          style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}
        >
          {pluginNavLinks.some(link => link.path === '/chat' && link.label === 'Chat') && (
            <SidebarLink 
              to="/chat" 
              icon={<MessageSquarePlus size={18} />} 
              label="New Chat" 
              isMinimized={isMinimized}
            />
          )}
          {pluginNavLinks.some(link => link.path === '/codeitforward-chat' && link.label === "Let's Chat") && (
            <SidebarLink 
              to="/codeitforward-chat" 
              icon={<MessageSquarePlus size={18} />} 
              label="Let's Chat" 
              isMinimized={isMinimized}
            />
          )}
          
          {/* Plugin navigation links */}
          {filteredNavLinks.map((navLink, index) => {
            // If this is the AI for Good parent, always render its children expanded
            if (navLink.label === 'AI for Good' && Array.isArray(navLink.children)) {
              return (
                <div key={`${navLink.path}-${index}`}> 
                  <SidebarLink
                    to={navLink.path}
                    label={navLink.label}
                    icon={navLink.icon}
                    status={navLink.status}
                    type={navLink.type}
                    isMinimized={isMinimized}
                  />
                  <div className="ml-4 mt-1 space-y-1">
                    {navLink.children.map((child: any, childIdx: number) =>
                      child.children ? (
                        <div key={`${child.path}-${childIdx}`}> 
                          <button
                            className={`flex items-center w-full px-3 py-2 text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-800 transition-colors duration-200 group font-medium focus:outline-none ${isMinimized ? 'justify-center' : ''}`}
                            onClick={() => setOpenSubSection(openSubSection === child.path ? null : child.path)}
                            aria-expanded={openSubSection === child.path}
                          >
                            {!isMinimized && <span className="flex-1 text-left">{child.label}</span>}
                            {openSubSection === child.path ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                          {openSubSection === child.path && !isMinimized && (
                            <div className="ml-4 mt-1 space-y-1">
                              {child.children.map((grandChild: any, grandIdx: number) => (
                                <SidebarLink
                                  key={`${grandChild.path}-${grandIdx}`}
                                  to={grandChild.path}
                                  label={grandChild.label}
                                  icon={grandChild.icon}
                                  status={grandChild.status}
                                  type={grandChild.type}
                                  isMinimized={isMinimized}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <SidebarLink
                          key={`${child.path}-${childIdx}`}
                          to={child.path}
                          label={child.label}
                          icon={child.icon}
                          status={child.status}
                          type={child.type}
                          isMinimized={isMinimized}
                        />
                      )
                    )}
                  </div>
                </div>
              );
            }
            // Default behavior for other nav links
            return navLink.children ? (
              <div key={`${navLink.path}-${index}`}> 
                <button
                  className={`flex items-center w-full px-3 py-2 text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-800 transition-colors duration-200 group font-medium focus:outline-none ${isMinimized ? 'justify-center' : ''}`}
                  onClick={() => handleSectionClick(navLink.path)}
                  aria-expanded={openSection === navLink.path}
                >
                  {!isMinimized && <span className="flex-1 text-left">{navLink.label}</span>}
                  {openSection === navLink.path ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </button>
                {openSection === navLink.path && !isMinimized && (
                  <div className="ml-4 mt-1 space-y-1">
                    {Array.isArray(navLink.children) ? navLink.children.map((child: any, childIdx: number) =>
                      child.children ? (
                        <div key={`${child.path}-${childIdx}`}> 
                          <button
                            className={`flex items-center w-full px-3 py-2 text-gray-700 rounded-md hover:bg-purple-50 hover:text-purple-800 transition-colors duration-200 group font-medium focus:outline-none ${isMinimized ? 'justify-center' : ''}`}
                            onClick={() => setOpenSubSection(openSubSection === child.path ? null : child.path)}
                            aria-expanded={openSubSection === child.path}
                          >
                            {!isMinimized && <span className="flex-1 text-left">{child.label}</span>}
                            {openSubSection === child.path ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                          {openSubSection === child.path && !isMinimized && (
                            <div className="ml-4 mt-1 space-y-1">
                              {child.children.map((grandChild: any, grandIdx: number) => (
                                <SidebarLink
                                  key={`${grandChild.path}-${grandIdx}`}
                                  to={grandChild.path}
                                  label={grandChild.label}
                                  icon={grandChild.icon}
                                  status={grandChild.status}
                                  type={grandChild.type}
                                  isMinimized={isMinimized}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <SidebarLink
                          key={`${child.path}-${childIdx}`}
                          to={child.path}
                          label={child.label}
                          icon={child.icon}
                          status={child.status}
                          type={child.type}
                          isMinimized={isMinimized}
                        />
                      )
                    ) : null}
                  </div>
                )}
              </div>
            ) : (
              <SidebarLink 
                key={`${navLink.path}-${index}`}
                to={navLink.path}
                label={navLink.label}
                icon={navLink.icon}
                status={navLink.status}
                type={navLink.type}
                isMinimized={isMinimized}
              />
            );
          })}
        </nav>
        
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 ${isMinimized ? 'px-2' : ''}`}
          style={{ background: 'white' }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full" style={{ background: colorScheme?.secondary || '#EDE9FE', color: colorScheme?.primary || '#6D28D9' }}>
              <span className="flex items-center justify-center h-full">A</span>
            </div>
            {!isMinimized && (
              <div className="text-sm pl-2">
                <p className="font-medium">Alice</p>
                <p className="text-gray-500 text-xs">AI Assistant</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

const SidebarLink: React.FC<{ 
  to: string; 
  icon?: React.ReactNode; 
  label: string;
  status?: string;
  type?: string;
  isMinimized?: boolean;
}> = ({ to, icon, label, status, type, isMinimized }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  // Determine if this link is above the active link in the nav tree
  // We'll use status === 'completed' for green, isActive for yellow
  const CheckCircle = ({ size, className }: { size: number; className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <path d="m9 11 3 3L22 4"></path>
    </svg>
  );
  const Clock = ({ size, className }: { size: number; className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12,6 12,12 16,14"></polyline>
    </svg>
  );
  let statusIcon = null;
  let statusClasses = 'text-gray-600 hover:bg-purple-50 hover:text-purple-800';
  if (isActive) {
    statusClasses = 'bg-yellow-50 text-yellow-800';
    statusIcon = <Clock size={16} className="text-yellow-500" />;
  } else if (status === 'completed') {
    statusClasses = 'bg-green-50 text-green-800';
    statusIcon = <CheckCircle size={16} className="text-green-500" />;
  }
  return (
    <Link 
      to={to}
      className={`flex items-center w-full px-3 py-2 rounded transition-colors duration-200 group ${statusClasses} ${isMinimized ? 'justify-center' : ''}`}
      title={isMinimized ? label : undefined}
    >
      {icon && <span className={`text-gray-500 group-hover:text-purple-800 transition-colors duration-200 ${!isMinimized ? 'mr-3' : ''}`}>{icon}</span>}
      {!isMinimized && <span className="font-medium flex-1">{label}</span>}
      {!isMinimized && statusIcon}
    </Link>
  );
};

export default Sidebar;