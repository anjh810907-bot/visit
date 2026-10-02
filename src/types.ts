export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  emoji: string;
  likes?: number;
  isLiked?: boolean;
}

export type SortOption = 'latest' | 'oldest' | 'likes';

export interface GasApiResponse {
  status: 'success' | 'error';
  message?: string;
  count?: number;
  data?: GuestbookEntry[] | GuestbookEntry;
}

export interface ConnectionStatus {
  isConnected: boolean;
  isTesting: boolean;
  lastChecked?: string;
  errorMessage?: string;
  url: string;
}
