"use client";

import { useState, useEffect } from "react";
import { Container, Text, Stack, Card, Group, Button, Badge, Avatar } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function InterviewRoom() {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes in seconds
  const [isInterviewActive, setIsInterviewActive] = useState(true);

  useEffect(() => {
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
    setIsInterviewActive(false);
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

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px]">
          {/* User Video */}
          <Card className="relative overflow-hidden bg-gray-900">
            <div className="absolute bottom-4 left-4 z-10">
              <Badge color="dark" size="lg">You</Badge>
            </div>
            <div className="w-full h-full flex items-center justify-center">
              <Text color="white">Camera Feed</Text>
            </div>
          </Card>

          {/* AI Interviewer */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800">
            <div className="absolute bottom-4 left-4 z-10">
              <Badge color="dark" size="lg">AI Interviewer</Badge>
            </div>
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Avatar size={120} radius="xl" className="mb-4">
                AI
              </Avatar>
              <Text size="lg" color="white" fw={500}>Sarah Johnson</Text>
              <Text size="sm" color="white" opacity={0.8}>Professional Interviewer</Text>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <Card>
          <Group justify="center" gap="xl">
            <Button variant="subtle" size="lg">
              🎤 Mute
            </Button>
            <Button variant="subtle" size="lg">
              📹 Camera Off
            </Button>
            <Button variant="subtle" size="lg">
              💬 Transcript
            </Button>
          </Group>
        </Card>

        {/* Status */}
        <Card className="bg-blue-50">
          <Text size="sm" className="text-center">
            The AI interviewer is conducting your mock interview. 
            Speak naturally and take your time with responses.
          </Text>
        </Card>
      </Stack>
    </Container>
  );
}