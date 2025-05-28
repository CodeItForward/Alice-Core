import React from "react";
import ChatPage from "./ChatPage";

export default {
  name: "Sample Plugin",
  navLinks: [
    { label: "Sample Plugin", path: "/sample/chat" }
  ],
  routes: [
    { path: "/sample/chat", component: ChatPage }
  ]
}; 