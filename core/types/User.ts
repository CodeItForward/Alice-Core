export type UserLevel = "basic" | "super" | "god";

export interface User {
  id: string;
  email: string;
  level: UserLevel;
  displayName: string;
  PromptEngineeringChatId: number;
  PromptEngineeringChannelId: number;
  createdAt: string;
  updatedAt: string;
  PersonalTeamId: number;
  PersonalChannelId: number;
  // Add more fields as needed
} 