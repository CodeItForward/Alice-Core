import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import ChatContainer from './chat/ChatContainer';
import { MessageProvider } from './context/MessageContext';

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

interface Theme {
  siteTitle: string;
  Logo: React.ComponentType;
  colorScheme: { primary: string; secondary: string };
}

const ThemeContext = React.createContext<Theme | null>(null);

const AliceApp: React.FC<AliceAppProps> = ({ config, plugins }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [theme, setTheme] = React.useState<Theme | null>(null);

  React.useEffect(() => {
    async function loadTheme() {
      const themeModule = await import(`../themes/${config.theme}/index.tsx`);
      setTheme(themeModule.default);
    }
    loadTheme();
  }, [config.theme]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Collect all nav links from plugins
  const pluginNavLinks = plugins.flatMap(plugin => plugin.navLinks);
  
  // Collect all routes from plugins
  const pluginRoutes = plugins.flatMap(plugin => plugin.routes);

  console.log('AliceApp loaded with config:', config);
  console.log('AliceApp loaded with plugins:', plugins);
  console.log('Plugin nav links:', pluginNavLinks);
  console.log('Plugin routes:', pluginRoutes);

  if (!theme) return <div>Loading theme...</div>;

  return (
    <ThemeContext.Provider value={theme}>
      <MessageProvider>
        <Router>
          <div className="flex h-screen bg-gray-50 text-gray-900">
            <Sidebar 
              isOpen={isSidebarOpen} 
              toggleSidebar={toggleSidebar}
              pluginNavLinks={pluginNavLinks}
              Logo={theme.Logo}
              colorScheme={theme.colorScheme}
            />
            <div className="flex flex-col flex-grow overflow-hidden">
              <Header 
                toggleSidebar={toggleSidebar} 
                isSidebarOpen={isSidebarOpen}
                siteName={theme.siteTitle}
                Logo={theme.Logo}
                colorScheme={theme.colorScheme}
              />
              <main className="flex-grow overflow-hidden">
                <Routes>
                  {/* Default chat route */}
                  <Route path="/" element={<ChatContainer openAIApiKey={config.openAIApiKey} />} />
                  <Route path="/chat" element={<ChatContainer openAIApiKey={config.openAIApiKey} />} />
                  
                  {/* Plugin routes */}
                  {pluginRoutes.map((route, index) => (
                    <Route 
                      key={`${route.path}-${index}`}
                      path={route.path} 
                      element={<route.component />} 
                    />
                  ))}
                  
                  {/* Fallback to chat */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </MessageProvider>
    </ThemeContext.Provider>
  );
};

export default AliceApp; 