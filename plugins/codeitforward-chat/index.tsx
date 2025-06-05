import React from 'react';
import ChatContainer from '../../core/chat/ChatContainer';

const CodeItForwardChatPlugin = () => <ChatContainer />;

export default {
  name: 'CodeItForward Chat',
  navLinks: [
    { label: "Let's Chat", path: '/codeitforward-chat' }
  ],
  routes: [
    { path: '/codeitforward-chat', component: CodeItForwardChatPlugin }
  ]
}; 