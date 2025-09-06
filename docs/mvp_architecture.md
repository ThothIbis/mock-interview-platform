# AI Mock Interview Platform - MVP Technical Architecture

## System Overview

### Architecture Philosophy
Minimize complexity, maximize reliability. Use managed services to avoid infrastructure overhead. Optimize for rapid deployment and iteration.

### Core Components
```
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│   Next.js App   │────▶│  Daily.co    │────▶│  Deepgram   │
│   (Frontend)    │     │  (Video)     │     │   (STT)     │
└─────────────────┘     └──────────────┘     └─────────────┘
         │                                            │
         │                                            ▼
         │              ┌──────────────┐     ┌─────────────┐
         └─────────────▶│   Vercel     │────▶│  Claude 3.5 │
                        │   (API)      │     │   (AI)      │
                        └──────────────┘     └─────────────┘
                                │                     │
                                ▼                     ▼
                        ┌──────────────┐     ┌─────────────┐
                        │   Results    │◀────│ ElevenLabs  │
                        │    Page      │     │   (TTS)     │
                        └──────────────┘     └─────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: Mantine UI
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (automatic from GitHub)

### Services
- **Video**: Daily.co (WebRTC infrastructure)
- **Speech-to-Text**: Deepgram Nova-2 (streaming)
- **AI Conversation**: Claude 3.5 Sonnet
- **Text-to-Speech**: ElevenLabs (streaming)
- **Orchestration**: Pipecat (real-time pipeline)

### Infrastructure
- **Hosting**: Vercel (frontend + API routes)
- **Environment**: Node.js 18+
- **No Database**: Stateless MVP (no persistence)

## Service Integration Details

### Daily.co Configuration
```javascript
// Room configuration
{
  privacy: 'public',  // No auth for MVP
  enable_recording: false,
  max_participants: 2,
  exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
  properties: {
    enable_chat: false,
    enable_screenshare: false,
    start_video_off: false,
    start_audio_off: false
  }
}
```

### Deepgram Streaming Setup
```javascript
// Connection configuration
{
  model: 'nova-2-general',
  language: 'en',
  smart_format: true,
  utterance_end_ms: 1000,  // End of speech detection
  interim_results: true,    // Show real-time transcription
  punctuate: true,
  profanity_filter: false
}
```

### Claude 3.5 Sonnet Prompt Structure
```javascript
const systemPrompt = `You are a professional job interviewer conducting a 15-minute behavioral interview.

PERSONALITY:
- Warm but professional
- Active listener
- Ask follow-up questions based on responses
- Keep conversation natural and flowing

INTERVIEW STRUCTURE:
- Start with "Tell me about yourself"
- Ask 5-7 behavioral questions total
- Spend 2-3 minutes per topic
- End gracefully at 15 minutes

RESPONSE STYLE:
- Keep responses under 50 words
- Ask one question at a time
- Show interest in their answers
- Use their name occasionally

Current Time Elapsed: ${timeElapsed} minutes
Questions Asked: ${questionsAsked}
${questionsAsked >= 5 ? 'Start wrapping up the interview' : ''}`;
```

### ElevenLabs Configuration
```javascript
// Voice synthesis settings
{
  voice_id: 'EXAVITQu4vr4xnSDxMaL',  // "Sarah" - professional female
  model_id: 'eleven_turbo_v2',      // Fastest model
  optimize_streaming_latency: 3,     // Optimize for speed
  voice_settings: {
    stability: 0.5,
    similarity_boost: 0.8,
    style: 0.0,
    use_speaker_boost: true
  }
}
```

## Real-Time Pipeline Architecture

### Pipecat Configuration
```python
# Pipeline structure
pipeline = Pipeline([
    DailyTransport(),           # Audio I/O
    DeepgramSTT(),              # Speech to text
    InterviewOrchestrator(),    # Conversation logic
    ClaudeAssistant(),          # AI responses
    ElevenLabsTTS(),            # Text to speech
    DailyTransport()            # Audio output
])
```

### Conversation State Management
```javascript
// Minimal state for MVP
const interviewState = {
  startTime: Date.now(),
  questionsAsked: [],
  currentTranscript: [],
  isAISpeaking: false,
  timeRemaining: 900, // 15 minutes in seconds
  phase: 'greeting' | 'questions' | 'closing'
};
```

## API Routes Structure

### `/api/interview/create`
- Creates Daily.co room
- Initializes Pipecat pipeline
- Returns room URL and tokens

### `/api/interview/webhook`
- Handles Daily.co events
- Manages interview lifecycle
- Triggers transcript generation

### `/api/interview/results`
- Processes final transcript
- Calculates basic metrics
- Returns formatted results

## Cost Analysis

### Per Interview Breakdown
| Service | Usage | Cost |
|---------|-------|------|
| Daily.co | 30 participant-minutes | $0.105 |
| Deepgram | 15 minutes transcription | $0.065 |
| Claude 3.5 | ~3K tokens | $0.045 |
| ElevenLabs | ~1K characters | $0.110 |
| Vercel | Serverless functions | ~$0.01 |
| **Total** | **Per interview** | **~$0.34** |

### Monthly Projections
- 100 interviews: $34
- 500 interviews: $170
- 1000 interviews: $340

## Performance Optimization

### Latency Reduction Strategies
1. **Streaming Everything**: Don't wait for complete responses
2. **Edge Functions**: Deploy to Vercel Edge for lower latency
3. **Connection Pooling**: Keep warm connections to services
4. **Response Chunking**: Start TTS while Claude is still generating

### Critical Performance Paths
```
Optimization Priority:
1. Deepgram STT (300ms target)
2. Claude response time (1s target)
3. ElevenLabs TTS (400ms target)
Total Target: <2s user-to-response
```

## Error Handling

### Failure Modes
1. **Service Timeout**: Fallback to pre-recorded message
2. **Connection Lost**: Attempt reconnection 3x
3. **AI Error**: Use backup question from bank
4. **Over Time**: Graceful ending message

### User Messaging
- "Experiencing technical difficulties" overlay
- Automatic recovery attempts
- Clear error messages
- Option to restart interview

## Security Considerations

### MVP Security (Minimal)
- No user data storage
- No authentication required
- Rate limiting on API routes (10 requests/minute)
- Environment variables for API keys
- CORS configuration for Daily.co

### Future Security (Post-MVP)
- User authentication
- Encrypted transcripts
- GDPR compliance
- Session recordings encryption

## Deployment Architecture

### Two-Service Architecture
```
┌──────────────────────┐         ┌──────────────────────┐
│   Vercel (Frontend)  │ ──────▶ │  Railway (Backend)   │
│                      │         │                      │
│  • Next.js App       │         │  • WebSocket Server  │
│  • Static Assets     │         │  • Queue Workers     │
│  • API Routes (light)│         │  • Redis Instance    │
└──────────────────────┘         └──────────────────────┘
```

### CI/CD Pipeline
- **Frontend**: GitHub → Vercel (automatic)
- **Backend**: GitHub → Railway (automatic)

### Environment Configuration
```bash
# Frontend (Vercel)
NEXT_PUBLIC_WEBSOCKET_URL=wss://your-app.railway.app
NEXT_PUBLIC_DAILY_DOMAIN=

# Backend (Railway)
REDIS_URL=redis://default:password@redis:6379
DAILY_API_KEY=
DEEPGRAM_API_KEY=
ANTHROPIC_API_KEY=
ELEVENLABS_API_KEY=
```

### Scaling Configuration
```javascript
// config/scaling.js
export const scalingConfig = {
  // Start with these values
  mvp: {
    workers: 1,
    maxConcurrent: 10,
    directProcessing: true
  },
  // Scale to these without code changes
  growth: {
    workers: 3,
    maxConcurrent: 100,
    directProcessing: false
  },
  // Just add more workers
  scale: {
    workers: 10,
    maxConcurrent: 1000,
    directProcessing: false
  }
};

## Monitoring & Observability

### MVP Monitoring
- Vercel Analytics (basic metrics)
- Console logging for debugging
- API route error tracking

### Key Metrics to Track
- Interview completion rate
- Average latency per interaction
- Service error rates
- Cost per interview

## Development Phases

### Phase 1: Foundation (Days 1-3)
- Next.js setup with Mantine
- Daily.co room creation
- Basic UI flow

### Phase 2: Integration (Days 4-7)
- Pipecat pipeline setup
- Service authentication
- Real-time audio flow

### Phase 3: Conversation (Days 8-10)
- Claude integration
- Question management
- State handling

### Phase 4: Polish (Days 11-14)
- Error handling
- Results page
- Performance optimization

### Phase 5: Launch (Day 15)
- Deploy to production
- Monitor initial interviews
- Gather feedback