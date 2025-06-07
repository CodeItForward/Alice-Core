const RESTRICTED_CHAT_API = 'https://restrictedchat.purplemeadow-b77df452.eastus.azurecontainerapps.io';

export interface UserInfo {
  user_id: number;
  email: string;
  display_name: string;
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

export async function getUserByEmail(email: string): Promise<UserInfo> {
  try {
    const response = await fetch(`${RESTRICTED_CHAT_API}/users/by-email/${encodeURIComponent(email)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user info:', error);
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