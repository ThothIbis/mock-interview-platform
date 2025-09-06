"use client";

import { Container, Title, Text, Stack, Card, Button, Group, SimpleGrid, Badge } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
  const router = useRouter();

  // Mock data for MVP
  const mockMetrics = {
    duration: "14:32",
    wordsSpoken: 1847,
    fillerWords: 23,
    avgResponseTime: "8.3 seconds",
    speakingRatio: "68%",
    questionsAnswered: 7
  };

  const mockTranscript = [
    { speaker: "Interviewer", text: "Tell me about yourself and what brings you here today." },
    { speaker: "You", text: "I'm a software engineer with 5 years of experience..." },
    { speaker: "Interviewer", text: "Can you describe a challenging situation you faced and how you handled it?" },
    { speaker: "You", text: "In my last role, we had a critical production issue..." },
  ];

  const downloadTranscript = () => {
    const content = mockTranscript
      .map(entry => `${entry.speaker}: ${entry.text}`)
      .join("\n\n");
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interview-transcript.txt';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Container size="lg" className="min-h-screen py-8">
      <Stack gap="xl">
        <div className="text-center">
          <Title order={1} className="mb-4">Interview Complete!</Title>
          <Text size="lg" c="dimmed">
            Great job! Here&apos;s your interview summary and feedback.
          </Text>
        </div>

        {/* Metrics */}
        <Card shadow="lg" padding="xl">
          <Title order={3} className="mb-4">Performance Metrics</Title>
          <SimpleGrid cols={{ base: 2, md: 3 }} spacing="lg">
            <div className="text-center">
              <Text size="xs" c="dimmed">Duration</Text>
              <Text size="xl" fw={700}>{mockMetrics.duration}</Text>
            </div>
            <div className="text-center">
              <Text size="xs" c="dimmed">Words Spoken</Text>
              <Text size="xl" fw={700}>{mockMetrics.wordsSpoken}</Text>
            </div>
            <div className="text-center">
              <Text size="xs" c="dimmed">Filler Words</Text>
              <Text size="xl" fw={700}>{mockMetrics.fillerWords}</Text>
            </div>
            <div className="text-center">
              <Text size="xs" c="dimmed">Avg Response Time</Text>
              <Text size="xl" fw={700}>{mockMetrics.avgResponseTime}</Text>
            </div>
            <div className="text-center">
              <Text size="xs" c="dimmed">Speaking Ratio</Text>
              <Text size="xl" fw={700}>{mockMetrics.speakingRatio}</Text>
            </div>
            <div className="text-center">
              <Text size="xs" c="dimmed">Questions Answered</Text>
              <Text size="xl" fw={700}>{mockMetrics.questionsAnswered}</Text>
            </div>
          </SimpleGrid>
        </Card>

        {/* Transcript Preview */}
        <Card shadow="lg" padding="xl">
          <Group justify="space-between" className="mb-4">
            <Title order={3}>Interview Transcript</Title>
            <Button variant="outline" size="sm" onClick={downloadTranscript}>
              Download Full Transcript
            </Button>
          </Group>
          
          <Stack gap="md" className="max-h-96 overflow-y-auto">
            {mockTranscript.map((entry, index) => (
              <div key={index} className={entry.speaker === "You" ? "ml-8" : "mr-8"}>
                <Badge 
                  color={entry.speaker === "You" ? "blue" : "gray"} 
                  size="sm" 
                  className="mb-1"
                >
                  {entry.speaker}
                </Badge>
                <Card className="bg-gray-50">
                  <Text size="sm">{entry.text}</Text>
                </Card>
              </div>
            ))}
            <Text size="sm" c="dimmed" className="text-center mt-4">
              ... Preview showing first 4 exchanges ...
            </Text>
          </Stack>
        </Card>

        {/* Quick Insights */}
        <Card shadow="lg" padding="xl" className="bg-blue-50">
          <Title order={3} className="mb-3">Quick Insights</Title>
          <ul className="space-y-2">
            <li>✅ Good pace - your response time was consistent</li>
            <li>⚠️ Consider reducing filler words (um, uh, like)</li>
            <li>✅ Strong engagement - good speaking ratio</li>
            <li>✅ Completed all interview questions</li>
          </ul>
        </Card>

        {/* Actions */}
        <Group justify="center" gap="md">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => router.push('/')}
          >
            Back to Home
          </Button>
          <Button 
            size="lg"
            onClick={() => router.push('/interview/setup')}
          >
            Practice Again
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}