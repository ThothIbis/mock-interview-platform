"use client";

import { useState, useEffect, Suspense } from "react";
import { Container, Text, Stack, Card, Group, Button, Badge, Avatar, Alert, Loader } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";

function InterviewRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes in seconds
  const [error, setError] = useState<string>("");

  // Get room URL from query params
  const roomUrl = searchParams.get('roomUrl');
  const sessionId = searchParams.get('sessionId');

  useEffect(() => {
    if (!roomUrl) {
      setError("No room URL provided. Please start from the setup page.");
      return;
    }
  }, [roomUrl]);

  useEffect(() => {
    // Timer for interview duration
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          endInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const endInterview = () => {
    router.push('/interview/results');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining <= 30) return "red";
    if (timeRemaining <= 120) return "yellow";
    return "green";
  };

  // Generate Daily.co iframe URL with embed parameters
  const getDailyIframeUrl = () => {
    if (!roomUrl) return '';
    
    const url = new URL(roomUrl);
    // Add embed styling parameters
    url.searchParams.set('embed', 'true');
    url.searchParams.set('styling', 'custom');
    
    return url.toString();
  };

  if (error) {
    return (
      <Container size="lg" className="min-h-screen flex items-center justify-center">
        <Alert color="red" title="Connection Error" className="max-w-md">
          <Text className="mb-4">{error}</Text>
          <Group justify="center">
            <Button onClick={() => router.push('/interview/setup')}>
              Back to Setup
            </Button>
          </Group>
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" className="min-h-screen py-4">
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between" className="px-4 py-2 bg-white rounded-lg shadow">
          <Group>
            <Badge color={getTimerColor()} size="lg">
              {formatTime(timeRemaining)}
            </Badge>
            <Text>Mock Interview in Progress</Text>
          </Group>
          <Button color="red" variant="outline" onClick={endInterview}>
            End Interview
          </Button>
        </Group>

        {/* Video Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
          {/* Daily.co Video Call - Takes 2/3 of space */}
          <div className="lg:col-span-2">
            <Card className="h-full overflow-hidden bg-gray-900">
              <div className="absolute top-4 left-4 z-10">
                <Badge color="blue" size="lg">Video Call</Badge>
              </div>
              {roomUrl ? (
                <iframe
                  src={getDailyIframeUrl()}
                  className="w-full h-full border-0 rounded-lg"
                  allow="camera; microphone; fullscreen; display-capture"
                  allowFullScreen
                  title="Interview Video Call"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Text color="white">Loading video call...</Text>
                </div>
              )}
            </Card>
          </div>

          {/* AI Interviewer Panel */}
          <div className="lg:col-span-1">
            <Stack gap="md" className="h-full">
              {/* AI Interviewer Card */}
              <Card className="flex-1 bg-gradient-to-br from-blue-600 to-blue-800">
                <div className="h-full flex flex-col items-center justify-center">
                  <Avatar size={80} radius="xl" className="mb-3">
                    AI
                  </Avatar>
                  <Text size="lg" color="white" fw={500}>Sarah Johnson</Text>
                  <Text size="sm" color="white" opacity={0.8}>Professional Interviewer</Text>
                  <Text size="xs" color="white" opacity={0.6} className="mt-2 text-center">
                    Ready to begin your interview
                  </Text>
                </div>
              </Card>

              {/* Interview Status */}
              <Card className="bg-blue-50">
                <Text size="sm" fw={500} className="mb-2">Interview Status</Text>
                <Text size="xs" className="mb-2">
                  Time Remaining: {formatTime(timeRemaining)}
                </Text>
                <Text size="xs" c="dimmed">
                  Speak naturally and take your time with responses.
                </Text>
                {sessionId && (
                  <Text size="xs" c="dimmed" className="mt-2">
                    Session: {sessionId}
                  </Text>
                )}
              </Card>

              {/* Quick Tips */}
              <Card className="bg-green-50">
                <Text size="sm" fw={500} className="mb-2">💡 Quick Tips</Text>
                <ul className="text-xs space-y-1">
                  <li>• Look at the camera, not the screen</li>
                  <li>• Speak clearly and at normal pace</li>
                  <li>• Use the STAR method for examples</li>
                  <li>• It&apos;s okay to pause and think</li>
                </ul>
              </Card>
            </Stack>
          </div>
        </div>

        {/* Controls & Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <Text fw={500} className="mb-2">📹 Video Controls</Text>
            <Text size="sm" c="dimmed">
              Use the controls in the video window to mute, turn off camera, or adjust settings.
              The AI interviewer will wait if you need a moment.
            </Text>
          </Card>

          <Card>
            <Text fw={500} className="mb-2">🎯 Interview Flow</Text>
            <Text size="sm" c="dimmed">
              This is a behavioral interview focusing on your experiences and problem-solving approach.
              Questions will build on your responses naturally.
            </Text>
          </Card>
        </div>
      </Stack>
    </Container>
  );
}

export default function InterviewRoom() {
  return (
    <Suspense fallback={
      <Container size="lg" className="min-h-screen flex items-center justify-center">
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text>Loading interview room...</Text>
        </Stack>
      </Container>
    }>
      <InterviewRoomContent />
    </Suspense>
  );
}