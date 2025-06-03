export type UserLevel = "basic" | "super" | "god";

export interface User {
  id: string;
  email: string;
  level: UserLevel;
  // Add more fields as needed
} 