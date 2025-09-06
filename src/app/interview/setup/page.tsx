"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Container, Title, Text, Stack, Card, Alert, Group, Loader } from "@mantine/core";
import { useRouter } from "next/navigation";
import { createInterviewRoom, generateSessionId } from "@/lib/daily";

export default function SetupPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);
  const [microphonePermission, setMicrophonePermission] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [creatingRoom, setCreatingRoom] = useState<boolean>(false);

  useEffect(() => {
    checkPermissions();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const checkPermissions = async () => {
    try {
      setLoading(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      setStream(mediaStream);
      setCameraPermission(true);
      setMicrophonePermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setError("");
    } catch (err) {
      setError("Please allow camera and microphone access to continue");
      setCameraPermission(false);
      setMicrophonePermission(false);
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async () => {
    try {
      setCreatingRoom(true);
      setError("");

      // Create Daily.co room
      const sessionId = generateSessionId();
      const roomResponse = await createInterviewRoom(sessionId);

      if (!roomResponse.success) {
        throw new Error(roomResponse.error || 'Failed to create interview room');
      }

      // Clean up local stream before navigating
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      // Navigate to interview room with room URL
      const params = new URLSearchParams({
        roomUrl: roomResponse.room.url,
        sessionId: roomResponse.room.sessionId,
      });
      
      router.push(`/interview/room?${params.toString()}`);
    } catch (error) {
      console.error('Failed to start interview:', error);
      setError(error instanceof Error ? error.message : 'Failed to start interview');
    } finally {
      setCreatingRoom(false);
    }
  };

  return (
    <Container size="lg" className="min-h-screen py-8">
      <Stack gap="xl" align="center">
        <Title order={1}>Pre-Interview Setup</Title>
        
        <Card shadow="lg" padding="xl" radius="md" className="w-full max-w-3xl">
          <Stack gap="lg">
            <Text size="lg" className="text-center">
              Let&apos;s make sure your camera and microphone are working properly
            </Text>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader size="lg" />
              </div>
            ) : (
              <>
                <div className="relative rounded-lg overflow-hidden bg-gray-900">
                  <video 
                    ref={videoRef}
                    autoPlay 
                    muted 
                    playsInline
                    className="w-full h-[400px] object-cover mirror"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                </div>

                {error && (
                  <Alert color="red" title="Permission Required">
                    {error}
                  </Alert>
                )}

                <Stack gap="sm">
                  <Group justify="space-between" className="px-4 py-2 rounded-lg bg-gray-100">
                    <Text>Camera</Text>
                    <Text color={cameraPermission ? "green" : "red"} fw={500}>
                      {cameraPermission ? "✓ Ready" : "✗ Not ready"}
                    </Text>
                  </Group>
                  
                  <Group justify="space-between" className="px-4 py-2 rounded-lg bg-gray-100">
                    <Text>Microphone</Text>
                    <Text color={microphonePermission ? "green" : "red"} fw={500}>
                      {microphonePermission ? "✓ Ready" : "✗ Not ready"}
                    </Text>
                  </Group>
                </Stack>

                <Card className="bg-blue-50">
                  <Text fw={500} className="mb-2">Quick checklist:</Text>
                  <ul className="space-y-1">
                    <li>Good lighting on your face</li>
                    <li>Camera at eye level</li>
                    <li>Quiet environment</li>
                    <li>Professional background</li>
                  </ul>
                </Card>
              </>
            )}

            <Group justify="center" gap="md" className="mt-4">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => router.push('/')}
              >
                Go Back
              </Button>
              
              {!loading && (
                <>
                  {!cameraPermission || !microphonePermission ? (
                    <Button 
                      size="lg"
                      onClick={checkPermissions}
                    >
                      Grant Permissions
                    </Button>
                  ) : (
                    <Button 
                      size="lg"
                      onClick={startInterview}
                      className="px-8"
                      loading={creatingRoom}
                      disabled={creatingRoom}
                    >
                      {creatingRoom ? "Creating Room..." : "Begin Interview"}
                    </Button>
                  )}
                </>
              )}
            </Group>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}