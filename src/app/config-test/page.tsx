"use client";

import { Container, Title, Text, Stack, Card, Badge, Group } from "@mantine/core";
import { useConfig, useServiceConfig } from "@/lib/hooks/use-config";

export default function ConfigTestPage() {
  const { config, status, isReady, hasErrors } = useConfig();
  const dailyService = useServiceConfig('daily');
  const websocketService = useServiceConfig('websocket');

  return (
    <Container size="lg" className="min-h-screen py-8">
      <Stack gap="xl">
        <Title order={1}>Configuration Test</Title>
        
        <Card shadow="lg" padding="xl">
          <Group justify="space-between" className="mb-4">
            <Title order={3}>System Status</Title>
            <Badge color={isReady ? "green" : "red"}>
              {isReady ? "Ready" : "Not Ready"}
            </Badge>
          </Group>
          
          <Stack gap="md">
            <Group justify="space-between">
              <Text>Environment</Text>
              <Badge color={status.isDevelopment ? "blue" : "green"}>
                {status.isDevelopment ? "Development" : "Production"}
              </Badge>
            </Group>
            
            <Group justify="space-between">
              <Text>Has Errors</Text>
              <Badge color={hasErrors ? "red" : "green"}>
                {hasErrors ? "Yes" : "No"}
              </Badge>
            </Group>
          </Stack>
        </Card>

        <Card shadow="lg" padding="xl">
          <Title order={3} className="mb-4">Service Configuration</Title>
          <Stack gap="md">
            <Group justify="space-between">
              <Text>Daily.co Domain</Text>
              <Badge color={dailyService.isConfigured ? "green" : "yellow"}>
                {dailyService.isConfigured ? "Configured" : "Using Placeholder"}
              </Badge>
            </Group>
            
            <Group justify="space-between">
              <Text>WebSocket URL</Text>
              <Badge color={websocketService.isConfigured ? "green" : "yellow"}>
                {websocketService.isConfigured ? "Configured" : "Using Default"}
              </Badge>
            </Group>
          </Stack>
        </Card>

        <Card shadow="lg" padding="xl">
          <Title order={3} className="mb-4">Configuration Values</Title>
          <Stack gap="sm">
            <div>
              <Text size="sm" c="dimmed">App URL</Text>
              <Text family="monospace" size="sm">{config.app.url}</Text>
            </div>
            
            <div>
              <Text size="sm" c="dimmed">WebSocket URL</Text>
              <Text family="monospace" size="sm">{config.app.websocketUrl}</Text>
            </div>
            
            <div>
              <Text size="sm" c="dimmed">Daily Domain</Text>
              <Text family="monospace" size="sm">{config.daily.domain || "Not configured"}</Text>
            </div>
          </Stack>
        </Card>

        <Card shadow="lg" padding="xl" className="bg-blue-50">
          <Text size="sm">
            💡 This page shows the status of your environment configuration. 
            In development, placeholder values are acceptable, but production 
            requires all API keys to be properly configured.
          </Text>
        </Card>
      </Stack>
    </Container>
  );
}