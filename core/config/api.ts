// Centralized API configuration
export const API_CONFIG = {
  BASE_URL: 'https://restrictedchat.purplemeadow-b77df452.eastus.azurecontainerapps.io',
  WS_BASE_URL: 'wss://restrictedchat.purplemeadow-b77df452.eastus.azurecontainerapps.io'
} as const;

export const RESTRICTED_CHAT_API = API_CONFIG.BASE_URL; 