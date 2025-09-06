"use client";

import { Button, Container, Title, Text, Stack, Group, Card } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <Container size="lg" className="min-h-screen flex items-center justify-center">
      <Card shadow="lg" padding="xl" radius="md" className="w-full max-w-2xl">
        <Stack gap="xl" align="center">
          <div className="text-center">
            <Title order={1} className="mb-4">
              AI Mock Interview Platform
            </Title>
            <Text size="lg" c="dimmed" className="mb-8">
              Practice your interview skills with our AI interviewer. 
              Get real-time feedback and improve your performance.
            </Text>
          </div>

          <Stack gap="md" className="w-full">
            <Card className="bg-gray-50">
              <Text fw={500} className="mb-2">What to expect:</Text>
              <ul className="space-y-2">
                <li>15-minute behavioral interview</li>
                <li>5-7 contextual questions</li>
                <li>Real-time conversation with AI interviewer</li>
                <li>Instant transcript and basic feedback</li>
              </ul>
            </Card>

            <Card className="bg-blue-50">
              <Text fw={500} className="mb-2">Before you start:</Text>
              <ul className="space-y-2">
                <li>Find a quiet space</li>
                <li>Test your camera and microphone</li>
                <li>Prepare as you would for a real interview</li>
                <li>Have a stable internet connection</li>
              </ul>
            </Card>
          </Stack>

          <Group justify="center" className="w-full mt-4">
            <Button 
              size="lg" 
              onClick={() => router.push('/interview/setup')}
              className="px-8"
            >
              Start Mock Interview
            </Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
}