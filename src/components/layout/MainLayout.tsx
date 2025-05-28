import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ChatContainer from '../chat/ChatContainer';
import { MessageProvider } from '../../context/MessageContext';

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <MessageProvider>
      <div className="flex h-screen bg-gray-50 text-gray-900">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex flex-col flex-grow overflow-hidden">
          <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <main className="flex-grow overflow-hidden">
            <ChatContainer />
          </main>
        </div>
      </div>
    </MessageProvider>
  );
};

export default MainLayout;