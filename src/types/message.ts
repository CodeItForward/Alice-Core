export interface MessageType {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}