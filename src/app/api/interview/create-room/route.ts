/**
 * API route to create Daily.co rooms for mock interviews
 * Creates rooms with proper configuration for interview sessions
 */

import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

interface DailyRoomResponse {
  id: string;
  name: string;
  api_created: boolean;
  privacy: string;
  url: string;
  created_at: string;
  config: {
    max_participants: number;
    enable_chat: boolean;
    enable_screenshare: boolean;
    start_video_off: boolean;
    start_audio_off: boolean;
  };
}

interface CreateRoomRequest {
  sessionId?: string;
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body: CreateRoomRequest = await request.json().catch(() => ({}));
    const sessionId = body.sessionId || `interview-${Date.now()}`;

    // Validate Daily.co configuration
    if (!config.daily.apiKey) {
      return NextResponse.json(
        { error: 'Daily.co API key not configured' },
        { status: 500 }
      );
    }

    // Calculate expiry time (1 hour from now)
    const expiryTime = Math.floor(Date.now() / 1000) + config.interview.expiryHours * 3600;

    // Room configuration for mock interviews
    const roomConfig = {
      name: sessionId,
      privacy: 'public', // No auth required for MVP
      properties: {
        max_participants: config.interview.maxParticipants,
        enable_chat: false, // Focus on interview, not chat
        enable_screenshare: false, // Not needed for interviews
        start_video_off: false, // Start with video on
        start_audio_off: false, // Start with audio on
        enable_recording: config.features.enableRecording,
        exp: expiryTime, // Room expires after 1 hour
        eject_at_room_exp: true, // Automatically eject users when expired
        enable_prejoin_ui: true, // Allow users to test audio/video before joining
        enable_network_ui: true, // Show network quality indicators
        enable_people_ui: true, // Show participant list
      },
    };

    // Create room via Daily.co REST API
    const dailyResponse = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.daily.apiKey}`,
      },
      body: JSON.stringify(roomConfig),
    });

    if (!dailyResponse.ok) {
      const errorData = await dailyResponse.json().catch(() => null);
      console.error('Daily.co API error:', errorData);
      
      return NextResponse.json(
        { 
          error: 'Failed to create Daily.co room',
          details: errorData?.error || 'Unknown error'
        },
        { status: dailyResponse.status }
      );
    }

    const roomData: DailyRoomResponse = await dailyResponse.json();

    // Return room information to frontend
    return NextResponse.json({
      success: true,
      room: {
        id: roomData.id,
        name: roomData.name,
        url: roomData.url,
        sessionId,
        expiresAt: new Date(expiryTime * 1000).toISOString(),
        config: {
          maxParticipants: roomConfig.properties.max_participants,
          duration: config.interview.maxDurationSeconds,
          enableRecording: roomConfig.properties.enable_recording,
        },
      },
    });

  } catch (error) {
    console.error('Error creating Daily.co room:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Health check endpoint
  return NextResponse.json({
    service: 'Daily.co Room Creation',
    status: 'available',
    configured: !!config.daily.apiKey,
    domain: config.daily.domain,
  });
}