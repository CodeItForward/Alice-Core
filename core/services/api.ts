const RESTRICTED_CHAT_API = 'https://restrictedchat.purplemeadow-b77df452.eastus.azurecontainerapps.io';

export interface UserInfo {
  UserId: number;
  DisplayName: string;
  Email: string;
  CreatedAt: string;
  UpdatedAt: string;
  PromptEngineeringTeamId: number;
  PromptEngineeringChannelId: number;
  PersonalTeamId: number;
  PersonalChannelId: number;
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

export interface ComicStrip {
  ComicStripId: number;
  UserId: number;
  Panel1Image: string;
  Panel1Caption: string;
  Panel2Image: string;
  Panel2Caption: string;
  Panel3Image: string;
  Panel3Caption: string;
  Panel4Image: string;
  Panel4Caption: string;
}

export async function getUserByEmail(email: string): Promise<UserInfo> {
  try {
    console.log('Attempting to fetch user info for email:', email);
    const baseUrl = 'https://restrictedchat.purplemeadow-b77df452.eastus.azurecontainerapps.io';
    const url = `${baseUrl}/users/by-email/${encodeURIComponent(email)}/metadata`;
    console.log('API URL:', url);
    
    console.log('Making fetch request...');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    console.log('Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });
    
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
    
    console.log('Parsing response JSON...');
    const data = await response.json();
    console.log('Raw response data:', data);
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
    console.log('Fetching channels for team:', teamId);
    const url = `${RESTRICTED_CHAT_API}/teams/${teamId}/channels`;
    console.log('API URL:', url);
    
    const response = await fetch(url);
    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('No channels found for team:', teamId);
        return [];
      }
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Failed to fetch team channels: ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Channels data:', data);
    return data;
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
  const baseUrl = 'wss://restrictedchat.purplemeadow-b77df452.eastus.azurecontainerapps.io';
  const wsUrl = `${baseUrl}/teams/${teamId}/channels/${channelId}/ws`;
  console.log('Connecting to WebSocket:', wsUrl);
  
  const ws = new WebSocket(wsUrl);
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data) as WebSocketMessage;
      onMessage(data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
      onError(error as Event);
    }
  };
  
  ws.onerror = onError;
  ws.onclose = onClose;
  
  return ws;
}

export const getComicStrip = async (comicStripId: number): Promise<ComicStrip> => {
  const baseUrl = 'https://restrictedchat.purplemeadow-b77df452.eastus.azurecontainerapps.io';
  const response = await fetch(`${baseUrl}/comic-strips/${comicStripId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch comic strip');
  }
  return response.json();
};

export const getUserComicStrips = async (userId: number): Promise<ComicStrip[]> => {
  const baseUrl = 'https://restrictedchat.purplemeadow-b77df452.eastus.azurecontainerapps.io';
  const response = await fetch(`${baseUrl}/comic-strips/user/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user comic strips');
  }
  return response.json();
};

export const createComicStrip = async (comicStrip: Omit<ComicStrip, 'ComicStripId'>): Promise<ComicStrip> => {
  const baseUrl = 'https://restrictedchat.purplemeadow-b77df452.eastus.azurecontainerapps.io';
  const response = await fetch(`${baseUrl}/comic-strips`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(comicStrip),
  });
  if (!response.ok) {
    throw new Error('Failed to create comic strip');
  }
  return response.json();
};

export const updateComicStrip = async (comicStripId: number, comicStrip: Partial<ComicStrip>): Promise<ComicStrip> => {
  const baseUrl = 'https://restrictedchat.purplemeadow-b77df452.eastus.azurecontainerapps.io';
  const response = await fetch(`${baseUrl}/comic-strips/${comicStripId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(comicStrip),
  });
  if (!response.ok) {
    throw new Error('Failed to update comic strip');
  }
  return response.json();
}; 