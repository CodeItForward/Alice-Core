import { RESTRICTED_CHAT_API, API_CONFIG } from '../config/api';

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

export interface Team {
  TeamId: number;
  Name: string;
  Description?: string;
  CreatedAt: string;
}

export interface StudentProfile {
  id: number;
  user_id: number;
  class_id?: number;
  team_id: number;
  first_name: string;
  fun_fact: string;
  animal: string;
  ice_cream: string;
  travel_location: string;
  laugh_trigger: string;
  proud_of: string;
  build_idea: string;
  who_to_help: string;
  world_change: string;
  mayor_for_day: string;
  created_at: string;
  updated_at?: string;
}

export interface StudentProfileCreate {
  user_id: number;
  class_id: number;
  team_id: number;
  first_name: string;
  fun_fact: string;
  animal: string;
  ice_cream: string;
  travel_location: string;
  laugh_trigger: string;
  proud_of: string;
  build_idea: string;
  who_to_help: string;
  world_change: string;
  mayor_for_day: string;
}

export interface StudentProfileUpdate {
  first_name?: string;
  fun_fact?: string;
  animal?: string;
  ice_cream?: string;
  travel_location?: string;
  laugh_trigger?: string;
  proud_of?: string;
  build_idea?: string;
  who_to_help?: string;
  world_change?: string;
  mayor_for_day?: string;
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
  additional_context?: string[];
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

export interface DesignThinkingChats {
  PersonaHelping: number;
  PersonaChallenge: number;
  PersonaBestDay: number;
  PersonaWhyHelp: number;
  ProblemStatementEmpathy: number;
  ProblemStatementHowHelp: number;
  ProblemStatementWhy: number;
  PersonaHelpingChannel: number;
  PersonaChallengeChannel: number;
  PersonaBestDayChannel: number;
  PersonaWhyHelpChannel: number;
  ProblemStatementEmpathyChannel: number;
  ProblemStatementHowHelpChannel: number;
  ProblemStatementWhyChannel: number;
}

export interface ImageUploadResponse {
  id: string;
  created: number;
  data: {
    url: string;
  }[];
}

export async function getUserByEmail(email: string): Promise<UserInfo> {
  try {
    console.log('Attempting to fetch user info for email:', email);
    const url = `${RESTRICTED_CHAT_API}/users/by-email/${encodeURIComponent(email)}/metadata`;
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
      
      // Provide specific error messages based on status code
      if (response.status === 404) {
        throw new Error(`404: User with email "${email}" not found in the system`);
      } else if (response.status === 500) {
        throw new Error(`500: Internal server error - ${errorText}`);
      } else if (response.status === 403) {
        throw new Error(`403: Access forbidden - ${errorText}`);
      } else {
        throw new Error(`Failed to fetch user info: ${response.status} ${response.statusText} - ${errorText}`);
      }
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

export async function getUserTeams(userId: number): Promise<Team[]> {
  try {
    console.log('Fetching teams for user:', userId);
    const url = `${RESTRICTED_CHAT_API}/teams/user/${userId}/type/1`;
    console.log('API URL:', url);
    
    const response = await fetch(url);
    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('No teams found for user:', userId);
        return [];
      }
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Failed to fetch user teams: ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Teams data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user teams:', error);
    throw error;
  }
}

export async function getUserTeamsByType(userId: number, type: number): Promise<Team[]> {
  try {
    console.log('Fetching teams for user:', userId, 'type:', type);
    const url = `${RESTRICTED_CHAT_API}/teams/user/${userId}/type/${type}`;
    console.log('API URL:', url);
    
    const response = await fetch(url);
    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('No teams found for user:', userId, 'type:', type);
        return [];
      }
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Failed to fetch user teams: ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Teams data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user teams:', error);
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
  replyToMessageId: number | null = null,
  additionalContext: string[] = []
): Promise<PostMessageResponse> {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      user_id: userId.toString()
    });
    
    // Add additional_context if provided
    if (additionalContext.length > 0) {
      additionalContext.forEach(context => {
        params.append('additional_context', context);
      });
    }
    
    const requestBody = {
      text,
      reply_to_message_id: replyToMessageId,
    };
    
    const url = `${RESTRICTED_CHAT_API}/teams/${teamId}/channels/${channelId}/messages?${params.toString()}`;
    
    console.log('=== POST MESSAGE API CALL ===');
    console.log('URL:', url);
    console.log('Method: POST');
    console.log('Headers:', {
      'Content-Type': 'application/json'
    });
    console.log('Query Parameters:', Object.fromEntries(params.entries()));
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));
    console.log('=============================');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
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
  onClose: (event: CloseEvent) => void,
  onOpen?: (ws: WebSocket) => void
): WebSocket {
  const wsUrl = `${API_CONFIG.WS_BASE_URL}/teams/${teamId}/channels/${channelId}/ws`;
  console.log('Connecting to WebSocket:', wsUrl);
  
  const ws = new WebSocket(wsUrl);
  
  ws.onopen = () => {
    if (onOpen) onOpen(ws);
  };
  
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
  const response = await fetch(`${RESTRICTED_CHAT_API}/comic-strips/${comicStripId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch comic strip');
  }
  return response.json();
};

export const getUserComicStrips = async (userId: number): Promise<ComicStrip[]> => {
  const response = await fetch(`${RESTRICTED_CHAT_API}/comic-strips/user/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user comic strips');
  }
  return response.json();
};

export const createComicStrip = async (comicStrip: Omit<ComicStrip, 'ComicStripId'>): Promise<ComicStrip> => {
  const response = await fetch(`${RESTRICTED_CHAT_API}/comic-strips`, {
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
  const response = await fetch(`${RESTRICTED_CHAT_API}/comic-strips/${comicStripId}`, {
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

export async function uploadImageToOpenAI(imageUrl: string): Promise<string> {
  try {
    // First fetch the image from the URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image from URL: ${imageResponse.statusText}`);
    }
    const imageBlob = await imageResponse.blob();

    // Upload the image to OpenAI
    const formData = new FormData();
    formData.append('image', imageBlob);

    const response = await fetch('https://api.openai.com/v1/images/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to upload image to OpenAI: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json() as ImageUploadResponse;
    return data.id;
  } catch (error) {
    console.error('Error uploading image to OpenAI:', error);
    throw error;
  }
}

export async function generateImageWithReference(
  prompt: string,
  imageUrl: string | null = null
): Promise<string> {
  try {
    let referencedImageIds: string[] = [];
    
    // If an image URL is provided, upload it first
    if (imageUrl) {
      const imageId = await uploadImageToOpenAI(imageUrl);
      referencedImageIds = [imageId];
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt,
        referenced_image_ids: referencedImageIds,
        n: 1,
        size: '1024x1024'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to generate image: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.data[0].url;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

// Student Profile API functions
export async function getStudentProfileByUserId(userId: number): Promise<StudentProfile | null> {
  try {
    console.log('=== GET STUDENT PROFILE BY USER ID ===');
    console.log('User ID:', userId);
    const url = `${RESTRICTED_CHAT_API}/student-profiles/user/${userId}`;
    console.log('Full URL:', url);
    console.log('Method: GET');
    console.log('Headers: None (default fetch headers)');
    
    const response = await fetch(url);
    console.log('Response Status:', response.status, response.statusText);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('No student profile found for user:', userId);
        return null;
      }
      const errorText = await response.text();
      console.error('API Error Response Body:', errorText);
      console.error('API Error Response Details:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Failed to fetch student profile: ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Success Response Data:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error fetching student profile by user ID:', error);
    throw error;
  }
}

export async function getStudentProfileByUserAndClass(userId: number, classId: number): Promise<StudentProfile | null> {
  try {
    console.log('=== GET STUDENT PROFILE BY USER AND CLASS ===');
    console.log('User ID:', userId);
    console.log('Class ID:', classId);
    const url = `${RESTRICTED_CHAT_API}/student-profiles/user/${userId}/class/${classId}`;
    console.log('Full URL:', url);
    console.log('Method: GET');
    console.log('Headers: None (default fetch headers)');
    
    const response = await fetch(url);
    console.log('Response Status:', response.status, response.statusText);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('No student profile found for user:', userId, 'class:', classId);
        const errorText = await response.text();
        console.log('404 Response Body:', errorText);
        return null;
      }
      const errorText = await response.text();
      console.error('API Error Response Body:', errorText);
      console.error('API Error Response Details:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Failed to fetch student profile: ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Success Response Data:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error fetching student profile by user and class:', error);
    throw error;
  }
}

export async function createStudentProfile(profile: StudentProfileCreate): Promise<StudentProfile> {
  try {
    console.log('=== CREATE STUDENT PROFILE ===');
    console.log('Request Data:', JSON.stringify(profile, null, 2));
    const url = `${RESTRICTED_CHAT_API}/student-profiles/create`;
    console.log('Full URL:', url);
    console.log('Method: POST');
    console.log('Headers:', {
      'Content-Type': 'application/json'
    });
    
    const requestBody = JSON.stringify(profile);
    console.log('Request Body:', requestBody);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });
    
    console.log('Response Status:', response.status, response.statusText);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response Body:', errorText);
      console.error('API Error Response Details:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Failed to create student profile: ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Success Response Data:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error creating student profile:', error);
    throw error;
  }
}

export async function updateStudentProfile(profileId: number, profile: StudentProfileUpdate): Promise<StudentProfile> {
  try {
    console.log('=== UPDATE STUDENT PROFILE ===');
    console.log('Profile ID:', profileId);
    console.log('Update Data:', JSON.stringify(profile, null, 2));
    const url = `${RESTRICTED_CHAT_API}/student-profiles/${profileId}`;
    console.log('Full URL:', url);
    console.log('Method: PUT');
    console.log('Headers:', {
      'Content-Type': 'application/json'
    });
    
    const requestBody = JSON.stringify(profile);
    console.log('Request Body:', requestBody);
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });
    
    console.log('Response Status:', response.status, response.statusText);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response Body:', errorText);
      console.error('API Error Response Details:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Failed to update student profile: ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Success Response Data:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error updating student profile:', error);
    throw error;
  }
}

export async function getDesignThinkingChats(teamId: number, userId: number): Promise<DesignThinkingChats> {
  try {
    console.log('Fetching design thinking chats for team:', teamId, 'user:', userId);
    const url = `${RESTRICTED_CHAT_API}/teams/${teamId}/design-thinking-chats?user_id=${userId}`;
    console.log('API URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Failed to fetch design thinking chats: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Successfully fetched design thinking chats:', data);
    return data;
  } catch (error) {
    console.error('Error fetching design thinking chats:', error);
    throw error;
  }
} 