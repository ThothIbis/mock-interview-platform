/**
 * Daily.co integration utilities
 * Client-side functions for working with Daily.co rooms and video calls
 */

export interface DailyRoom {
  id: string;
  name: string;
  url: string;
  sessionId: string;
  expiresAt: string;
  config: {
    maxParticipants: number;
    duration: number;
    enableRecording: boolean;
  };
}

export interface CreateRoomResponse {
  success: boolean;
  room: DailyRoom;
  error?: string;
  message?: string;
}

/**
 * Create a new Daily.co room for an interview session
 */
export async function createInterviewRoom(sessionId?: string): Promise<CreateRoomResponse> {
  try {
    const response = await fetch('/api/interview/create-room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: sessionId || `interview-${Date.now()}`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('Failed to create interview room:', error);
    return {
      success: false,
      error: 'Failed to create interview room',
      message: error instanceof Error ? error.message : 'Unknown error',
    } as CreateRoomResponse;
  }
}

/**
 * Check if Daily.co is properly configured
 */
export async function checkDailyConfiguration(): Promise<{
  configured: boolean;
  domain?: string;
  error?: string;
}> {
  try {
    const response = await fetch('/api/interview/create-room', {
      method: 'GET',
    });

    const data = await response.json();
    
    return {
      configured: data.configured || false,
      domain: data.domain,
    };
  } catch (error) {
    return {
      configured: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Generate a unique session ID for an interview
 */
export function generateSessionId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `interview-${timestamp}-${random}`;
}

/**
 * Parse Daily.co room URL to extract room name
 */
export function parseRoomUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    return pathParts[pathParts.length - 1] || null;
  } catch {
    return null;
  }
}

/**
 * Check if a room URL is valid and not expired
 */
export function isRoomValid(room: DailyRoom): boolean {
  const now = new Date();
  const expiresAt = new Date(room.expiresAt);
  return expiresAt > now;
}

/**
 * Format room expiry time for display
 */
export function formatRoomExpiry(expiresAt: string): string {
  const expiry = new Date(expiresAt);
  const now = new Date();
  const diffMinutes = Math.floor((expiry.getTime() - now.getTime()) / (1000 * 60));
  
  if (diffMinutes <= 0) {
    return 'Expired';
  } else if (diffMinutes < 60) {
    return `Expires in ${diffMinutes} minutes`;
  } else {
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `Expires in ${hours}h ${minutes}m`;
  }
}