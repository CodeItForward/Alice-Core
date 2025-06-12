const RESTRICTED_CHAT_API = '/api/chat';

export interface UserInfo {
  user_id: number;
  email: string;
  display_name: string;
  chat_id: number;
  channel_id: number;
  created_at: string;
  updated_at: string;
}

export interface Channel {
  ChannelId: number;
  TeamId: number;
  Name: string;
  IsDefault: boolean;
  CreatedAt: string;
}

export interface ChatMessage {
  MessageId: number;
  ChannelId: number;
  UserId: number;
  Text: string;
  Timestamp: string;
  ReplyToMessageId: number | null;
  user: {
    UserId: number;
    DisplayName: string;
    Email: string;
  };
  type?: string;
  video_url?: string;
  image_url?: string;
}

export interface PostMessageResponse {
  message_id: number;
  status: string;
}

export interface WebSocketMessage {
  type: 'message' | 'text' | 'join' | 'messages_updated' | 'user_joined' | 'user_left' | 'error' | 'video' | 'image';
  text?: string;
  content?: string;
  user_id?: number;
  message_id?: number;
  reply_to_message_id?: number | null;
  messages?: ChatMessage[];
  latest_message_id?: number;
  message?: string;
  active_users?: number;
  active_user_ids?: number[];
  created_at?: string;
  video_url?: string;
  image_url?: string;
  display_name?: string;
  temp_id?: number;
}

export async function getUserByEmail(email: string): Promise<UserInfo> {
  try {
    console.log('Attempting to fetch user info for email:', email);
    console.log('API URL:', `${RESTRICTED_CHAT_API}/users/by-email/${encodeURIComponent(email)}`);
    
    const response = await fetch(`${RESTRICTED_CHAT_API}/users/by-email/${encodeURIComponent(email)}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText
      });
      throw new Error(`Failed to fetch user info: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Successfully fetched user info:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user info:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

export async function getTeamChannels(teamId: number): Promise<Channel[]> {
  try {
    const response = await fetch(`${RESTRICTED_CHAT_API}/teams/${teamId}/channels`);
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Failed to fetch team channels: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching team channels:', error);
    throw error;
  }
}

export async function getChannelMessages(
  teamId: number,
  channelId: number,
  limit: number = 50,
  offset: number = 0
): Promise<ChatMessage[]> {
  try {
    const response = await fetch(
      `${RESTRICTED_CHAT_API}/teams/${teamId}/channels/${channelId}/messages?limit=${limit}&offset=${offset}`
    );
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching channel messages:', error);
    throw error;
  }
}

export async function postMessage(
  teamId: number,
  channelId: number,
  userId: number,
  text: string,
  replyToMessageId: number | null = null
): Promise<PostMessageResponse> {
  try {
    const response = await fetch(
      `${RESTRICTED_CHAT_API}/teams/${teamId}/channels/${channelId}/messages?user_id=${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          reply_to_message_id: replyToMessageId,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to post message: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error posting message:', error);
    throw error;
  }
}

export function createWebSocketConnection(
  teamId: number,
  channelId: number,
  onMessage: (data: WebSocketMessage) => void,
  onError: (error: Event) => void,
  onClose: (event: CloseEvent) => void
): WebSocket {
  const wsUrl = `wss://restrictedchat.purplemeadow-b77df452.eastus.azurecontainerapps.io/teams/${teamId}/channels/${channelId}/ws`;
  console.log('Connecting to WebSocket:', wsUrl);
  
  const ws = new WebSocket(wsUrl);

  // Wait for connection to be fully established
  ws.onopen = () => {
    console.log('WebSocket connection established');
    // Small delay to ensure connection is ready
    setTimeout(() => {
      if (ws.readyState === WebSocket.OPEN) {
        const userId = parseInt(localStorage.getItem('userId') || '1', 10);
        const message = { user_id: userId };
        console.log('Sending WebSocket message:', JSON.stringify(message, null, 2));
        ws.send(JSON.stringify(message));
      }
    }, 100);
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as WebSocketMessage;
      console.log('Received WebSocket message:', JSON.stringify(data, null, 2));
      onMessage(data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('WebSocket connection error:', error);
    onError(error);
  };

  ws.onclose = (event) => {
    console.log('WebSocket closed with code:', event.code, 'reason:', event.reason);
    onClose(event);
  };

  return ws;
} 