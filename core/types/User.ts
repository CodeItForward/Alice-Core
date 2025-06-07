export type UserLevel = "basic" | "super" | "god";

export interface User {
  id: string;
  email: string;
  level: UserLevel;
  displayName?: string;
  // Add more fields as needed
} 