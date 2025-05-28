import React from "react";
import ChatPage from "./ChatPage";

export default {
  name: "Sample Plugin",
  navLinks: [
    { label: "Chat", path: "/sample/chat" }
  ],
  routes: [
    { path: "/sample", component: () => <div>This is the sample plugin page!</div> },
    { path: "/sample/chat", component: ChatPage }
  ]
}; 