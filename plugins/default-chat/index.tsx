import React from 'react';
import ChatContainer from '../../core/chat/ChatContainer';

const DefaultChatPlugin = () => <ChatContainer />;

export default {
  name: 'Default Chat',
  navLinks: [
    { label: 'Chat', path: '/chat' }
  ],
  routes: [
    { path: '/chat', component: DefaultChatPlugin }
  ]
}; 